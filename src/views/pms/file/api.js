
import {request} from '@/utils'
import JSONbig from "json-bigint"
const JSONbigToString = JSONbig({ storeAsString: true })

export default {
    create: (data) => request.post('/files/upload', data),
    read: (param = {}) => request.post('/files/page', {...param}, {
        transformResponse: data => JSONbigToString.parse(data)
    }),
    update: (data) => request.patch(`/files/${data.id}`, data),
    delete: (id) => request.delete(`/files/${id}`),
}
