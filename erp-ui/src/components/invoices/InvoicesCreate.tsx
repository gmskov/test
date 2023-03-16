import React, {useCallback} from 'react'
import { IResourceComponentsProps } from '@pankod/refine-core'
import {
    Create,
    Form,
    useForm,
} from '@pankod/refine-antd'
import {Invoice} from "./Invoice";
import { axiosInstance } from '@pankod/refine-simple-rest'

export const InvoicesCreate: React.FC<IResourceComponentsProps> = () => {
    const {formProps: {onFinish, ...restFormProps}, saveButtonProps} = useForm();

    const onFinishHandler = useCallback(async ({file, ...payload}: any) => {
        if (onFinish != null) {
            const formData = new FormData();
            formData.append("file", file.file);
            const { data: { fileId } } = await axiosInstance.post('http://localhost:4567/api/file', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })

            onFinish({...payload, file: fileId })
        }
    }, [onFinish]);


    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form labelCol={{span: 8}} labelAlign="left"  {...restFormProps} onFinish={onFinishHandler}>
                <Invoice />
            </Form>
        </Create>
    );
};
