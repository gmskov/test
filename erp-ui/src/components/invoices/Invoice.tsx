import {useState} from "react";
import {Col, DatePicker, Form, Input, Row, Upload} from "@pankod/refine-antd";
import {InboxOutlined} from "@ant-design/icons";
import {FileViewer} from "./FileViewer";

const { TextArea } = Input;

export const Invoice = () => {
    const [file, setFile] = useState<File>();

    return (
        <Row gutter={24}>
            <Col span={16}>
              <Form.Item
                name="file"
                hidden={file != null}
              >
                {file == null && (
                    <Upload.Dragger
                        style={{maxWidth: "40rem", margin: "0 auto"}}
                        multiple={false}
                        beforeUpload={(file) => {
                            setFile(file);
                            return false;
                        }}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined/>
                        </p>
                        <p className="ant-upload-text">Щелкните или перетащите сюда файл</p>
                    </Upload.Dragger>
                )}
              </Form.Item>
                {file != null && <FileViewer file={file} onDelete={() => setFile(undefined)}/>}
            </Col>
            <Col span={8}>
                <div>
                    <Form.Item
                      name="invoiceDate"
                      label="Дата счета"
                      rules={[{ required: true }]}
                    >
                        <DatePicker style={{width: "100%"}}/>
                    </Form.Item>
                    <Form.Item
                      name="amount"
                      label="Сумма"
                      rules={[{ required: true }]}
                    >
                        <Input type="number"/>
                    </Form.Item>
                    <Form.Item
                      rules={[{ required: true }]}
                      name="description"
                      label="Описание"
                    >
                        <TextArea autoSize={{ minRows: 2, maxRows: 6 }}/>
                    </Form.Item>
                    <Form.Item name="note" label="Заметка">
                      <TextArea autoSize={{ minRows: 2, maxRows: 6 }}/>
                    </Form.Item>
                </div>

            </Col>
        </Row>
    );
};
