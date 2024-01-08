import {Form, Input, message, Modal, Select,InputNumber} from "antd";
import React, {useCallback, useEffect, useMemo} from "react";
import {usePost} from "../../hooks";
import {OPERATION_TYPE} from "./MenuManage";
import _ from 'lodash'

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

const COM_WIDTH = 200

export function Edit(props:EditProps){
    const {title,close,refresh,data,type} = props;
    const [form] = Form.useForm()
    const {doFetch} = usePost()
    const funcType = Form.useWatch('funcType',form)

    const isEdit = type === OPERATION_TYPE.CURRENT_EDIT
    const isPage = funcType === 1

    //设置初始值
    useEffect(()=>{
        const initData = data || {funcType:0, level:0, parentId:'-1', moduleID:'OTCD'}
        form.setFieldsValue(initData)
    },[data])

    const confirm = async () => {
        try{
            await form.validateFields()
            const values = form.getFieldsValue()
            // console.log('values', values)
            const url = isEdit ? '/sysfunc/update' : '/sysfunc/save'
            const r = await doFetch(url,values)
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
                <InputNumber disabled={isEdit} style={{ width: COM_WIDTH }}/>
            </Form.Item>
            <Form.Item label="菜单功能名称" name="funcName" rules={[{ required: true }]}>
                <Input  style={{ width: COM_WIDTH }}/>
            </Form.Item>
            <Form.Item label="功能类型" name="funcType" rules={[{ required: true }]}>
                <Select options={funcTypeOptions}  style={{ width: COM_WIDTH }}/>
            </Form.Item>
            <Form.Item label="菜单层级" name="level" hidden rules={[{ required: false }]}>
                <InputNumber  style={{ width: COM_WIDTH }}/>
            </Form.Item>
            <Form.Item label="菜单URL" name="menuUrl" rules={[{ required: isPage }]}>
                <Input disabled={!isPage} style={{ width: COM_WIDTH }}/>
            </Form.Item>
            <Form.Item label="模块编号" name="moduleID" rules={[{ required: true }]}>
                <Input disabled={isEdit} style={{ width: COM_WIDTH }}/>
            </Form.Item>
            <Form.Item label="父节点编号" name="parentId" rules={[{ required: true }]}>
                <Select options={useParentIdOptions()}
                        showSearch
                        optionFilterProp="label"
                        style={{ width: COM_WIDTH }}
                        onChange={(v,o)=>{
                            // @ts-ignore
                            form.setFieldValue('level', o.level + 1)
                        }}/>
            </Form.Item>
        </Form>
    </Modal>
}

interface SysFunc {
    level: number;
    funcCode: string;
    funcName: string;
    funcType: number;
    moduleID: string;
    // 添加其他属性...
}

interface ParentIdOption {
    label: string;
    value: string;
    level: number;
}

function useParentIdOptions(): ParentIdOption[] {
    const { data, doFetch } = usePost();

    const refresh = useCallback(() => {
        doFetch('/sysfunc/query');
    }, [doFetch]);

    // 初始请求一次
    useEffect(() => {
        refresh();
    }, [refresh]);

    return useMemo(() => {
        const options: ParentIdOption[] = [{label: "根目录", value: '-1', level:-1}];

        _.forEach(data,(o: SysFunc) => {
            const supportType = o.funcType === 0 || o.funcType === 1;
            const supportModule = !['BM', 'BT'].includes(o.moduleID);

            if (supportModule && supportType) {
                options.push({
                    label: o.funcName,
                    value: o.funcCode,
                    level: o.level
                });
            }
        });

        return options
    }, [data])
}