<template>
  <CommonPage>
    <template #action>
      <n-button v-permission="'Upload'" type="primary" @click="openUpload()">
        <i class="i-material-symbols:add mr-4 text-18"/>
        上传
      </n-button>
    </template>

    <MeCrud
        ref="$table"
        v-model:query-items="queryItems"
        :scroll-x="1200"
        :columns="columns"
        :get-data="api.read"
    >
    </MeCrud>

    <MeModal ref="modalRef" width="520px">
      <n-form
          ref="modalFormRef"
          label-placement="left"
          label-align="left"
          :label-width="80"
          :model="modalForm"
          :disabled="modalAction === 'view'"
      >
        <n-form-item
            label="业务名称"
            path="bizType"
            :rule="{
              required: true,
              message: '请输入文件业务名',
              trigger: ['input', 'blur'],
            }"
        >
          <n-input v-model:value="modalForm.bizType" :disabled="modalAction !== 'upload'"/>
        </n-form-item>
        <n-form-item
            label="选择文件"
            path="files"
            :rule="{
              required: true,
              message: '选择文件',
              type: 'array',
              trigger: ['change'],
            }"
        >
          <n-upload
              multiple
              directory-dnd
              name="files"
              :max="5"
              v-model:file-list="modalForm.files"
              :default-upload="false"
          >
            <n-upload-dragger>
              <div style="margin-bottom: 12px">
                <n-icon size="48" :depth="3">
                  <i class="i-fe:archive" />
                </n-icon>
              </div>
              <n-text style="font-size: 16px">
                点击或者拖动文件到该区域来上传
              </n-text>
            </n-upload-dragger>
          </n-upload>
        </n-form-item>
      </n-form>
    </MeModal>

    <MeModal ref="previewModalRef" width="520px">
      <videoPlay></videoPlay>
    </MeModal>

  </CommonPage>
</template>

<script setup>
import {NButton} from 'naive-ui'
import {formatDateTime} from '@/utils'
import {MeCrud, MeModal} from '@/components'
import {useCrud, useModal} from '@/composables'
import api from './api'

import 'vue3-video-play/dist/style.css'
import {videoPlay} from 'vue-video-play'

defineOptions({name: 'FileMgr'})

const $table = ref(null)
/** QueryBar筛选参数（可选） */
const queryItems = ref({})

onMounted(() => {
  $table.value?.handleSearch()
})
const columns = [
  {
    title: '文件编号',
    key: 'id',
    width: 150,
  },
  {
    title: '文件名', key: 'originalFileName', width: 150,
    ellipsis: {tooltip: true},
    render: ({id, originalFileName, suffix, url}) =>
        h(
            NButton,
            {
              tag: "a",
              href: url,
              target: "_blank",
              text: true,
              type: "primary",
              onClick: e => {
                e.preventDefault();
                doPlay({id, suffix, url});
              },
            },
            {
              default: () => originalFileName
            }
        )
  },
  {
    title: '业务类型', key:
        'bizType', width:
        150, ellipsis:
        {
          tooltip: true
        }
  }
  ,
  {
    title: '创建时间',
    key:
        'createDate',
    width:
        180,
    render(row) {
      return h('span', formatDateTime(row['createTime']))
    }
    ,
  }
  ,
  {
    title: '操作',
    key:
        'actions',
    width:
        320,
    align:
        'right',
    fixed:
        'right',
    hideInExcel:
        true,
    render(row) {
      return [
        h(
            NButton,
            {
              size: 'small',
              type: 'error',
              style: 'margin-left: 12px;',
              onClick: () => handleDelete(row.id),
            },
            {
              default: () => '删除',
              icon: () => h('i', {class: 'i-material-symbols:delete-outline text-14'}),
            }
        ),
      ]
    }
    ,
  }
  ,
]

const {
  modalRef,
  modalFormRef,
  modalForm,
  modalAction,
  handleDelete,
  handleOpen,
  handleSave,
} = useCrud({
  name: '文件',
  initForm: {},
  doCreate: api.create,
  doDelete: api.delete,
  doUpdate: api.update,
  refresh: () => $table.value?.handleSearch(),
})

function openUpload() {
  handleOpen({
    action: 'upload',
    title: '上传文件',
    row: {},
    onOk: onUpload,
  })
}

function onUpload() {
  if (modalAction.value === 'upload') {
    const {bizType, files} = modalForm.value
    const formData = new FormData();
    formData.append('bizType', bizType)
    const ufs = [...files].map(it => it.file)
    ufs.forEach(f => {
      formData.append('files', f)
    })
    return handleSave({
      api: () => api.create(formData),
      cb: () => $message.success('新增成功'),
    })
  }
  handleSave()
}

const {previewModalRef, previewOkLoading} = useModal()

const playerOptions = {

}

// TODO: 多媒体资源预览。
function doPlay(row) {
  previewModalRef.value?.open({
    ...playerOptions,
    async onOk() {
      if (typeof onOk === 'function') {
        return await onOk()
      } else {
      }
    },
  })
  if (row.suffix === 'mp4') {
    console.log("播放视频")
  } else if (row.suffix === "png") {
    console.log("预览图片")
  } else {
    console.log("下载文件")
  }
}
</script>
