import { Modal, Button, Form, Input } from 'antd';
import {loginStore, tryExecute} from "../utils";
import {usePost} from "../hooks";

export const LoginView = () => {
    const {doFetch} = usePost()

    const onFinish = (values: any) => {
        // console.log('Success:', values);
        tryExecute(async ()=>{
            const infos = await doFetch(`/user/login`, values)
            // console.log('infos', infos)
            loginStore.write(infos)
            window.location.reload();
        })
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return  <Modal title="登录" open centered footer={null} closable={false}>
        <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="账号"
                name="userId"
                rules={[{ required: true, message: '请输入账号！' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="密码"
                name="password"
                rules={[{ required: true, message: '请输入密码！' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 18 }}>
                <Button type="primary" htmlType="submit">
                    登录
                </Button>
            </Form.Item>
        </Form>
    </Modal>
}
