import React, {ReactNode, useCallback, useMemo, useState} from "react";
import {Input, Menu, Button} from "antd";
import _ from 'lodash'
import {
    PlusOutlined,
    AppstoreAddOutlined
} from '@ant-design/icons';

const fontSize = 16;

export function MenuManage(){
    const [key,setKey] = useState('')
    const {renderItems,filterItems} = useMockItems()

    const fis = filterItems(key)

    // console.log('fi', fi)

    return <div>
        <div style={{display:'flex',alignItems:'center'}}>
            <Input.Search placeholder={'请输入……'}
                          allowClear
                          style={{width:200,marginLeft:24}}
                          onChange={x => setKey(x.target.value)}/>
            <IconButton icon={<PlusOutlined style={{fontSize}}/>}/>
        </div>
        <Menu className={'nav-menu'} items={fis || renderItems} defaultSelectedKeys={['home']} mode={'inline'}/>
    </div>
}

function useMockItems(){
    const treeItems = useMemo(()=>{
        return [
            {label: '首页', key: "home"},
            {label:'登录页',key:"login"},
            {
                label: '物料管理',
                key: 'material-manage',
                children:[
                    {label: '表单物料管理', key: 'material-manage/form'},
                    {label: '表格物料管理', key: 'material-manage/table'},
                ]
            },
            {
                label: "特性验证",
                key:"feature-test",
                children:[
                    {label: '代码合并Demo', key: 'demos/code-diff'},
                    {label: '拖拽布局Mock', key: 'demos/grid-layout/mock'},
                    {label: '拖拽布局自适应', key: 'demos/grid-layout/auto-fit'},
                ]
            }
        ]
    },[])

    const flatItems = useMemo(()=>{
        const result: { label: string; key: string; children?: undefined; }[] = [];
        return flat(treeItems)

        function flat(items: any) {
            _.forEach(items,x=>{
                if(x.children) return flat(x.children)
                result.push(x)
            })
            return result;
        }
    },[treeItems])

    const filterItems = useCallback((key)=>{
        // console.log('key', key)
        if(key === '') return null;
        return _.filter(flatItems,(x)=>_.includes(x.label,key))
    },[flatItems])

    const renderItems = useMemo(()=>{
        return addOperation(treeItems)

        function addOperation(items: any) {
            return _.map(items,x=>{
                // console.log('x', x.label)
                if(x.children) x.children = addOperation(x.children)

                return {
                    ...x,
                    label:<Operation title={x.label}/>
                }
            })
        }
    },[treeItems])

    // console.log('renderItems', renderItems)

    return {renderItems,filterItems}
}

type OperationProps = {
    title:string
}
function Operation(props:OperationProps){
    const {title} = props;

    return <>
        {title}
        <IconButton icon={<PlusOutlined style={{fontSize}}/>}/>
        <IconButton icon={<AppstoreAddOutlined style={{fontSize}}/>}/>
    </>
}

type IconButtonProps = {
    icon:ReactNode
}
function IconButton(props:IconButtonProps){
    return <Button shape={'circle'}
                   style={{marginLeft:8,}}
                   onClick={e=>{
                       e.stopPropagation()
                       e.preventDefault()
                   }}
                   icon={props.icon}/>
}