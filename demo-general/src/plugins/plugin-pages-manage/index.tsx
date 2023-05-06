import * as React from 'react'
import {Nav} from "@alifd/next";
import {IPublicModelPluginContext} from "@alilc/lowcode-types";
import {useMemo, useState} from "react";
import _ from 'lodash'
import { project } from '@alilc/lowcode-engine';
import {saveSchema} from "../../services/mockService";
import {store} from "../../utils";
import {SCHEMA_ACTIVE_KEY} from "../../utils/Store";

const {Item} = Nav;
const schema1 = require('./schema1.json');
const schema2 = require('./schema2.json');

function PagesManage() {
    const data = useData();


    return <Nav type={'line'} defaultOpenAll defaultSelectedKeys={[store.get(SCHEMA_ACTIVE_KEY)]}>
        {
            _.map(data, x => {
                return <Item key={x.key} onClick={()=>switchSchema(x)}>{x.title}</Item>
            })
        }
    </Nav>
}

function switchSchema(x:any){
    // console.log('switchSchema', data)
    project.importSchema(x.data)
    store.set(SCHEMA_ACTIVE_KEY,x.key)
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