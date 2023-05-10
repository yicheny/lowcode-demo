import React, {useCallback} from 'react';
import {message, Modal} from 'antd';
import {usePost} from "../../../hooks";
import {tryExecute} from "../../../utils";

type DelModalProps = {
    open:boolean,
    close:() => void,
    refresh:()=>void,
    info:{
        slName?:string,
        slID?:number,
        itemID?:number
    }
}

export default function DelModal(props:DelModalProps) {
    const {open,close,refresh,info={}} = props
    const commit = useCommit(close,refresh)

    return <Modal title={'删除'} open={open} centered onOk={()=>commit(info)} onCancel={close}>
       是否确认删除 "{info.slName}" 项？
    </Modal>
}

function useCommit(close:()=>void,refresh:()=>void){
    const {doFetch} = usePost();

    return useCallback((info:any)=>{
        tryExecute(async ()=>{
            await doFetch(`/process/schemaListDelete?slID=${info.slID}`)
            message.success('删除成功！')
            refresh()
            close()
        })
    },[])
}