import {IPublicEnumTransformStage, IPublicModelPluginContext} from '@alilc/lowcode-types';
import { Button } from '@alifd/next';
import {loginStore, pageStore} from "../../utils";
import {project} from "@alilc/lowcode-engine";
import {usePost} from "../../hooks";
import {message} from "antd";

function Com(){
    const {doFetch} = usePost()
    return (
        <Button onClick={() => {
            const pageInfo = pageStore.read()?.source;
            const schemaContent =  project.exportSchema(IPublicEnumTransformStage.Save)
            if(!pageInfo) return message.error("请在schema管理选择对应项！")
            const appInfo = {
                createUser:loginStore.read()?.userId,
                schemaContent:JSON.stringify(schemaContent),
                schemaId:pageInfo?.schemaId,
                schemaName:pageInfo?.schemaName,
            }
            // console.log('pageInfo', pageInfo, appInfo)
            doFetch('/schema/snapshot',appInfo)
            message.success(`发布成功！`)
        }}>
            发布
        </Button>
    )
}

const PublishPagePlugin = (ctx: IPublicModelPluginContext) => {
    return {
        async init() {
            const { skeleton, hotkey } = ctx;

            skeleton.add({
                name: 'publishPage',
                area: 'topArea',
                type: 'Widget',
                props: {
                    align: 'right',
                },
                content: Com,
            });
            /* skeleton.add({
               name: 'resetSchema',
               area: 'topArea',
               type: 'Widget',
               props: {
                 align: 'right',
               },
               content: (
                 <Button onClick={() => resetSchema()}>
                   重置页面
                 </Button>
               ),
             });*/
            /*hotkey.bind('command+s', (e) => {
              e.preventDefault();
              // saveSchema();
            });*/
        },
    };
}
PublishPagePlugin.pluginName = 'PublishPagePlugin';
PublishPagePlugin.meta = {
    dependencies: ['EditorInitPlugin'],
};
export default PublishPagePlugin;