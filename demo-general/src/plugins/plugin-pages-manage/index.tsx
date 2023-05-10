import * as React from 'react'
import {IPublicModelPluginContext} from "@alilc/lowcode-types";
import {useCallback, useEffect, useMemo, useState} from "react";
import {project} from '@alilc/lowcode-engine';
import {saveSchema} from "../../services/mockService";
import {LOGIN_KEY, store, tryExecute} from "../../utils";
import {PROJECT_KEY, SCHEMA_ACTIVE_KEY} from "../../utils/Store";
import {List, Select} from 'antd'
import {MinusCircleOutlined, EditOutlined, PlusCircleOutlined} from '@ant-design/icons'
import clsx from "clsx";
import AddModal from "./opeartions/add";
import classes from './index.module.scss'
import {useOpen, usePost} from "../../hooks";
import DelModal from "./opeartions/del";
import _ from 'lodash'

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
    const [active, setActive] = useState<SLInfo>(store.get(SCHEMA_ACTIVE_KEY) || {})
    const [project, setProject] = useState(store.get(PROJECT_KEY))
    const {openInfo, setOpenInfo, checkOpenType, close} = useOpen()
    const projectList = useProjectList()
    const {schemaList, refreshSchemaList} = useSchemaList(project);

    useSwitchSchema(project, active)

    const selectSchema = (x: SLInfo) => {
        if (active.key === x.key) return
        setActive(x)
    }

    const selectProject = (value: string) => {
        setProject(value)
    }

    const dialogInfo = {
        close,
        info: openInfo.info,
        refresh: refreshSchemaList
    }

    return <>
        <div style={{marginLeft: 16}}>
            当前环境：<Select placeholder={'请选择项目'} options={projectList} defaultValue={project}
                             style={{width: 120}} onChange={selectProject}/>
            <PlusCircleOutlined style={{fontSize: 18, marginLeft: 12}}
                                onClick={() => setOpenInfo({type: OPEN.ADD, info: {itemID: project,slName:null}})}/>
        </div>
        <List dataSource={schemaList} renderItem={(x: SLInfo) => {
            return <Item key={x.key} className={clsx(classes.item, {[classes.active]: active.key === x.key})}
                         onClick={() => selectSchema(x)}>
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

function useSchemaList(itemID: number) {
    const {data, doFetch} = usePost()


    const schemaList = useMemo(() => {
        return _.map(data, x => ({title: x.slName, key: x.slID}))
    }, [data])

    const refreshSchemaList = useCallback(() => {
        tryExecute(async () => {
            if (!itemID) return
            await doFetch(`/query/schemaListQuery?itemID=${itemID}`)
        })
    }, [itemID])

    useEffect(() => refreshSchemaList(), [refreshSchemaList])

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

function useSwitchSchema(itemID: number, sl: SLInfo) {
    const {doFetch} = usePost()

    useEffect(() => {
        tryExecute(async () => {
            const slID = sl.key;
            if (!slID) return
            const data = await doFetch(`/query/schemaInfoQuery?slID=${slID}`)
            const schema = JSON.parse(_.get(data, 'siInfo') as unknown as string)
            // console.log('schema',schema)
            switchSchema(schema)

            function switchSchema(schema: any) {
                store.set(SCHEMA_ACTIVE_KEY, sl)
                store.set(PROJECT_KEY, itemID)
                project.importSchema(schema)
                saveSchema()
            }
        })
    }, [itemID, sl])
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