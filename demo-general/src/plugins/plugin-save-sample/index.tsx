import {IPublicEnumTransformStage, IPublicModelPluginContext} from '@alilc/lowcode-types';
import { Button } from '@alifd/next';
import {
  saveLocalSchema,
  // resetSchema,
} from '../../services/mockService';
import {usePost} from "../../hooks";
import {useCallback} from "react";
import {tryExecute} from "../../utils";
import { message } from 'antd'
import {project} from "@alilc/lowcode-engine";
import {pageStore} from '../../utils'
import _ from 'lodash'

function Save(){
  const saveServerSchema = useSaveServerSchema()
  return (
      <Button onClick={() => {
        saveLocalSchema()
        saveServerSchema()
      }}>
         保存Schema
      </Button>
  )
}

function useSaveServerSchema(){
  const {doFetch} = usePost()

  return useCallback(()=>{
    tryExecute(async ()=> {
      const appInfo = _.get(pageStore.read(),'source')
      if(!appInfo) throw new Error('请选择页面！')
      const schemaContent =  project.exportSchema(IPublicEnumTransformStage.Save)
      appInfo.schemaContent = JSON.stringify(schemaContent)
      await doFetch(`/api/appSchemaInfo/update`,appInfo)
      message.success("Schema保存成功")
    })
  },[])
}

// 保存功能示例
const SaveSamplePlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { skeleton, hotkey } = ctx;

      skeleton.add({
        name: 'saveSample',
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
SaveSamplePlugin.pluginName = 'SaveSamplePlugin';
SaveSamplePlugin.meta = {
  dependencies: ['EditorInitPlugin'],
};
export default SaveSamplePlugin;