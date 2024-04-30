/**********************************
 * @Author: Ronnie Zhang
 * @LastEditor: Ronnie Zhang
 * @LastEditTime: 2023/12/05 21:29:27
 * @Email: zclzone@outlook.com
 * Copyright © 2023 Ronnie Zhang(大脸怪) | https://isme.top
 **********************************/

import { request } from '@/utils'

export default {
  create: (data) => request.post('/role', data),
  read: (param = {}) => request.post('/role/page', { ...param }),
  update: (data) => request.patch(`/role/${data.id}`, data),
  delete: (id) => request.delete(`/role/${id}`),

  getAllPermissionTree: () => request.get('/permission/tree'),
  getAllUsers: (param = {}) => request.post('/user/query', { ...param }),
  addRoleUsers: (roleId, data) => request.patch(`/role/users/add/${roleId}`, data),
  removeRoleUsers: (roleId, data) => request.patch(`/role/users/remove/${roleId}`, data),
}
