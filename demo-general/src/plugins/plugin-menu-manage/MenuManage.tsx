import React, {ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Input, Menu, Button} from "antd";
import _ from 'lodash'
import {
    PlusOutlined,
    AppstoreAddOutlined,
    MinusOutlined,
    EditOutlined,
} from '@ant-design/icons';
import {usePost} from "../../hooks";
import {useOpen} from "./hooks";
import {Edit} from "./Edit";
import {Remove} from "./Remove";

const fontSize = 16;

const MenuContext = React.createContext({})

export enum OPERATION_TYPE {
    ROOT_ADD,
    BROTHER_ADD,
    CHILD_ADD,
    CURRENT_EDIT,
    CURRENT_DEL
}

const SAVE_TYPES = [
    OPERATION_TYPE.ROOT_ADD,
    OPERATION_TYPE.BROTHER_ADD,
    OPERATION_TYPE.CHILD_ADD,
    OPERATION_TYPE.CURRENT_EDIT,
]

export function MenuManage(){
    const [key,setKey] = useState('')
    const {openInfo,setOpenInfo,isOpen,hasType,close} = useOpen<OPERATION_TYPE>()
    const {renderItems,filterItems,refresh} = useItems()

    const fis = filterItems(key)

    // console.log('fis', fis)

    // console.log('openInfo',openInfo)

    return <MenuContext.Provider value={{setOpenInfo}}>
        <div style={{height:'100%',overflow:"hidden"}}>
            <div style={{display:'flex',alignItems:'center'}}>
                <Input.Search placeholder={'请输入……'}
                              allowClear
                              style={{width:200,marginLeft:24}}
                              onChange={x => setKey(x.target.value)}/>
                <IconButton icon={<PlusOutlined style={{fontSize}}/>}
                            size={'middle'}
                            onClick={()=>setOpenInfo({type:OPERATION_TYPE.ROOT_ADD, title:"新增"})}/>
            </div>
            <Menu className={'nav-menu'}
                  style={{height:'100%',overflow:'auto',paddingBottom:12}}
                  items={fis || renderItems}
                  defaultSelectedKeys={['home']}
                  mode={'inline'}/>
            {hasType(SAVE_TYPES) && <Edit title={openInfo.title} close={close} refresh={refresh} data={openInfo.data} type={openInfo.type}/>}
            {isOpen(OPERATION_TYPE.CURRENT_DEL) && <Remove close={close} refresh={refresh} params={openInfo.data}>
                是否确认删除 {_.get(openInfo.data,'funcName')} ？
            </Remove>}
        </div>
    </MenuContext.Provider>
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
                    label:<Operation title={x.label} data={x}/>
                }
            })
        }
    },[treeItems])

    // console.log('renderItems', renderItems)

    return {renderItems,filterItems,refresh}
}

type IconButtonProps = {
    icon:ReactNode,
    onClick:()=>void,
    size?:'large' | 'middle' | 'small'
}
function IconButton(props:IconButtonProps){
    return <Button shape={'circle'}
                   style={{marginLeft:4,}}
                   size={props.size || 'small'}
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
    moduleID:string;
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
    const subs = _.filter(data, (o) => {
        const supportType = o.funcType === 0 || o.funcType === 1
        const supportModule = !['BM','BT'].includes(o.moduleID)
        return supportModule && supportType
    });

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


type OperationProps = {
    title:string,
    data:MenuItem,
}
function Operation(props:OperationProps){
    const {title,data} = props;
    // @ts-ignore
    const {setOpenInfo} = useContext(MenuContext)

    // console.log('setOpenInfo', setOpenInfo)

    return <>
        {title}
        {/*<IconButton icon={<PlusOutlined style={{fontSize}}/>} onClick={()=>console.log('添加同级')}/>*/}
        {/*<IconButton icon={<AppstoreAddOutlined style={{fontSize}}/>} onClick={()=>console.log('添加子级')}/>*/}
        <IconButton icon={<EditOutlined style={{fontSize}}/>} onClick={()=>setOpenInfo({type:OPERATION_TYPE.CURRENT_EDIT,data,title:"编辑"})}/>
        <IconButton icon={<MinusOutlined style={{fontSize}}/>} onClick={()=>setOpenInfo({type:OPERATION_TYPE.CURRENT_DEL,data})}/>
    </>
}