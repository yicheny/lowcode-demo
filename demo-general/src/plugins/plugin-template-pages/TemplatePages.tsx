import { List, Switch } from '@alifd/next';
import {useCallback, useState} from "react";

const MOCK_CONFIG = [
    { text:"查询页", schema:null },
    { text:"测试页1", schema:null },
    { text:"测试页2", schema:null },
    { text:"测试页3", schema:null },
]

export function TemplatePages(){
    const {onSelect,isSelect} = useSelect()
    return <List style={{padding:'0 16px'}} size={'small'} header={''}  dataSource={MOCK_CONFIG} renderItem={(o,i)=>{
        return <List.Item extra={<Switch checked={isSelect(i)} onChange={(checked)=>onSelect(checked,i)}/>}>
            {o.text}
        </List.Item>
    }}/>
}

function useSelect(){
    const [select,setSelect] = useState<number>(-1)

    const onSelect = useCallback((checked, id)=>{
        setSelect(checked ? id : -1)
    },[])

    const isSelect = useCallback((id)=>{
        return select === id;
    },[select])

    return {onSelect,isSelect}
}