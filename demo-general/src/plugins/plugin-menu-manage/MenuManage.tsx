import React, {ReactNode, useCallback, useEffect, useMemo, useState} from "react";
import {Input, Menu, Button} from "antd";
import _ from 'lodash'
import {
    PlusOutlined,
    AppstoreAddOutlined
} from '@ant-design/icons';
import {usePost} from "../../hooks";
import {useOpen} from "./hooks";
import {Edit} from "./Edit";

const fontSize = 16;

export function MenuManage(){
    const [key,setKey] = useState('')
    const {openInfo,setOpenInfo,isOpen,close} = useOpen()
    const {renderItems,filterItems,refresh} = useItems()

    const fis = filterItems(key)

    // console.log('fis', fis)

    // console.log('openInfo',openInfo)

    return <div style={{height:'100%',overflow:"hidden"}}>
        <div style={{display:'flex',alignItems:'center'}}>
            <Input.Search placeholder={'请输入……'}
                          allowClear
                          style={{width:200,marginLeft:24}}
                          onChange={x => setKey(x.target.value)}/>
            <IconButton icon={<PlusOutlined style={{fontSize}}/>} onClick={()=>setOpenInfo({type:'add'})}/>
        </div>
        <Menu className={'nav-menu'}
              style={{height:'100%',overflow:'auto'}}
              items={fis || renderItems}
              defaultSelectedKeys={['home']}
              mode={'inline'}/>
        {isOpen('add') && <Edit title={'添加根菜单'} close={close} refresh={refresh}/>}
    </div>
}

function useMockTreeItems(){
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

    return {treeItems}
}

function useItems(){
    // const {treeItems} = useMockTreeItems()

    const {treeItems,refresh} = useTreeItems()

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

    return {renderItems,filterItems,refresh}
}

type OperationProps = {
    title:string
}
function Operation(props:OperationProps){
    const {title} = props;

    return <>
        {title}
        <IconButton icon={<PlusOutlined style={{fontSize}}/>} onClick={()=>console.log('添加同级')}/>
        <IconButton icon={<AppstoreAddOutlined style={{fontSize}}/>} onClick={()=>console.log('添加子级')}/>
    </>
}

type IconButtonProps = {
    icon:ReactNode,
    onClick:()=>void
}
function IconButton(props:IconButtonProps){
    return <Button shape={'circle'}
                   style={{marginLeft:8,}}
                   onClick={e=>{
                       e.stopPropagation()
                       e.preventDefault()
                       props.onClick();
                   }}
                   icon={props.icon}/>
}

function useTreeItems(){
    const {data,doFetch} = usePost()

    const refresh = useCallback(()=>{
        doFetch('/sysfunc/query')
    },[doFetch])

    //初始请求一次
    useEffect(()=>refresh(),[refresh])

    const treeItems = useMemo(()=>{
        return generateMenu(data)
    },[data])

    // console.log('useTreeItems', treeItems)

    return {treeItems,refresh}
}

interface MenuItem {
    funcType: number;
    funcName: string;
    menuUrl: string;
    expanded: boolean;
    funcCode: string;
    label?: string;
    to?: string;
    key?: string;
    children?: MenuItem[];
    level?: number; // Assuming level is a property in the data
    parentId?: string; // Assuming parentId is a property in the data
}

function generateMenu(data: MenuItem[]): MenuItem[] {
    let menu: MenuItem[] = [];
    const subs = _.filter(data, (o) => o.funcType === 0 || o.funcType === 1);

    _.forEach(subs, (ele, i) => {
        // ele.text = ele.funcName;
        ele.label = ele.funcName;
        ele.to = ele.menuUrl;
        ele.expanded = false;
        // ele.id = ele.funcCode;
        ele.key = ele.funcCode;

        const subsList = _.filter(subs, (item) => ele.funcCode === item.parentId);

        if (subsList?.length > 0) {
            ele.children = subsList;
        }

        if (i === subs.length - 1) {
            menu = _.filter(subs, (o) => o.level === 0);
        }
    });

    return menu;
}