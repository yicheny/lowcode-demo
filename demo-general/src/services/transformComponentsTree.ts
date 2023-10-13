import {formInputMetaStore} from "../utils/stores";

export function transformComponentsTree(componentsTree: any) {
    const snippets = formInputMetaStore.read()
    console.log('transformComponentsTree', snippets, componentsTree)
}