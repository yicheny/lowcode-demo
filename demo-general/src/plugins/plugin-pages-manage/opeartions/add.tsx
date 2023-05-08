import React from 'react';
import {Button, Form, Input, Modal} from 'antd';

type AddModalProps = {
    title:string,
    open:boolean,
    close:() => void,
}

export default function AddModal(props:AddModalProps) {
    const {open,close,title} = props

    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return <Modal title={title} open={open} centered footer={null} onCancel={close}>
        <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
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