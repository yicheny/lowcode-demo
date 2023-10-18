import {formInputMetaStore} from "../utils/stores";
import _ from 'lodash'

export function transformComponentsTree(componentsTree: any) {
    // console.log('transformComponentsTree', componentsTree)
    const snippetsMap = createSnippetsMap()
    transformCore(componentsTree)

    function createSnippetsMap(){
        const snippets = formInputMetaStore.read()
        // console.log('snippets', snippets)
        if(!snippets) throw new Error('snippets没有读取到数据！');
        const result = new Map();
        _.forEach(snippets,x=>{
            // console.log('x', x)
            if(x.title === '对手方') console.log(x.schema.props)
            result.set(x.schema.props.bindKey, x.schema.props)
        })
        return result
    }

    function transformCore(data:any){
        // console.log('transformCore', data)
        _.forEach(data, x=>{
            // console.log('x', x)

            if(typeof x !== 'object') return ;
            if(x.children) transformCore(x.children)
            if(_.get(x,'props.children.value')) transformCore(x.props.children.value)
            if(x.componentName !== 'BizFormInput') return

            const key = _.get(x,'props.bindKey')
            if(!key) throw new Error(`BizFormInput组件未绑定key!`)
            const props = snippetsMap.get(key);
            // console.log('key', x.props.nameChinese, key, props)
            _.assign(x.props, props);
        })
    }
}