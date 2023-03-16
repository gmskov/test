import React from "react";
import {IResourceComponentsProps, useShow} from "@pankod/refine-core";
import {Col, PageHeader, Card, Row} from "@pankod/refine-antd";
import {ShowForm} from "../../components/refine-antd-helpers/components/show";
import {EmployeeSalaryTable} from "../../views/EmployeeSalary/EmployeeSalaryTable";

export const EmployeeShow: React.FC<IResourceComponentsProps> = () => {
    const {queryResult} = useShow();
    const {data} = queryResult;

    const record = data?.data;

    return (
        <>
            <PageHeader
                ghost={false}
                title={record?.person?.firstName + " " + record?.person?.lastName}
            >
                <Row gutter={24}>
                    <Col span={8}>
                        <Card title="Общая информация">
                            <ShowForm record={record}>
                                <Col span={12}>
                                    <ShowForm.Field label="Имя" render={(r) => r?.person?.firstName}/>
                                    <ShowForm.Field label="Фамилия" render={(r) => r?.person?.lastName}/>
                                    <ShowForm.Field name="taxId" label="Личный код"/>
                                </Col>
                                <Col span={12}>
                                    <ShowForm.Field name="address" label="Адрес"/>
                                    <ShowForm.Field name="phone" label="Телефон"/>
                                    <ShowForm.Field name="email"/>
                                </Col>
                            </ShowForm>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card title="Данные о ЗП">
                            <EmployeeSalaryTable employeeId={record?.id}/>
                        </Card>
                    </Col>
                </Row>
            </PageHeader>
            {/*
        <Show isLoading={isLoading} title={record?.person?.firstName + " " + record?.person?.lastName}>
            <ShowForm record={record}>
                <Col span={6}>
                    <ShowForm.Field label="Имя" render={(r) => r?.person?.firstName}/>
                    <ShowForm.Field label="Фамилия" render={(r) => r?.person?.lastName}/>
                    <ShowForm.Field name="taxId" label="Личный код"/>
                </Col>
                <Col span={6}>
                    <ShowForm.Field name="address" label="Адрес"/>
                    <ShowForm.Field name="phone" label="Телефон"/>
                    <ShowForm.Field name="email"/>
                </Col>
            </ShowForm>
        </Show>
*/}
        </>
    );
};
