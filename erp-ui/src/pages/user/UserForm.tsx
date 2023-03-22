import {Button, Col, Form, FormProps, Select, Input, Row,} from "@pankod/refine-antd";
import {ChangeEventHandler, useState} from "react";
import {UserRole} from '../../core/constants';

export type UserFormProps = {
    formProps: FormProps;
    action: "edit" | "create";
}

const ROW_GUTTER = 16;
const roleOptions = Object.values(UserRole).map(it => {
    return {
        value: it,
        label: it
    }
})

export const UserForm = ({formProps, action}: UserFormProps) => {
    const isEdit = action === "edit";
    const isCreate = action === "create";
    const [showChangePassword, setShowChangePassword] = useState(isCreate);

    return (
        <Form
            {...formProps}
            layout="vertical"
            labelCol={{span: 6}}
            labelAlign="left"
        >
            <Row gutter={ROW_GUTTER}>
                <Col span={12}>
                    <Form.Item
                        name="login"
                        label="Логин"
                        rules={[{required: isCreate}]}
                    >
                        <Input disabled={isEdit}/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name="password"
                        label="Пароль"
                        rules={[{required: isCreate}]}
                    >
                        <Password
                            edit={showChangePassword}
                            onEditChange={setShowChangePassword}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={ROW_GUTTER}>
                <Col span={12}>
                    <Form.Item name="first_name" label="Имя">
                        <Input/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="last_name" label="Фамилия">
                        <Input/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={ROW_GUTTER}>
                <Col span={12}>
                    <Form.Item name="phone" label="Телефон">
                        <Input/>
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item name="email" label="Email">
                        <Input type="email"/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={ROW_GUTTER}>
                <Col span={12}>
                    <Form.Item name="role" label="Роль">
                        <Select
                          style={{ width: 120 }}
                          options={roleOptions}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
}

type PasswordProps = {
    value?: string;
    onChange?: ChangeEventHandler<HTMLInputElement>;
    edit: boolean;
    onEditChange: (edit: boolean) => any;
}
const Password = ({value, edit, onChange, onEditChange}: PasswordProps) => {
    if (edit) {
        return <Input.Password value={value} onChange={onChange}/>;
    }
    else {
        return (
            <Button onClick={() => onEditChange(true)}>
                Изменить
            </Button>
        );
    }
};
