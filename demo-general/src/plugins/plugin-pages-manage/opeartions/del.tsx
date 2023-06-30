import React, {useCallback} from 'react';
import {message, Modal} from 'antd';
import {usePost} from "../../../hooks";
import {tryExecute} from "../../../utils";
import {AppInfo} from "../index";

type DelModalProps = {
    open:boolean,
    close:() => void,
    refresh:(appInfo:AppInfo)=>void,
    info:AppInfo
}

export default function DelModal(props:DelModalProps) {
    const {open,close,refresh,info} = props
    const commit = useCommit(close,refresh)

    return <Modal title={'删除'} open={open} centered onOk={()=>commit(info)} onCancel={close}>
       是否确认删除 "{info?.schemaName}" 项？
    </Modal>
}

function useCommit(close:()=>void,refresh:(appInfo:AppInfo)=>void,){
    const {doFetch} = usePost();

    return useCallback((info:any)=>{
        tryExecute(async ()=>{
            await doFetch(`/appSchemaConfig/remove?id=${info?.id}`)
            message.success('删除成功！')
            refresh(info)
            close()
        })
    },[])
}