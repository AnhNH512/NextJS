'use client';
import axios from 'axios';
import Image from 'next/image';
import {useEffect, useState} from 'react';
import {apiUrl} from '../settings/index';
import api from './config';
import ModalAddEdit from './ModalAddEdit';
import {Button, message, Modal, Table} from 'antd';
import {MouseEventHandler} from 'react';
import {errorMessage, successMessage} from '../utility';
import {Upload,UploadProps} from 'antd';
import {UploadOutlined} from '@ant-design/icons'

interface ModalAddEdit {
  visibleModalAddEdit?: boolean;
  dataAddEdit?: Record<string, any>;
  keyModalAddEdit?: number;
}

interface DataUser {
  id: number;
  name?: string;
  email?: string | undefined;
}

export default function Home() {
  const [dataModalAddEdit, setDataModalAddEdit] = useState<ModalAddEdit>({
    visibleModalAddEdit: false,
    dataAddEdit: {},
    keyModalAddEdit: 0,
  });
  const [ListUser, setListUser] = useState([]);
  const {visibleModalAddEdit, dataAddEdit, keyModalAddEdit} = dataModalAddEdit;

  useEffect(() => {
    reloadUser();
  }, []);

  const changeDataModalAddEdit = (data: ModalAddEdit) => {
    setDataModalAddEdit((prevState) => ({...prevState, ...data}));
  };

  const reloadUser = () => {
    api.getListUser().then((res) => {
      if (res.data.Status === 1) {
        setListUser(res.data.Data);
      } else {
        setListUser([]);
        errorMessage(res.data.Message);
      }
    });
  };

  const showModalAddEdit = (id?: number) => {
    const newKeyModalAddEdit = dataModalAddEdit.keyModalAddEdit ?? 0;
    if (id) {
      api
        .getInfoUser({id})
        .then((res) => {
          if (res.data.Status > 0) {
            console.log(res.data, 'res.data');
            changeDataModalAddEdit({
              visibleModalAddEdit: true,
              dataAddEdit: {...res.data.Data},
              keyModalAddEdit: newKeyModalAddEdit + 1,
            });
          } else {
            errorMessage(res.data.Message);
          }
        })
        .catch((err) => {
          errorMessage(err.toString());
        });
    } else {
      changeDataModalAddEdit({visibleModalAddEdit: true, dataAddEdit: {}});
    }
  };

  const submitModalAddEdit = (data: DataUser) => {
    if (!data.id) {
      api
        .addUser(data)
        .then((res) => {
          if (res.data.Status === 1) {
            successMessage(res.data.Message);
            reloadUser();
            hideModalAddEdit();
          } else {
            errorMessage(res.data.Message);
          }
        })
        .catch((err) => {
          errorMessage(err.toString());
        });
    } else {
      api
        .editUser(data)
        .then((res) => {
          if (res.data.Status === 1) {
            successMessage(res.data.Message);
            reloadUser();
            hideModalAddEdit();
          } else {
            errorMessage(res.data.Message);
          }
        })
        .catch((err) => {
          errorMessage(err.toString());
        });
    }
  };

  const hideModalAddEdit = () => {
    changeDataModalAddEdit({
      visibleModalAddEdit: false,
      dataAddEdit: {},
    });
  };

  const deleteUser = (id: number) => {
    Modal.confirm({
      title: 'Xóa người dùng',
      content: 'Bạn có chắc chắn muốn xóa người dùng này không',
      onOk: () => {
        api
          .deleteUser({id})
          .then((res) => {
            if (res.data.Status > 0) {
              successMessage(res.data.Message);
              reloadUser();
            } else {
              errorMessage(res.data.Message);
            }
          })
          .catch((err) => {
            errorMessage(err.toString());
          });
      },
    });
  };

  const columns = [
    {
      title: 'Tên người dùng',
      dataIndex: 'name',
      key: 'name',
      width: '50%',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '30%',
    },
    {
      title: 'Thao tác',
      key: 'action',
      align: 'center',
      width: '20%',
      render: (text: string, record: DataUser, index: number) => (
        <div className="flex  justify-around">
          <Button type="primary" onClick={() => showModalAddEdit(record.id)}>
            Sửa
          </Button>
          <Button type="primary" onClick={() => deleteUser(record.id)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  const uploadFile = (file : Blob) => {
    const formData = new FormData()
    if(file){
      formData.append('file',file)
    }
    api.uploadFile(formData).then((res) => {
      if (res.data.Status > 0) {
        successMessage(res.data.Message);
        reloadUser();
      } else {
        errorMessage(res.data.Message);
      }
    })
    .catch((err) => {
      errorMessage(err.toString());
    });
  }

  const props: UploadProps = {
    action: 'false',
    beforeUpload(file) {
      uploadFile(file)
    },

    fileList: [],
  };

  return (
    <main className="flex flex-col  justify-between p-24">
      <div className=" p-b-10 flex justify-end gap-5 mb-5">
        <Button
          type="primary"
          onClick={() => {
            showModalAddEdit();
          }}
        >
          Thêm người dùng
        </Button>
        <Upload {...props}>
    <Button icon={<UploadOutlined />}>Upload</Button>
  </Upload>
      </div>
      <div className="div">
        <Table
          style={{width: '1000px'}}
          dataSource={ListUser}
          columns={columns}
        />
      </div>
      <ModalAddEdit
        onCreate={submitModalAddEdit}
        visible={visibleModalAddEdit}
        dataEdit={dataAddEdit}
        onCancel={hideModalAddEdit}
        key={keyModalAddEdit}
      />
    </main>
  );
}
