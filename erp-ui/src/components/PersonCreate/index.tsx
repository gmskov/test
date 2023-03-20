import React, {useCallback} from "react";
import {IResourceComponentsProps} from "@pankod/refine-core";
import {Create, Form, useForm, Input, DatePicker} from "@pankod/refine-antd";
import dayjs from "dayjs";

export const PersonCreate: React.FC<IResourceComponentsProps> = () => {
    const {formProps: {onFinish, ...restFormProps}, saveButtonProps} = useForm();

    const onFinishHandler = useCallback((v: any) => {
        if (onFinish != null) {
            const {birthDate, ...rest} = v;
            onFinish({
                ...rest,
                birthDate: birthDate.format("YYYY-MM-DD"),
            });
        }
    }, [onFinish]);

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...restFormProps} onFinish={onFinishHandler} layout="vertical">
                <Form.Item
                    label="First Name"
                    name={["firstName"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name={["lastName"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input/>
                </Form.Item>
                <Form.Item
                    label="Birth Date"
                    name={["birthDate"]}
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                    getValueProps={(value) => ({
                        value: value ? dayjs(value) : undefined,
                    })}
                >
                    <DatePicker format="YYYY-MM-DD"/>
                </Form.Item>
            </Form>
        </Create>
    );
};
