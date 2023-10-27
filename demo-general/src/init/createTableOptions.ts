import {lowApi} from "../utils";
import _ from "lodash";
import {safeParse} from "@alilc/lowcode-plugin-datasource-pane/lib/utils/misc";
// @ts-ignore
import * as core from '@alilc/lowcode-renderer-core/lib'

const {transformStringToFunction} = core.utils

//创建表格配置数据集
export async function createTableOptions() {
    const data = await lowApi.post(`/api/material/query`)

    const options = _.map(data, x => {
        const o = safeParse(x.extend);
        // _.setWith(o, 'option.cell', transformStringToFunction(x.formatContent))
        _.setWith(o, 'option.cell', {type: "JSExpression", value: x.formatContent})
        // console.log('o', o);
        return o;
    })

    // console.log('createTableOptions', options)

    return options;
}