import React, {useCallback, useEffect, useMemo} from 'react';
import {Button, Form, Input, Modal, message, Select} from 'antd';
import {usePost} from "../../../hooks";
import {tryExecute} from "../../../utils";
import {AppInfo} from "../index";
import {OPEN} from "../../../hooks/useOpen";
import _ from "lodash";

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
    const [form] = Form.useForm()
    const commit = useCommit(close,refresh)

    const onFinish = (values) => {
        _.assign(info,values)
        // console.log('info', info)
        commit(type,info)
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return <Modal title={title} open={open} centered footer={null} onCancel={close}>
        <Form
            form={form}
            key={`${info?.appId}_${info?.version}_${info?.id}`}
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 16 }}
            initialValues={info}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item label="名称" name="schemaName" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item label="路由地址" name="resource" rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item label="模块编号" name="moduleID" hidden rules={[{ required: true }]}>
                <Input />
            </Form.Item>

            <Form.Item label="绑定菜单" name="funcCode" rules={[{ required: true }]}>
                <Select options={useMenuOptions()}
                        showSearch
                        optionFilterProp="label"
                        onChange={(v,o)=>{
                            form.setFieldValue('moduleID', o.moduleID)
                        }}/>
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

function useMenuOptions(): ParentIdOption[] {
    const { data, doFetch } = usePost();

    const refresh = useCallback(() => {
        doFetch('/sysfunc/query');
    }, [doFetch]);

    // 初始请求一次
    useEffect(() => {
        refresh();
    }, [refresh]);

    return useMemo(() => {
        const options: ParentIdOption[] = [];

        _.forEach(data,(o: SysFunc) => {
            const supportType = o.funcType === 1;
            const supportModule = !['BM', 'BT'].includes(o.moduleID);

            if (supportModule && supportType) {
                options.push({
                    label: o.funcName,
                    value: o.funcCode,
                    moduleID: o.moduleID
                });
            }
        });

        return options
    }, [data])
}