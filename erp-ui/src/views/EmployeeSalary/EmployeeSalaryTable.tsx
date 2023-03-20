import {Button, Col, Row, Space, Table} from "@pankod/refine-antd"
import {BaseKey, useCreate, useList} from "@pankod/refine-core";
import {DeleteOutlined, EditOutlined, PlusSquareOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/es/table/interface";
import {EmployeeSalary} from "./EmployeeSalary";
import {EmployeeSalaryCreateModal} from "./EmployeeSalaryCreateModal";
import {useCallback, useState} from "react";

export type EmployeeSalaryTableProps = {
    employeeId?: BaseKey | undefined;
}

const columns: ColumnsType<EmployeeSalary> = [
    {title: "Дата", dataIndex: "dateEffective"},
    {
        title: "Условия",
        render: (_, rec) => {
            return `${rec.rate} EUR/${rec.baseUnit} ${rec.net ? "нетто" : "брутто"}`
        }
    },
    {
        render: () => {
            return (
                <Space>
                    <Button type="link" size="small" icon={<EditOutlined/>}/>
                    <Button type="link" size="small" icon={<DeleteOutlined/>}/>
                </Space>
            )
        }
    }
]

export const EmployeeSalaryTable = ({employeeId}: EmployeeSalaryTableProps) => {
    const [createOpen, setCreateOpen] = useState(false);
    const {mutate: addSalary, isLoading: isCreating} = useCreate<EmployeeSalary>()

    const {data, isLoading} = useList({
        resource: "employeeSalary",
        config: {
            filters: [
                {
                    field: "employee",
                    operator: "eq",
                    value: employeeId,
                }
            ]

        }
    });

    const openCreateSalary = useCallback(() => {
        setCreateOpen(true);
    }, []);

    const onCreateSalarySave = useCallback((values: EmployeeSalary) => {
        console.log(values);
        addSalary({
            resource: "employeeSalary",
            values
        })
    }, []);

    const onCreateSalaryCancel = useCallback(() => {
        setCreateOpen(false);
    }, []);

    return (
        <>
            <Row style={{marginBottom: ".5rem"}}>
                <Col span={24}>
                    <div style={{display: "flex", justifyContent: "flex-end"}}>
                        <Button type="primary" onClick={openCreateSalary}>
                            <PlusSquareOutlined/>Добавить
                        </Button>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table
                        loading={isLoading}
                        dataSource={data?.data as EmployeeSalary[]}
                        columns={columns}
                        size="small"
                    />
                </Col>
            </Row>
            <EmployeeSalaryCreateModal
                open={createOpen}
                employeeId={employeeId}
                inProgress={isCreating}
                onSave={onCreateSalarySave}
                onCancel={onCreateSalaryCancel}
            />
        </>
    );
}
