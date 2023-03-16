import {Form as AntdForm, Row, Col, Typography, ColProps, Space} from "@pankod/refine-antd";
import {createContext, ReactElement, useContext, useMemo} from "react";

export type ShowFieldProps = {
    name?: string;
    label?: string;
    render?: (record?: Record<string, any>) => any;
}

const ShowField = ({name, label, render}: ShowFieldProps) => {
    const {record} = useContext(ShowFormContext);
    let value: any;

    if (render == null) {
        if (name == null) {
            throw new Error('either render() or name must be provided');
        }
        if (label == null) {
            label = name.substring(0, 1).toUpperCase() + name.substring(1);
        }
        value = record == null ? undefined : record[name];
    }
    else {
        if (label == null) {
            throw new Error('label is required when using render()');
        }
        value = render(record);
    }

    return (
        <Space direction="vertical" size={0} style={{display: "flex", marginBottom: "1rem"}}>
            <label style={{display: "inline-flex"}}>
                <Typography.Text type="secondary">{label}</Typography.Text>
            </label>
            <div>
                <Typography.Text>{value}</Typography.Text>
            </div>
        </Space>
    )
}

type ShowFieldElement = ReactElement<ShowFieldProps, typeof ShowField>;
type ColElementWithFields = ReactElement<ColProps & {children: ShowFieldElement[]}>;
type ShowFormChild = ShowFieldElement | ColElementWithFields;

export type ShowFormProps = {
    fields?: ShowFieldProps[][];
    record?: Record<string, any>;
    children?: ShowFormChild | ShowFormChild[];
}

export type ShowFormContextValue = {
    record?: Record<string, any>;
};

const ShowFormContext = createContext<ShowFormContextValue>({record: {}});

export const ShowForm = ({fields, children, record}: ShowFormProps) => {
    const [form] = AntdForm.useForm();
    const ctx: ShowFormContextValue = {record};
    const layout = useMemo(() => ({
        labelCol: {span: 6},
        wrapperCol: {span: 18},
    }), []);

    return (
        <ShowFormContext.Provider value={ctx}>
            <AntdForm
                initialValues={record}
                form={form}
                layout="vertical"
                {...layout}
            >
                <Row>
                    {fields == null && children}
                    {fields != null && fields.map((column) => (
                        <Col>
                            {column.map((item) => (
                                <ShowField name={item.name} label={item.label}/>
                            ))}
                        </Col>
                    ))}
                </Row>
            </AntdForm>
        </ShowFormContext.Provider>
    );
}

ShowForm.Field = ShowField;
