
//zipファイルを読み込み解凍してパースするスクリプト
//loaders.glに依存

/* 依存関係をインストール
npm install @loaders.gl/core @loaders.gl/zip

/*　使い方
import zipLoader from './Util/zipLoader'
import { _GeoJSONLoader as GeoJSONLoader } from "@loaders.gl/json";


useEffect(() => {
    const  loadData =  async (url)=>{
        const res = await zipLoader(url, GeoJSONLoader, (d)=>{
            //console.log(d) //ローディング処理
        })   
        console.log(res)
    }
    
    loadData("./data/example.zip")

}, [])


*/


import { load, fetchFile, parse } from "@loaders.gl/core";
import { ZipLoader } from "@loaders.gl/zip";

const readData = async (r, callback) => {
    const reader = r.body.getReader();

    // Step 2: 合計の長さを取得します
    const contentLength = +r.headers.get('Content-Length');

    // Step 3: データを読み込みます
    let receivedLength = 0; // その時点の長さ
    let chunks = []; // 受信したバイナリチャンクの配列(本文を構成します)
    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            break;
        }

        chunks.push(value);
        receivedLength += value.length;
        if (callback) callback(~~(receivedLength / contentLength * 100));
    }

    // Step 4: チャンクを1つの Uint8Array に連結します
    let chunksAll = new Uint8Array(receivedLength); // (4.1)
    let position = 0;
    for (let chunk of chunks) {
        chunksAll.set(chunk, position); // (4.2)
        position += chunk.length;
    }

    return chunksAll;

}

//zip読み込み
export default async (url, parser, setLoadReceived) => {

    const r = await fetchFile(url);

    const splitURL = url.split("/");
    const fileName = splitURL[splitURL.length - 1];

    const body = readData(r, function (rate) {
        setLoadReceived && setLoadReceived({
            fileName: fileName,
            rate: rate
        })
    });
    const zip = await load(body, ZipLoader);
    const keys = await Object.keys(zip);


    let res = [];

    for (let i = 0; i < keys.length; i++) {
        const r = await parse(zip[keys[i]], parser)
        res.push(r)
    }


    return res;
}