import {Col, Edit, useForm} from "@pankod/refine-antd";

import {UserForm} from "./UserForm";

export const UserEditPage = () => {
    const {saveButtonProps, formProps} = useForm();

    return (
        <Edit
            title="Редактирование пользователя"
            saveButtonProps={saveButtonProps}
        >
            <Col offset={6} span={12}>
                <UserForm action="edit" formProps={formProps}/>
            </Col>
        </Edit>
    );
}
