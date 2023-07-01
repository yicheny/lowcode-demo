import { List, Switch } from '@alifd/next';
import {useCallback, useState} from "react";
import {project} from "@alilc/lowcode-engine";

const TestSchema = require('./mocks/test.json')
const searchSchema = require('./mocks/searchTemplate.json')

const MOCK_CONFIG = [
    { text:"查询页", schema:searchSchema },
    { text:"测试页1", schema:TestSchema },
    { text:"测试页2", schema:TestSchema },
    { text:"测试页3", schema:TestSchema },
]

export function TemplatePages(){
    const {onSelect,isSelect} = useSelect()
    return <List style={{padding:'0 16px'}} size={'small'} header={''}  dataSource={MOCK_CONFIG} renderItem={(o,i)=>{
        return <List.Item extra={<Switch checked={isSelect(i)} onChange={(checked)=>{
            onSelect(checked,i)
            project.importSchema(o.schema)
        }}/>}>
            {o.text}
        </List.Item>
    }}/>
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