import './style.css'

/* global document, google */
import { GeoJsonLayer } from '@deck.gl/layers';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';


import zipLoader from './zipLoader'
import { _GeoJSONLoader as GeoJSONLoader } from "@loaders.gl/json";

const styles = {
  default: [],
  hide: [
    {
      featureType: "poi.business",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels.icon",
      stylers: [{ visibility: "off" }],
    },
  ],
};

const GeoJSONLayerOptions = {
  id: 'geojson-layer',
  stroked: true,
  filled: true,
  pickable: true,
  lineWidthMinPixels: 1,
  opacity: 0.2,
  getFillColor: d => {
    if (d.properties.PTN_2015 > 100) return [255, 0, 0];
    if (d.properties.PTN_2015 > 50) return [255, 51, 51];
    if (d.properties.PTN_2015 > 10) return [255, 255, 0];
    if (d.properties.PTN_2015 > 5) return [85, 255, 0];
    return [0, 0, 255]
  },
  getLineColor: [0, 0, 0],
  getLineWidth: 1,

}

let map;

async function initMap() {
  const { Map } = await google.maps.importLibrary("maps");

  const Popup = makepopup(google)

  map = new Map(document.getElementById("map"), {
    center: { lat: 37.1449038, lng: 136.7898429 },
    zoom: 10,
    mapTypeId: 'terrain',
  });

  //map.setOptions({ styles: styles["hide"] });

  const trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);

  const res = await zipLoader("./data/pop_ishikawa.zip", GeoJSONLoader)
  
  const showPopup = d => {
    const p = d.object.properties

    document.getElementById("content").innerHTML = `<span>人口:約${Math.round(p.PTN_2015)}人</span><br><small>MESH_ID:${p.MESH_ID}</small>`

    const popup = new Popup(
      new google.maps.LatLng(p.lat, p.lng),
      document.getElementById("content"),
    );
    popup.setMap(map);
  }

  const geojsonlayer = new GeoJsonLayer({
    ...GeoJSONLayerOptions,
    data:res[0],
    onClick: showPopup
  });

  const overlay = new GoogleMapsOverlay({
    layers: [geojsonlayer],
  });


  overlay.setMap(map);






  // Add controls to the map, allowing users to hide/show features.
  const styleControl = document.getElementById("style-selector-control");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(styleControl);


  const attribute = document.getElementById("attribute");
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(attribute);


  document.getElementById("hide-layer").addEventListener("click", () => {
    overlay.setProps({
      layers: [],
    })
  });
  document.getElementById("show-layer").addEventListener("click", () => {
    const newGeojsonlayer = new GeoJsonLayer({
      ...GeoJSONLayerOptions,
      data: res[0],
      onClick: showPopup
    });
    overlay.setProps({
      layers: [newGeojsonlayer],
    })
  });

}

initMap();


function makepopup(google){
  class Popup extends google.maps.OverlayView {
    position;
    containerDiv;
    constructor(position, content) {
      super();
      this.position = position;
      content.classList.add("popup-bubble");

      // This zero-height div is positioned at the bottom of the bubble.
      const bubbleAnchor = document.createElement("div");

      bubbleAnchor.classList.add("popup-bubble-anchor");
      bubbleAnchor.appendChild(content);
      // This zero-height div is positioned at the bottom of the tip.
      this.containerDiv = document.createElement("div");
      this.containerDiv.classList.add("popup-container");
      this.containerDiv.appendChild(bubbleAnchor);
      // Optionally stop clicks, etc., from bubbling up to the map.
      Popup.preventMapHitsAndGesturesFrom(this.containerDiv);
    }
    /** Called when the popup is added to the map. */
    onAdd() {
      this.getPanes().floatPane.appendChild(this.containerDiv);
    }
    /** Called when the popup is removed from the map. */
    onRemove() {
      if (this.containerDiv.parentElement) {
        this.containerDiv.parentElement.removeChild(this.containerDiv);
      }
    }
    /** Called each frame when the popup needs to draw itself. */
    draw() {
      const divPosition = this.getProjection().fromLatLngToDivPixel(
        this.position,
      );
      // Hide the popup when it is far out of view.
      const display =
        Math.abs(divPosition.x) < 4000 && Math.abs(divPosition.y) < 4000
          ? "block"
          : "none";

      if (display === "block") {
        this.containerDiv.style.left = divPosition.x + "px";
        this.containerDiv.style.top = divPosition.y + "px";
      }

      if (this.containerDiv.style.display !== display) {
        this.containerDiv.style.display = display;
      }
    }
  }

  return Popup
}

