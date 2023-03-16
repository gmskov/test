import {Col, Create, Row, useForm} from "@pankod/refine-antd";

import {UserForm} from "./UserForm";

export const UserCreatePage = () => {
    const {saveButtonProps, formProps} = useForm();

    return (
        <Create
            title="Добавление пользователя"
            saveButtonProps={saveButtonProps}
        >
            <Row>
                <Col offset={6} span={12}>
                    <UserForm action="create" formProps={formProps}/>
                </Col>
            </Row>
        </Create>
    )
}
