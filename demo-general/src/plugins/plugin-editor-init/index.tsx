import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { injectAssets } from '@alilc/lowcode-plugin-inject';
import assets from '../../services/assets.json';
import { getProjectSchema } from '../../services/mockService';
import _ from 'lodash';

const EditorInitPlugin = (ctx: IPublicModelPluginContext, options: any) => {
  return {
    async init() {
      const { material, project, config } = ctx;
      const scenarioName = options['scenarioName'];
      const scenarioDisplayName = options['displayName'] || scenarioName;
      const scenarioInfo = options['info'] || {};
      // 保存在 config 中用于引擎范围其他插件使用
      config.set('scenarioName', scenarioName);
      config.set('scenarioDisplayName', scenarioDisplayName);
      config.set('scenarioInfo', scenarioInfo);

      // 设置物料描述
      await material.setAssets(await injectAssets(assets));

      setComponents(assets)

      const schema = await getProjectSchema(scenarioName);
      // 加载 schema
      project.importSchema(schema as any);
    },
  };

  function setComponents(assets:any){
    // console.log('assets.components', assets.components);
    const proTableCom = getObjectByTitle(assets.components,'高级表格')
    // console.log('proTableCom', proTableCom)

    setColumn();
    addEvents();
    addControlProps();

    //调整数据列相关设置
    function setColumn(){
      const dataColumnProp = getObjectByTitle(proTableCom.configure.props,'数据列')
      // console.log('dataColumnProp', dataColumnProp)
      const items = _.get(dataColumnProp,'setter.props.itemSetter.props.config.items')
      // console.log('items', items)
      items[0] = {
        display: 'inline',
        isRequired: true,
        name: "title",
        setter: "BizColumnSetter",
        title: "标题"
      }
      items.push({
        display: 'inline',
        name: "cell",
        componentName: 'FunctionSetter',
        title: "格式化",
      })
    }

    //添加事件分组
    function addEvents(){
      proTableCom.configure.props.push({
        name:"events",
        title:"表格事件集",
        type:"group",
        extraProps:{
          defaultCollapsed: true,
          display:'accordion'
        },
        items: [
          {
            display:'inline',
            // defaultValue:console.log,
            name:"onSort",
            componentName: 'FunctionSetter',
            title:"排序事件"
          }
        ]
      })
    }

    //------添加受控属性设置-------
    function addControlProps(){
      proTableCom.configure.props.push({
        name:"controlProps",
        title:"受控属性",
        type:"group",
        extraProps:{
          defaultCollapsed: true,
          display:'accordion'
        },
        items: [
          {
            display:'inline',
            // defaultValue:{counterPartyName:'desc'},
            name:"sort",
            componentName: 'ObjectSetter',
            title:"排序"
          }
        ]
      })
    }

    function getObjectByTitle(list:any[],title:string){
      return list.find((c: { title: string; }) => c.title === title)
    }
  }
}
EditorInitPlugin.pluginName = 'EditorInitPlugin';
EditorInitPlugin.meta = {
  preferenceDeclaration: {
    title: '保存插件配置',
    properties: [
      {
        key: 'scenarioName',
        type: 'string',
        description: '用于localstorage存储key',
      },
      {
        key: 'displayName',
        type: 'string',
        description: '用于显示的场景名',
      },
      {
        key: 'info',
        type: 'object',
        description: '用于扩展信息',
      }
    ],
  },
};
export default EditorInitPlugin;