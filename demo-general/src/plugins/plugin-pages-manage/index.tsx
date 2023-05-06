import * as React from 'react'
import {IPublicModelPluginContext} from "@alilc/lowcode-types";
import {useMemo, useState} from "react";
import {project} from '@alilc/lowcode-engine';
import {saveSchema} from "../../services/mockService";
import {store} from "../../utils";
import {SCHEMA_ACTIVE_KEY} from "../../utils/Store";
import {List,message} from 'antd'
import classes from './index.module.scss'
import {MinusCircleOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons'
import clsx from "clsx";

const {Item} = List;
const schema1 = require('./schema1.json');
const schema2 = require('./schema2.json');

type ItemInfo = {
    key: string,
    title: string,
    data: any
}

function PagesManage() {
    const data = useData();
    const [active, setActive] = useState(store.get(SCHEMA_ACTIVE_KEY))

    const handleClick = (x:ItemInfo) => {
        if(store.get(SCHEMA_ACTIVE_KEY) === x.key) return
        setActive(x.key)
        switchSchema(x)
    }

    return <List dataSource={data} renderItem={(x: ItemInfo) => {
        return <Item key={x.key} className={clsx(classes.item, {[classes.active]: active === x.key})} onClick={()=>handleClick(x)}>
            <span>{x.title}</span>
            <span>
                <PlusCircleOutlined style={{fontSize:18}} onClick={() => message.info("暂未实现新增")}/>
                <EditOutlined style={{fontSize:18,marginLeft:12}} onClick={() => message.info("暂未实现编辑")}/>
                <MinusCircleOutlined style={{fontSize:18,marginLeft:12}} onClick={() => message.info("暂未实现删除")}/>
            </span>
        </Item>
    }}/>
}

function switchSchema(x: any) {
    project.importSchema(x.data)
    store.set(SCHEMA_ACTIVE_KEY, x.key)
    saveSchema()
}

function useData() {
    return useMemo(() => {
        return [
            {title: "首页", key: "home", data: schema1},
            {title: "测试页1", key: "test1", data: schema2},
        ]
    }, [])
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