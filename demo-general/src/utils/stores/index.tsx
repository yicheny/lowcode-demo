import {ProxyStore} from "./ProxyStore";

export const loginStore = ProxyStore.create('login_info')
export const projectStore = ProxyStore.create('project_id')
export const pageStore = ProxyStore.create('page_id')
export const schemaIdStore = ProxyStore.create('schema_id')

export const SCENARIO_NAME = "general"
