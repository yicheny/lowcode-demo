import React, {useCallback} from 'react';
import {Button, Form, Input, Modal, message} from 'antd';
import {usePost} from "../../../hooks";
import {tryExecute} from "../../../utils";

type AddModalProps = {
    title:string,
    open:boolean,
    close:() => void,
    refresh:()=>void,
    info:any,
}

export default function AddModal(props:AddModalProps) {
    const {open,close,title,info={},refresh} = props
    const commit = useCommit(close,refresh)

    const onFinish = (values: any) => {
        info.slName = values.slName
        commit(info)
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return <Modal title={title} open={open} centered footer={null} onCancel={close}>
        <Form
            key={info.slID}
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
                name="slName"
                rules={[{ required: true, message: '请输入schema名称！' }]}
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

function useCommit(close:()=>void,refresh:()=>void){
    const {doFetch} = usePost();

    return useCallback((info:any)=>{
        tryExecute(async ()=>{
            await doFetch('/process/schemaListSave',info)
            message.success('提交成功！')
            refresh()
            close()
        })
    },[])
}