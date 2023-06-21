import {IPublicModelPluginContext} from "@alilc/lowcode-types";
import {TemplatePages} from "./TemplatePages";

const TemplatePagesPlugin = (ctx: IPublicModelPluginContext) => {
    return {
        async init() {
            const {skeleton} = ctx;
            skeleton.add({
                area: "leftArea",
                type: "PanelDock",
                content: TemplatePages,
                name: "TemplatePages",
                contentProps: {},
                props: {
                    align: "top",
                    icon: 'zujianku',
                    description: "模板页"
                }
            })
        }
    }
}
TemplatePagesPlugin.pluginName = 'TemplatePagesPlugin'
TemplatePagesPlugin.meta = {};
export default TemplatePagesPlugin