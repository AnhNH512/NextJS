import React, {useEffect, useState} from 'react';
import {Button, Modal, Form, Input, message} from 'antd';

const {useForm, Item} = Form;

interface PropsModal {
  visible?: boolean;
  onCreate?: Function;
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  dataEdit: any;
}

const ModalAddEdit: React.FC<PropsModal> = (props) => {
  const {dataEdit, visible, onCreate, onCancel} = props;
  useEffect(() => {
    if (dataEdit.id) {
      form.setFieldsValue({...dataEdit});
    }
  }, []);

  const [form] = useForm();

  const onOk = () => {
    form
      .validateFields()
      .then((value) => {
        console.log(value, 'value');
        if (onCreate) {
          onCreate(value);
        }
      })
      .catch((err) => {
        message.destroy();
        message.warning(err.toString());
      });
  };

  return (
    <>
      <Modal
        title="Modal Add User"
        open={visible}
        onCancel={onCancel}
        footer={[
          <Button key={1} onClick={onOk}>
            Lưu
          </Button>,
          <Button key={2} onClick={onCancel}>
            Hủy
          </Button>,
        ]}
      >
        <Form
          form={form}
          name="validateOnly"
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item hidden name="id"></Form.Item>
          <Form.Item
            name="name"
            label="Tên người dùng"
            rules={[{required: true}]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Nhập email" rules={[{required: true}]}>
            <Input type="email" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddEdit;
