import {ProxyStore} from "./ProxyStore";

export {store} from './StoreCore'
export const loginStore = ProxyStore.create('login_info')
export const PROJECT_KEY = 'project_id'
//列表项 ID
export const PAGE_ACTIVE_KEY = 'page_id'
//Schema ID
export const SCHEMA_ACTIVE_ID = 'schema_id'
export const SCENARIO_NAME = "general"
