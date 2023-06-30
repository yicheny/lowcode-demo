import * as React from 'react'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {IPublicModelPluginContext} from "@alilc/lowcode-types";
import {project} from '@alilc/lowcode-engine';
import {pageStore, tryExecute, utils, appStore, envStore} from "../../utils";
import {Input, List, Select} from 'antd'
import {EditOutlined, MinusCircleOutlined, PlusCircleOutlined} from '@ant-design/icons'
import clsx from "clsx";
import AddModal from "./opeartions/add";
// @ts-ignore
import classes from './index.module.scss'
import {useOpen, usePost} from "../../hooks";
import DelModal from "./opeartions/del";
import _ from 'lodash'
import {saveLocalSchema} from "../../services/mockService";
import {OPEN} from "../../hooks/useOpen";

const {Item} = List;

type SLInfo = {
    key: string,
    title: string,
    source: any
}

export type AppInfo = {
    id:string,
    appId:string,
    appName:string,
    version:string,
    schemaName:string,
    schemaId:string,
    resource:string
}

type EvnInfo = {
    label: string,
    value: string,
    source: AppInfo[]
}

const emptyAppInfo = {appId: "", appName: "", id: "", resource: "", schemaId: "", schemaName: "", version: ""}

function PagesManage() {
    const {active, selectSchema} = useSchema()
    const [envInfo, setEnvInfo] = useState<EvnInfo>(envStore.read())
    const {openInfo, setOpenInfo, checkOpenType, close} = useOpen()
    const envList = useEnvList()
    // @ts-ignore
    const versionList = useVersion(envInfo?.source)
    const {appInfo,setAppInfo} = useAppInfo()
    const {schemaList, refreshSchemaList} = useSchemaList(appInfo);
    const {filteredList,setFilterKey} = useFilter(schemaList)

    // console.log('appInfo', appInfo)

    // console.log('schemaList', schemaList)

    const selectEnv = (value: string, items: any) => {
        // console.log(value,items)
        setEnvInfo(items)
        envStore.write(items)
        setAppInfo(emptyAppInfo)
    }

    const selectApp = (value: string, items: any) => {
        // console.log(value,items)
        setAppInfo(items.source)
    }

    const dialogInfo = {
        close,
        info: openInfo.info,
        type: openInfo.type,
        refresh: refreshSchemaList
    }

    // console.log('appInfo',appInfo)
    return <>
        <div style={{marginLeft: 16}}>
            当前环境：<Select placeholder={'请选择项目'} options={envList} style={{width: 150}} value={envInfo?.value}
                             onChange={selectEnv}/>
            <br/>
            环境版本：<Select placeholder={'请选择版本'} options={versionList} style={{width: 150}} value={appInfo?.id}
                             onChange={selectApp}/>
            <PlusCircleOutlined style={{fontSize: 18, marginLeft: 12}}
                                onClick={() => setOpenInfo({type: OPEN.ADD, info: appInfo})}/>
            <br/>
            <Input.Search placeholder={'搜索schema项'} style={{width: 240, marginTop: 8}}
                          onChange={(e) => setFilterKey(e.target.value)}/>
        </div>
        <List dataSource={filteredList} renderItem={(x: SLInfo) => {
            return <Item key={x.key} className={clsx(classes.item, {[classes.active]: active.key === x.key})}
                         onClick={() => {
                             selectSchema(x);
                         }}>
                <span>{x.title}</span>
                <span>
                <EditOutlined style={{fontSize: 18, marginLeft: 12}}
                              onClick={() => setOpenInfo({
                                  type: OPEN.EDIT,
                                  info: x.source
                              })}/>
                <MinusCircleOutlined style={{fontSize: 18, marginLeft: 12}}
                                     onClick={() => setOpenInfo({
                                         type: OPEN.DEL,
                                         info: x.source
                                     })}/>
            </span>
            </Item>
        }}/>
        <AddModal title={'新增'} open={checkOpenType(OPEN.ADD)} {...dialogInfo} />
        <AddModal title={'编辑'} open={checkOpenType(OPEN.EDIT)} {...dialogInfo}/>
        <DelModal open={checkOpenType(OPEN.DEL)}  {...dialogInfo}/>
    </>
}

function useSchemaList(appInfo?: AppInfo) {
    const {data, doFetch} = usePost()

    const schemaList = useMemo(() => {
        // console.log('data', data)
        return _.map(data?.appConfigDtoList, x => ({title: x.schemaName, key: x.schemaId, source: x}))
    }, [data])

    const refreshSchemaList = useCallback((appInfo) => {
        tryExecute(async () => {
            if (!appInfo) return
            await doFetch(`/appSchemaConfigs/query`, {
                appId: appInfo.appId,
                version: appInfo.version,
                pageSize: 9999,
                pageNum: 1
            })
        })
    }, [])

    // useEffect(() => {
    //     if (itemID === projectStore.read()) return
    //     const x = _.head(schemaList) || {key: null, title: null}
    //     setActive(x)
    // }, [setActive, schemaList])

    useEffect(() => refreshSchemaList(appInfo), [appInfo])

    // console.log('data', data)

    return {schemaList, refreshSchemaList}
}

function useEnvList() {
    const {data, doFetch} = usePost();

    useEffect(() => {
        tryExecute(async () => {
            // const loginInfo = loginStore.read()
            // if (!loginInfo) return
            await doFetch(`/appConfigInfos/query`)
        })
    }, [])

    return useMemo(() => {
        // console.log('data', data)
        return _.map(data, (value, key) => ({value: key, label: key, source: value}))
    }, [data])
}

function useVersion(source: AppInfo[]) {
    return useMemo(() => {
        return _.map(source, x => {
            return {
                label: x.version,
                value: x.id,
                source: x
            }
        })
    }, [source])
}

function useFilter(list: SLInfo[]) {
    const [filterKey, setFilterKey] = useState('')

    const filteredList = useMemo(() => {
        if (utils.isNil(filterKey)) return list;
        return _.filter(list, x => {
            return _.includes(x.title, filterKey)
        })
    }, [list, filterKey])

    return {filteredList, setFilterKey}
}

function useSchema() {
    const [active, setActive] = useState<SLInfo>(pageStore.read() || {})
    const {doFetch} = usePost()

    const selectSchema = useCallback((x: SLInfo) => {
        if (active.key === x.key) return
        setActive(x)
        pageStore.write(x)
    }, [active])

    useEffect(() => {
        tryExecute(async () => {
            if (!active?.key) return
            // console.log('active',active)
            const result = await doFetch(`/schemaInfo/query?schemaId=${active.key}`)
            const schema = JSON.parse(_.get(result, 'schemaContent') as unknown as string)
            // console.log('schema', schema)
            project.importSchema(schema)
            saveLocalSchema()
        })
    }, [active])

    return {active, selectSchema}
}

function useAppInfo(){
    const [appInfo, setAppInfo] = useState<AppInfo>(appStore.read())

    useEffect(()=>{
        appStore.write(appInfo)
    },[appInfo])

    return {appInfo,setAppInfo}
}

const PagesManagePlugin = (ctx: IPublicModelPluginContext) => {
    return {
        async init() {
            const {skeleton} = ctx;
            skeleton.add({
                area: "leftArea",
                type: "PanelDock",
                content: PagesManage,
                name: "PagesManage",
                contentProps: {},
                props: {
                    align: "top",
                    icon: 'zujianku',
                    description: "schema管理"
                }
            })
        }
    }
}
PagesManagePlugin.pluginName = 'PagesManagePlugin'
PagesManagePlugin.meta = {};
export default PagesManagePlugin