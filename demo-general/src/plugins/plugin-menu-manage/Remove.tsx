import {usePost} from "../../hooks";
import {Modal,message} from 'antd'
import {ReactNode} from "react";

interface RemoveProps {
    close:()=>void,
    refresh:()=>void,
    params:any,
    children:ReactNode
}

export function Remove(props:RemoveProps){
    const {close,refresh,params} = props;
    const {doFetch} = usePost()
    const handleOk = async () => {
       try {
           // console.log('params', params)
           await doFetch(`/sysfunc/remove?funcCode=${params.funcCode}&moduleId=${params.moduleID}`, {});
           message.success('删除成功！')
           refresh()
           close()
       }catch (e:any){
           message.error(e.message)
       }
    }

    return <Modal title={'删除'} onOk={handleOk} onCancel={close} open {...props}/>
}