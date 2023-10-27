import {formInputMetaStore, TableMetaStore} from "../utils/stores";
import _ from 'lodash'

export function transformComponentsTree(componentsTree: any) {
    // console.log('transformComponentsTree', componentsTree)
    transformFormInput()
    transformTable()

    //动态渲染表单物料元数据
    function transformFormInput() {
        const snippetsMap = createSnippetsMap()
        transformCore(componentsTree)

        function createSnippetsMap() {
            const snippets = formInputMetaStore.read()
            // console.log('snippets', snippets)
            if (!snippets) throw new Error('createSnippetsMap报错：formInputMetaStore没有读取到数据！');
            const result = new Map();
            _.forEach(snippets, x => {
                // console.log('x', x)
                // if(x.title === '对手方') console.log(x.schema.props)
                result.set(x.schema.props.bindKey, x.schema.props)
            })
            return result
        }

        function transformCore(data: any) {
            // console.log('transformCore', data)
            _.forEach(data, x => {
                // console.log('x', x)

                if (typeof x !== 'object') return;
                if (x.children) transformCore(x.children)
                if (_.get(x, 'props.children.value')) transformCore(x.props.children.value)
                if (x.componentName !== 'BizFormInput') return

                const key = _.get(x, 'props.bindKey')
                if (!key) throw new Error(`BizFormInput组件未绑定key!`)
                const props = snippetsMap.get(key);
                // console.log('key', x.props.nameChinese, key, props)
                _.assign(x.props, props);
            })
        }
    }

    //动态渲染表格数据项
    function transformTable() {
        const optionsMap = createOptionsMap()
        transformCore(componentsTree)

        function createOptionsMap() {
            const options = TableMetaStore.read()
            // console.log('snippets', snippets)
            if (!options) throw new Error('createOptionsMap：TableMetaStore没有读取到数据！');
            const result = new Map();
            _.forEach(options, x => {
                // if(x.label === '币种') console.log('x', x, x.option.cell('00'))

                // console.log('x', x.option.dataIndex, x.option)
                //TODO 暂时使用dataIndex作为Key，理论上每项应该有一个唯一key，等待后端添加
                result.set(x.option.dataIndex, x.option)
            })
            return result
        }

        function transformCore(data: any) {
            // console.log('transformCore', data)
            _.forEach(data, x => {
                // console.log('x', x)

                if (typeof x !== 'object') return;
                if (x.children) transformCore(x.children)
                if (x.componentName !== "ProTable") return

                // console.log('x', x)
                const columns = _.get(x, 'props.columns')
                if (!columns) throw new Error('未获取到Table组件的columns配置！');

                _.forEach(columns, c => {
                    // console.log(c);
                    // console.log('dataIndex', c.dataIndex, optionsMap.get(c.dataIndex))
                    const dynamicColumn = optionsMap.get(c.dataIndex)
                    _.assign(c,dynamicColumn)
                })

            })
        }
    }
}