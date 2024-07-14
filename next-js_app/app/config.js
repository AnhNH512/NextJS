import {apiUrl} from '../settings/index';
import axios from 'axios';
const apiUrlConfig = {
  listuser: apiUrl.apiDev + 'users',
  adduser: apiUrl.apiDev + 'users/addUser',
  getinfouser: apiUrl.apiDev + 'users/getInfoUser',
  edituser: apiUrl.apiDev + 'users/editUser',
  deleteuser: apiUrl.apiDev + 'users/deleteUser',
  uploadfile: apiUrl.apiDev + 'users/uploadFile',
};

const api = {
  getListUser: (params) => axios.get(apiUrlConfig.listuser, {...params}),
  addUser: (params) => axios.post(apiUrlConfig.adduser, {...params}),
  editUser: (params) => axios.post(apiUrlConfig.edituser, {...params}),
  deleteUser: (params) => axios.post(apiUrlConfig.deleteuser, {...params}),
  getInfoUser: (params) => axios.post(apiUrlConfig.getinfouser, {...params}),
  uploadFile: (params) =>
    axios.post(apiUrlConfig.uploadfile, params, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export default api;
