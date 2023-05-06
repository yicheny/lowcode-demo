import * as React from 'react'
import {IPublicModelPluginContext} from "@alilc/lowcode-types";
import {useMemo, useState} from "react";
import {project} from '@alilc/lowcode-engine';
import {saveSchema} from "../../services/mockService";
import {store} from "../../utils";
import {PROJECT_KEY, SCHEMA_ACTIVE_KEY} from "../../utils/Store";
import {List,message,Select} from 'antd'
import {MinusCircleOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons'
import clsx from "clsx";
import AddModal from "./opeartions/add";
import classes from './index.module.scss'

const {Item} = List;
const schema1 = require('./schema1.json');
const schema2 = require('./schema2.json');

type ItemInfo = {
    key: string,
    title: string,
    data: any
}

function PagesManage() {
    const projectList = useProjectList()
    const schemaList = useSchemaList();
    const [active, setActive] = useState(store.get(SCHEMA_ACTIVE_KEY))
    const [project,setProject] = useState(store.get(PROJECT_KEY))

    const selectSchema = (x:ItemInfo) => {
        if(store.get(SCHEMA_ACTIVE_KEY) === x.key) return
        setActive(x.key)
        store.set(SCHEMA_ACTIVE_KEY, x.key)
        store.set(PROJECT_KEY, project)
        switchSchema(x)
    }

    const selectProject = (value:string) => {
        setProject(value)
    }

    return <>
        <div style={{marginLeft:16}}>
            当前环境：<Select options={projectList} defaultValue={project} style={{ width: 120 }} onChange={selectProject}/>
        </div>
        <List dataSource={schemaList} renderItem={(x: ItemInfo) => {
            return <Item key={x.key} className={clsx(classes.item, {[classes.active]: active === x.key})} onClick={()=>selectSchema(x)}>
                <span>{x.title}</span>
                <span>
                <PlusCircleOutlined style={{fontSize:18}} onClick={() => message.info("暂未实现新增")}/>
                <EditOutlined style={{fontSize:18,marginLeft:12}} onClick={() => message.info("暂未实现编辑")}/>
                <MinusCircleOutlined style={{fontSize:18,marginLeft:12}} onClick={() => message.info("暂未实现删除")}/>
            </span>
            </Item>
        }}/>
        <AddModal open={false}/>
    </>
}

function switchSchema(x: any) {
    project.importSchema(x.data)
    saveSchema()
}

function useSchemaList() {
    return useMemo(() => {
        return [
            {title: "首页", key: "home", data: schema1},
            {title: "测试页1", key: "test1", data: schema2},
        ]
    }, [])
}

function useProjectList(){
    return useMemo(()=>{
        return [
            { label:"otcd", value:'otcd'},
            { label:"sbl", value:'sbl'},
        ]
    },[])
}

const PagesManagePlugin = (ctx: IPublicModelPluginContext) => {
    return {
        async init() {
            const {skeleton} = ctx;
            skeleton.add({
                area: "leftArea",
                type: "PanelDock",
                content: PagesManage,
                name: "PagesManage",
                contentProps: {},
                props: {
                    align: "top",
                    icon: 'zujianku',
                    description: "schema管理"
                }
            })
        }
    }
}
PagesManagePlugin.pluginName = 'PagesManagePlugin'
PagesManagePlugin.meta = {};
export default PagesManagePlugin