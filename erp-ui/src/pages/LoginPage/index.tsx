import {useCallback, useState} from "react";
import {Button, Card, Form, Input, Tabs, Typography} from "@pankod/refine-antd";
import {useLogin} from "@pankod/refine-core";
import {LoginOutlined} from "@ant-design/icons";

import "./LoginPage.scss";

export const LoginPage = () => {
    const [form] = Form.useForm();
    const {mutate: login, isLoading} = useLogin();
    const [method, setMethod] = useState<string>("gpro");

    const onSubmit = useCallback(async () => {
        try {
            await form.validateFields();
        }
        catch (e: any) {
            return;
        }

        await login({
            method,
            ...form.getFieldsValue()
        });
    }, [form, method]);

    return (
        <div className="login-page__container">
            <Card>
                <Typography.Title level={3}>
                    Вход в аккаунт
                </Typography.Title>
                <Form
                    style={{marginTop: "2rem"}}
                    labelCol={{span: 8}}
                    layout="vertical"
                    form={form}
                    requiredMark={false}
                >
                    <Tabs
                        items={[
                            {key: "gpro", label: "G.Pro"},
                            {key: "password", label: "Пароль"},
                        ]}
                        activeKey={method}
                        onChange={(newActiveKey) => {
                            form.resetFields();
                            setMethod(newActiveKey);
                        }}
                    />
                    <Form.Item
                        name="login"
                        label="Логин"
                        rules={[{required: true}]}
                    >
                        <Input placeholder={"Логин" + (method === "gpro" ? " из G.Pro" : "")} autoFocus/>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Пароль"
                        rules={[{required: true}]}
                    >
                        <Input type="password" placeholder={"Пароль" + (method === "gpro" ? " из G.Pro" : "")}/>
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="submit"
                        icon={<LoginOutlined/>}
                        onClick={onSubmit}
                        loading={isLoading}
                    >Войти</Button>
                </Form>
            </Card>
        </div>
    );
}
