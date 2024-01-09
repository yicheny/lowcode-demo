import {IPublicEnumTransformStage, IPublicModelPluginContext} from '@alilc/lowcode-types';
import { Button } from '@alifd/next';
import {usePost} from "../../hooks";
import {useCallback, useState} from "react";
import {globalControl, loginStore, tryExecute} from "../../utils";
import {Input, message, Modal} from 'antd'
import {project} from "@alilc/lowcode-engine";

function Save(){
  const [open,setOpen] = useState(false)
  return <>
    <Button onClick={() => {
      setOpen(true)
    }}>
      存为模板
    </Button>
    {open && <EditModal close={()=>setOpen(false)}/>}
  </>
}

interface EditModalProps{
  close:()=>void
}
function EditModal({close}:EditModalProps){
  const [value,setValue] = useState('')
  const save = useSaveTemplate()

  const onOk = ()=>{
    if(!value) return message.error("请填写模板名称！")
    save(value,close);
  }

  return <Modal title={'保存模板'}
                open
                onOk={onOk}
                onCancel={close}>
    <Input placeholder={'请输入模板名称……'} onBlur={e=>setValue(e.target.value as string)}/>
  </Modal>
}

function useSaveTemplate(){
  const {doFetch} = usePost()

  return useCallback((templateName,close)=>{
    tryExecute(async ()=> {
      const schemaContent =  project.exportSchema(IPublicEnumTransformStage.Save)
      const user = loginStore.read()?.userId
      const appInfo = {
        templateName,
        templateContent:JSON.stringify(schemaContent),
        createUser:user,
        updateUser:user,
      }
      // console.log('appInfo', appInfo)
      await doFetch(`/app/template/save`,appInfo)
      message.success("保存成功！")
      globalControl.getTemplateRefresh()()
      close()
    })
  },[doFetch])
}

// 保存功能示例
const SaveTemplatePlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { skeleton, hotkey } = ctx;

      skeleton.add({
        name: 'saveTemplate',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
        },
        content: Save,
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
SaveTemplatePlugin.pluginName = 'SaveTemplatePlugin';
SaveTemplatePlugin.meta = {
  dependencies: ['EditorInitPlugin'],
};
export default SaveTemplatePlugin;