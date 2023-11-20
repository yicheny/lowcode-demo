import { IPublicModelPluginContext } from '@alilc/lowcode-types';
import { injectAssets } from '@alilc/lowcode-plugin-inject';
// import assets from '../../services/assets.json';
import { getProjectSchema } from '../../services/mockService';
import _ from 'lodash';
import {AssertsStore, formInputMetaStore} from '../../utils/stores';

const EditorInitPlugin = (ctx: IPublicModelPluginContext, options: any) => {
  return {
    async init() {
      const assets = AssertsStore.read()
      // console.log('assets', assets)

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

      filterComponents(assets);
      setComponents(assets);
      await addComponents(assets);

      const schema = await getProjectSchema(scenarioName);
      dynamicBizMaterial(schema.componentsMap)
      // 加载 schema
      project.importSchema(schema as any);
    },
  };

  //过滤物料
  function filterComponents(assets: any) {
    assets.components = _.filter(assets?.components, (x) => {
      return (
        x?.group === '业务组件' ||
        (x?.group === '精选组件' && x?.category === '表格类' && x?.title === '高级表格') ||
        (x?.group === '精选组件' && x?.title === '对话框')
      );
    });
  }

  //添加物料
  async function addComponents(assets: any) {
    await addFormInputSnippets();

    //动态添加表单物料
    async function addFormInputSnippets() {
      const formInput = getObjectByTitle(assets.components, 'BizFormInput');
      // console.log('formInput', formInput)
      formInput.snippets = formInputMetaStore.read()
      // console.log('formInput.snippets', formInput.snippets)
    }
  }

  function setComponents(assets: any) {
    // console.log('assets.components', assets.components);
    const proTableCom = getObjectByTitle(assets.components, '高级表格');
    // console.log('proTableCom', proTableCom)

    setColumn();
    setActionBarButtons();
    addPaginationProps();
    addEvents();
    addControlProps();
    filterSnippets();

    //保留高级表格
    function filterSnippets() {
      proTableCom.snippets = proTableCom.snippets.filter((x: any) => x?.title === '高级表格');
      // console.log('proTableCom:', proTableCom);
    }

    //操作栏按钮
    function setActionBarButtons() {
      const actionBarProp = getObjectByTitle(proTableCom.configure.props, '操作栏按钮');
      const items = _.get(actionBarProp, 'setter.props.config.items');
      items[1] = {
        name: 'maxCount',
        title: {
          label: '可见数量',
          tip: '超过会收起到”更多“菜单中',
        },
        extraProps: {
          display: 'inline',
          defaultValue: 3,
        },
        setter: {
          componentName: 'NumberSetter',
          props: {
            max: 6,
            min: 1,
            defaultValue: 3,
          },
        },
      };
      items.push({
        name: 'justify',
        setter: {
          componentName: 'RadioGroupSetter',
          props: {
            options: [
              {
                label: '左',
                value: 'start',
              },
              {
                label: '中',
                value: 'center',
              },
              {
                label: '右',
                value: 'end',
              },
            ],
          },
        },
        title: '对齐',
        initialValue: 'start',
      });
    }

    //调整数据列相关设置
    function setColumn() {
      const dataColumnProp = getObjectByTitle(proTableCom.configure.props, '数据列');
      // console.log('dataColumnProp', dataColumnProp)
      const items = _.get(dataColumnProp, 'setter.props.itemSetter.props.config.items');
      // console.log('items', items)
      items[0] = {
        display: 'inline',
        isRequired: true,
        name: 'title',
        setter: 'BizColumnSetter',
        title: '标题',
      };
      items.push({
        display: 'inline',
        name: 'cell',
        componentName: 'FunctionSetter',
        title: '格式化',
      });
    }

    //添加分页器设置
    function addPaginationProps() {
      const dataPaginationProps = getObjectByTitle(proTableCom.configure.props, '分页器');
      const items = _.get(dataPaginationProps, 'setter.props.config.items');
      items.push(
        {
          name: 'pageSizeSelector',
          setter: {
            componentName: 'RadioGroupSetter',
            props: {
              options: [
                {
                  label: 'false',
                  value: false,
                },
                {
                  label: 'filter',
                  value: 'filter',
                },
                {
                  label: 'dropdown',
                  value: 'dropdown',
                },
              ],
            },
          },
          title: '每页显示选择器可选值',
          initialValue: 'dropdown',
        },
        {
          name: 'pageSizePosition',
          title: '每页显示选择器在组件中的位置',
          setter: {
            componentName: 'SelectSetter',
            props: {
              options: [
                {
                  title: 'start',
                  value: 'start',
                },
                {
                  title: 'end',
                  value: 'end',
                },
              ],
            },
          },
        },
      );
    }

    //添加事件分组
    function addEvents() {
      proTableCom.configure.props.push({
        name: 'events',
        title: '表格事件集',
        type: 'group',
        extraProps: {
          defaultCollapsed: true,
          display: 'accordion',
        },
        items: [
          {
            display: 'inline',
            // defaultValue:console.log,
            name: 'onSort',
            componentName: 'FunctionSetter',
            title: '排序事件',
          },
          {
            display: 'inline',
            name:"rowSelection.onChange",
            componentName: 'FunctionSetter',
            title: '选择事件'
          }
        ],
      });
    }

    //------添加受控属性设置-------
    function addControlProps() {
      proTableCom.configure.props.push({
        name: 'controlProps',
        title: '受控属性',
        type: 'group',
        extraProps: {
          defaultCollapsed: false,
          display: 'accordion',
        },
        items: [
          {
            display: 'inline',
            // defaultValue:{counterPartyName:'desc'},
            name: 'sort',
            componentName: 'ObjectSetter',
            title: '排序',
          },
          {
            display: 'inline',
            defaultValue: false,
            name: 'useVirtual',
            componentName: 'BoolSetter',
            title: '虚拟化',
            type: 'field',
          },
        ],
      });
    }
  }

  function getObjectByTitle(list: any[], title: string) {
    return list.find((c: { title: string }) => c.title === title);
  }
};
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
      },
    ],
  },
};
export default EditorInitPlugin;

//TODO 动态设置业务物料库--临时方案
function dynamicBizMaterial(componentsMap: any){
  _.forEach(componentsMap, x=>{
    if(x.package === 'lowcode-material-biz'){
      x.package = 'root-lowcode-material-biz';
      x.version = '0.17.0';
    }
  })
}
