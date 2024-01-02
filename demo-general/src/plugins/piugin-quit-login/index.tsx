import {IPublicModelPluginContext} from '@alilc/lowcode-types';
import { Button } from '@alifd/next';
import {loginStore} from "../../utils";

function Quit(){
    return (
        <Button onClick={() => {
            loginStore.write(null);
            window.location.reload()
        }}>
            退出登录
        </Button>
    )
}

const QuitLoginPlugin = (ctx: IPublicModelPluginContext) => {
    return {
        async init() {
            const { skeleton, hotkey } = ctx;

            skeleton.add({
                name: 'quitLogin',
                area: 'topArea',
                type: 'Widget',
                props: {
                    align: 'right',
                },
                content: Quit,
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
QuitLoginPlugin.pluginName = 'QuitLoginPlugin';
QuitLoginPlugin.meta = {
    dependencies: ['EditorInitPlugin'],
};
export default QuitLoginPlugin;