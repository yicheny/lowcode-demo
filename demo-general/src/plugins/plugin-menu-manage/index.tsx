import {IPublicModelPluginContext} from "@alilc/lowcode-types";
import {MenuManage} from "./MenuManage";

const MenuManagePlugin = (ctx: IPublicModelPluginContext) => {
    return {
        async init() {
            const {skeleton} = ctx;
            skeleton.add({
                area: "leftArea",
                type: "PanelDock",
                content: MenuManage,
                name: "MenuManage",
                contentProps: {},
                props: {
                    align: "top",
                    icon: 'zujianku',
                    description: "菜单管理"
                }
            })
        }
    }
}
MenuManagePlugin.pluginName = 'MenuManage'
MenuManagePlugin.meta = {};
export default MenuManagePlugin