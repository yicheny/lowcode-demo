import {useEffect, useMemo} from "react";
import _ from "lodash";
import {usePost} from "../../hooks";
import {tryExecute} from "../../utils";
import {safeParse} from "@alilc/lowcode-plugin-datasource-pane/lib/utils/misc";
// @ts-ignore
import * as core from '@alilc/lowcode-renderer-core/lib'

const {transformStringToFunction} = core.utils

export function useOption(){
    const {data,doFetch} = usePost()

    useEffect(()=>{
        tryExecute(async ()=>{
            await doFetch(`/material/query`)
        })
    },[doFetch])

    const option = useMemo(()=>{
        // console.log('data', data)
        return _.map(data,x =>{
            const o = safeParse(x.extend);
            _.setWith(o, 'option.cell', transformStringToFunction(x.formatContent))
            // console.log('o', o);
            return o;
        })
    },[data])

    return {option}
}