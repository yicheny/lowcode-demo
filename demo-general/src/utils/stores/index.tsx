import {ProxyStore} from "./ProxyStore";

export const loginStore = ProxyStore.create('login_info')
export const envStore = ProxyStore.create('env_id')
export const appStore = ProxyStore.create('app_id')
export const pageStore = ProxyStore.create('page_id')
export const schemaIdStore = ProxyStore.create('schema_id')
export const formInputMetaStore = ProxyStore.create('form_input_meta_id')

export const SCENARIO_NAME = "general"
