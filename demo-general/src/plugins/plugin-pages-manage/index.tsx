import * as React from 'react'
import { Nav } from "@alifd/next";
import {IPublicModelPluginContext} from "@alilc/lowcode-types";

const {Item} = Nav;

function PagesManage() {
    return <Nav type={'line'} defaultOpenAll>
        <Item key={'home'}>首页</Item>
        <Item key={'login'}>登录页</Item>
    </Nav>
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
                    description: "路由管理"
                }
            })
        }
    }
}
PagesManagePlugin.pluginName = 'PagesManagePlugin'
PagesManagePlugin.meta = {};
export default PagesManagePlugin