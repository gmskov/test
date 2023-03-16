import React from "react";
import {IResourceComponentsProps} from "@pankod/refine-core";
import {Create, Form, useForm, Input, Row, Col} from "@pankod/refine-antd";

export const EmployeeCreate: React.FC<IResourceComponentsProps> = () => {
    const {formProps, saveButtonProps} = useForm();

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form
                {...formProps}
                layout="vertical"
                validateTrigger="onBlur"
                validateMessages={{
                    required: "Обязательное поле",
                    types: {
                        email: "Невалидный имейл адрес"
                    }
                }}
            >
                <Row gutter={48}>
                    <Col span={6}>
                        <Form.Item
                            label="Имя"
                            name={["person", "firstName"]}
                            rules={[{required: true}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Фамилия"
                            name={["person", "lastName"]}
                            rules={[{required: true}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Личный код"
                            name={["taxId"]}
                            rules={[
                                {
                                    type: "string",
                                    pattern: /\d{11}/,
                                    message: "Личный код должен состоять из 11 цифр"
                                },
                                {
                                    required: true
                                }
                            ]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item
                            label="Адрес"
                            name={["address"]}
                            rules={[{required: true}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Телефон"
                            name={["phone"]}
                            rules={[{required: true}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Email"
                            name={["email"]}
                            rules={[{
                                type: "email",
                                required: true,
                            }]}
                        >
                            <Input/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Create>
    );
};
