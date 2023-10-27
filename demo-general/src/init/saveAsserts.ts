import {lowApi} from "../utils";
import assert from "../services/assets.json";

export async function saveAsserts(){
    await lowApi.post('/api/appAssetInfoConfig/save',{
        version:'default',
        appId:'default',
        updateUser:"root",
        createUser:"root",
        appName:"default",
        assetContent: JSON.stringify(assert)
    })
}