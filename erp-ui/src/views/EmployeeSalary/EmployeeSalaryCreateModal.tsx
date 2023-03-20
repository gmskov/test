import {Button, Col, Form, InputNumber, Modal, Row, Select} from "@pankod/refine-antd";
import {EmployeeSalary} from "./EmployeeSalary";
import {BaseKey} from "@pankod/refine-core";
import {useCallback, useState} from "react";
import {DatePickerString} from "../../components/refine-antd-helpers/DatePickerString";

export type EmployeeSalaryCreateModalProps = {
    open?: boolean;
    inProgress?: boolean;
    error?: string;
    success?: boolean;
    employeeId?: BaseKey;
    onSave: (payload: EmployeeSalary) => void;
    onCancel: () => void;
}

export const EmployeeSalaryCreateModal = ({employeeId, onSave, open, onCancel, inProgress}: EmployeeSalaryCreateModalProps) => {
    const [form] = Form.useForm();
    const [validating, setValidating] = useState(false);

    const onOk = useCallback(async () => {
        setValidating(true);
        try {
            const validationResult = await form.validateFields();
            onSave({
                ...validationResult,
                employee: employeeId,
            });
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setValidating(false);
        }
    }, [form, employeeId, onSave]);

    return (
        <Modal
            open={open && employeeId != null}
            title="Зарплата"
            destroyOnClose
            onOk={onOk}
            onCancel={onCancel}
            footer={[
                <Button
                    key="cancel"
                    loading={inProgress || validating}
                    onClick={onCancel}
                >Отмена</Button>,
                <Button
                    key="save"
                    type="primary"
                    loading={inProgress || validating}
                    onClick={onOk}
                >Сохранить</Button>,
            ]}
        >
            <Form
                preserve={false}
                form={form}
                labelCol={{span: 5}}
                wrapperCol={{span: 8}}
            >
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name="dateEffective"
                            label="Дата"
                            rules={[
                                {required: true},
                            ]}
                        >
                            <DatePickerString
                                format={["DD.MM.YYYY", "YYYY-MM-DD"]}
                                valueFormat="YYYY-MM-DD"
                                style={{width: "100%"}}
                            />
                        </Form.Item>
                        <Form.Item
                            name="baseUnit"
                            label="Расчет за"
                            rules={[{required: true}]}
                            initialValue="hour"
                        >
                            <Select
                                options={[
                                    {value: "hour", label: "час"},
                                    {value: "month", label: "месяц"},
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            name="rate"
                            label="Ставка"
                            rules={[
                                {required: true,},
                                {
                                    validator: async (_, v) => {
                                        if (v <= 0) {
                                            throw new Error("Ставне должна быть больше нуля")
                                        }
                                    }
                                }
                            ]}
                        >
                            <InputNumber
                                controls={false}
                                precision={2}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
};
