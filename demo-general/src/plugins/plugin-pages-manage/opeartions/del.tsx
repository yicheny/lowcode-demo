import React from 'react';
import {Modal} from 'antd';

type DelModalProps = {
    open:boolean,
    close:() => void,
}

export default function DelModal(props:DelModalProps) {
    const {open,close} = props

    return <Modal title={'删除'} open={open} centered onOk={close} onCancel={close}>
       是否确认删除？
    </Modal>
}