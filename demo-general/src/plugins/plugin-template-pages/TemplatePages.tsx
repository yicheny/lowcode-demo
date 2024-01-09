import { List, Switch } from '@alifd/next';
import {useCallback, useEffect, useMemo, useState} from "react";
import {project} from "@alilc/lowcode-engine";
import {usePost} from "../../hooks";
import {safeParse} from "@alilc/lowcode-plugin-datasource-pane/lib/utils/misc";
import _ from 'lodash'
import {globalControl} from "../../utils";

// const TestSchema = require('./mocks/test.json')
// const searchSchema = require('./mocks/searchTemplate.json')

// const MOCK_CONFIG = [
//     { text:"查询页", schema:searchSchema },
//     { text:"测试页1", schema:TestSchema },
//     { text:"测试页2", schema:TestSchema },
//     { text:"测试页3", schema:TestSchema },
// ]

export function TemplatePages(){
    const {onSelect,isSelect} = useSelect()
    // const dataSource = MOCK_CONFIG;
    const {config} = useConfig()
    return <>
        {/*<Button type={'primary'} style={{marginLeft:12}} onClick={refresh}>刷新列表</Button>*/}
        <List style={{padding:'0 16px'}} size={'small'} header={''}  dataSource={config} renderItem={(o,i)=>{
            return <List.Item extra={<Switch checked={isSelect(i)} onChange={(checked)=>{
                onSelect(checked,i)
                project.importSchema(o.schema)
            }}/>}>
                {o.text}
            </List.Item>
        }}/>
    </>
}

function useSelect(){
    const [select,setSelect] = useState<number>(-1)

    const onSelect = useCallback((checked, id)=>{
        // setSelect(checked ? id : -1)
        setSelect(id) //目前设置不允许取消
    },[])

    const isSelect = useCallback((id)=>{
        return select === id;
    },[select])

    return {onSelect,isSelect}
}

function useConfig(){
    const {doFetch,data} = usePost()

    const refresh = useCallback(()=>{
        doFetch(`/app/template/query`,{})
    },[])

    useEffect(()=>refresh(),[])

    useEffect(()=>{
        globalControl.setTemplateRefresh(refresh)
    },[refresh])

    const config = useMemo(()=>{
        return _.map(data,x=>({
            text:x.templateName,
            schema:safeParse(x.templateContent),
        }))
    },[data])

    return {config,refresh}
}