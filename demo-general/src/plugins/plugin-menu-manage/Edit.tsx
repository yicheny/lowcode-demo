import {Form, Input, InputNumber, message, Modal, Select} from "antd";
import React, {useEffect} from "react";
import {usePost} from "../../hooks";
import {OPERATION_TYPE} from "./MenuManage";

const layout = {
    labelCol: {span:8},
    wrapperCol: {span:8}
}

const funcTypeOptions = [
    { label:'目录', value:0},
    { label:'窗体', value:1},
    { label:'按钮', value:2},
    { label:'TAB', value:3},
    { label:'通用查询', value:4},
]

interface EditProps {
    title:string,
    close:()=>void,
    refresh:()=>void,
    data?:any,
    type:OPERATION_TYPE | null ,
}

export function Edit(props:EditProps){
    const {title,close,refresh,data,type} = props;
    const [form] = Form.useForm()
    const {doFetch} = usePost()

    const isEdit = type === OPERATION_TYPE.CURRENT_EDIT

    //设置初始值
    useEffect(()=>{
        const initData = data || {funcType:0, level:0, parentId:'-1'}
        form.setFieldsValue(initData)
    },[data])

    const confirm = async () => {
        try{
            await form.validateFields()
            const values = form.getFieldsValue()
            // console.log('values', values)
            const r = await doFetch('/sysfunc/save',values)
            message.success('操作成功！')
            refresh()
            close()
        }catch (e:any){
            e.message && message.error(e.message)
        }
    }

    return <Modal title={title} open onOk={confirm} onCancel={close}>
        <Form form={form} {...layout}>
            <Form.Item label="菜单功能编号" name="funcCode" rules={[{ required: true }]} >
                <Input disabled={isEdit}/>
            </Form.Item>
            <Form.Item label="菜单功能名称" name="funcName" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="功能类型" name="funcType" rules={[{ required: true }]}>
                <Select options={funcTypeOptions} />
            </Form.Item>
            {/*<Form.Item label="菜单层级" name="level" rules={[{ required: true }]}>*/}
            {/*    <InputNumber />*/}
            {/*</Form.Item>*/}
            <Form.Item label="菜单URL" name="menuUrl" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label="模块编号" name="moduleID" rules={[{ required: true }]}>
                <Input disabled={isEdit}/>
            </Form.Item>
            <Form.Item label="父节点编号" name="parentId" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
        </Form>
    </Modal>
}