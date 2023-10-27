import {lowApi} from "../utils";
import {safeParse} from "@alilc/lowcode-plugin-datasource-pane/lib/utils/misc";
import _ from 'lodash'

export async function createAsserts(){
    const asserts = await lowApi.post('/api/appAssetInfoConfig/query',{
        version:'default',
        appId:'default'
    })
    return safeParse(_.get(asserts,'assetContent'))
}