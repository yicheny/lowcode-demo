import React, {useCallback} from 'react';
import {Button, Form, Input, Modal, message} from 'antd';
import {usePost} from "../../../hooks";
import {tryExecute} from "../../../utils";
import {AppInfo} from "../index";
import {OPEN} from "../../../hooks/useOpen";

type AddModalProps = {
    title:string,
    open:boolean,
    close:() => void,
    refresh:(AppInfo:any)=>void,
    type:OPEN
    info:AppInfo
}

export default function AddModal(props:AddModalProps) {
    const {open,close,title,info,refresh,type} = props
    const commit = useCommit(close,refresh)

    const onFinish = (values: any) => {
        info.schemaName = values.schemaName
        info.resource = values.resource
        commit(type,info)
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return <Modal title={title} open={open} centered footer={null} onCancel={close}>
        <Form
            key={`${info?.appId}_${info?.version}_${info?.id}`}
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            initialValues={info}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="schema名称"
                name="schemaName"
                rules={[{ required: true, message: '请输入schema名称！' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="路由地址"
                name="resource"
                rules={[{ required: true, message: '请输入路由地址！' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                <Button type="primary" htmlType="submit">
                    提交
                </Button>
            </Form.Item>
        </Form>
    </Modal>
}

function useCommit(close:()=>void,refresh:(appInfo:AppInfo)=>void){
    const {doFetch} = usePost();

    return useCallback((type:OPEN,info:any)=>{
        tryExecute(async ()=>{
            const urlMap = {
                [OPEN.ADD]:'/appSchemaConfig/save',
                [OPEN.EDIT]:'/appSchemaConfig/update',
            }
            // @ts-ignore
            await doFetch(urlMap[type],info)
            message.success('提交成功！')
            refresh(info)
            close()
        })
    },[])
}