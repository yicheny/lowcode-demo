import * as React from 'react'
import {IPublicModelPluginContext} from "@alilc/lowcode-types";
import {useCallback, useEffect, useMemo, useState} from "react";
import {project} from '@alilc/lowcode-engine';
import {LOGIN_KEY, store, tryExecute, utils} from "../../utils";
import {PROJECT_KEY, PAGE_ACTIVE_KEY, SCHEMA_ACTIVE_ID} from "../../utils/Store";
import {List, Select, Input} from 'antd'
import {MinusCircleOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons'
import clsx from "clsx";
import AddModal from "./opeartions/add";
import classes from './index.module.scss'
import {useOpen, usePost} from "../../hooks";
import DelModal from "./opeartions/del";
import _ from 'lodash'
import {saveLocalSchema} from "../../services/mockService";

const {Item} = List;

type SLInfo = {
    key: string,
    title: string,
    // data: any
}

enum OPEN {
    ADD,
    EDIT,
    DEL
}

function PagesManage() {
    const {active,selectSchema,setActive} = useActive()
    const [project, setProject] = useState(store.get(PROJECT_KEY))
    const {openInfo, setOpenInfo, checkOpenType, close} = useOpen()
    const projectList = useProjectList()
    const {schemaList, refreshSchemaList} = useSchemaList(project,setActive);
    const {filteredList,setFilterKey} = useFilter(schemaList)

    useSwitchSchema(project,active)

    const selectProject = (value: string) => {
        setProject(value)
    }

    const dialogInfo = {
        close,
        info: openInfo.info,
        refresh: refreshSchemaList
    }

    // console.log('render project', project, JSON.stringify(dialogInfo.info))
    // console.log('active', active)

    return <>
        <div style={{marginLeft: 16}}>
            当前环境：<Select placeholder={'请选择项目'} options={projectList} defaultValue={project}
                             style={{width: 150}} onChange={selectProject}/>
            <PlusCircleOutlined style={{fontSize: 18, marginLeft: 12}}
                                onClick={() => setOpenInfo({type: OPEN.ADD, info: {itemID: project,slName:null}})}/> <br/>
            <Input.Search placeholder={'搜索schema项'} style={{width: 240,marginTop:8}} onChange={(e)=>setFilterKey(e.target.value)}/>
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
                                  info: {itemID: project,slID:x.key,slName:x.title}
                              })}/>
                <MinusCircleOutlined style={{fontSize: 18, marginLeft: 12}}
                                     onClick={() => setOpenInfo({
                                         type: OPEN.DEL,
                                         info: {itemID: project,slID:x.key,slName:x.title}
                                     })}/>
            </span>
            </Item>
        }}/>
        <AddModal title={'新增'} open={checkOpenType(OPEN.ADD)} {...dialogInfo} />
        <AddModal title={'编辑'} open={checkOpenType(OPEN.EDIT)} {...dialogInfo}/>
        <DelModal open={checkOpenType(OPEN.DEL)}  {...dialogInfo}/>
    </>
}

function useSchemaList(itemID: number, setActive: (head: any)=>void) {
    const {data, doFetch} = usePost()

    const schemaList = useMemo(() => {
        return _.map(data, x => ({title: x.slName, key: x.slID}))
    }, [data])

    const refreshSchemaList = useCallback((itemID) => {
        // console.log('refreshSchemaList itemID', itemID)

        tryExecute(async () => {
            if (!itemID) return
            await doFetch(`/query/schemaListQuery?itemID=${itemID}`)
        })
    }, [])

    useEffect(()=>{
        // console.log(itemID , store.get(PROJECT_KEY) , schemaList)
        if(itemID === store.get(PROJECT_KEY)) return
        const x = _.head(schemaList) || {key:null,title:null}
        setActive(x)
    },[setActive,schemaList])

    useEffect(() => refreshSchemaList(itemID), [itemID])

    return {schemaList, refreshSchemaList}
}

function useProjectList() {
    const {data, doFetch} = usePost();

    useEffect(() => {
        tryExecute(async () => {
            const loginInfo = store.get(LOGIN_KEY)
            if (!loginInfo) return
            await doFetch(`/query/projectListQuery?userID=${loginInfo.userID}`)
        })
    }, [])

    return useMemo(() => {
        return _.map(data, x => ({value: x.itemID, label: x.itemName}))
    }, [data])
}

function useSwitchSchema(itemID:number,sl:SLInfo) {
    const {doFetch} = usePost()

    useEffect(() => {
        tryExecute(async () => {
            const slID = sl.key
            if (!slID) return
            const data = await doFetch(`/query/schemaInfoQuery?slID=${slID}`)
            // console.log('schema',schema)
            switchSchema()

            function switchSchema() {
                store.set(PROJECT_KEY, itemID)
                store.set(PAGE_ACTIVE_KEY, sl)
                store.set(SCHEMA_ACTIVE_ID, _.get(data,'siID'))
                const schema = JSON.parse(_.get(data, 'siInfo') as unknown as string)
                project.importSchema(schema)
                saveLocalSchema()
            }
        })
    }, [itemID,sl])
}

function useFilter(list:SLInfo[]){
    const [filterKey,setFilterKey] = useState('')

    const filteredList = useMemo(()=>{
        if(utils.isNil(filterKey)) return list;
        return _.filter(list,x=>{
            return _.includes(x.title,filterKey)
        })
    },[list,filterKey])

    return {filteredList,setFilterKey}
}

function useActive(){
    const [active, setActive] = useState<SLInfo>(store.get(PAGE_ACTIVE_KEY) || {})

    const selectSchema = useCallback((x: SLInfo) => {
        if (active.key === x.key) return
        setActive(x)
    },[active])

    return {active,selectSchema,setActive}
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