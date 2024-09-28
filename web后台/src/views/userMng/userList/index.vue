<template>
  <!-- 删除用户的弹窗 -->
  <el-dialog v-model="deleteDiaLogVisible.show" title="确认删除吗？" width="30%">
    <span>点击确认删除人员 “{{ deleteDiaLogVisible.userInfo.userName }}”</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="deleteDiaLogVisible.show = false">取消</el-button>
        <el-button type="danger" @click="_deleteUser"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 修改密码的弹窗 -->
  <el-dialog v-model="changePasswordDialogVisible.show" title="修改密码" width="30%">
    <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" label-width="120px" status-icon>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName" :disabled="true" />
      </el-form-item>
      <el-form-item label="原密码" prop="passWord">
        <el-input v-model="ruleForm.passWord" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="ruleForm.newPassword" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="changePasswordDialogVisible.show = false"> 取消 </el-button>
        <el-button type="primary" @click="changePasswordHandle(ruleFormRef)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 编辑或添加用户的弹窗 -->
  <el-dialog
    v-model="addOrEditUserDialogVisible.show"
    :title="isEdit ? '编辑用户' : '添加用户'"
    width="30%"
  >
    <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" label-width="120px" status-icon>
      <el-form-item label="所属角色" prop="authorityId">
        <el-select
          v-model="ruleForm.authorityId"
          :disabled="Boolean(isEdit)"
          placeholder="请选择用户所属角色"
        >
          <el-option
            v-for="item in allAuthorityList"
            :key="item.value + 'selectAuth'"
            :label="item.authorityName"
            :value="item.authorityId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="手机号" prop="phoneNumber">
        <el-input v-model="ruleForm.phoneNumber" />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName" :disabled="Boolean(isEdit)" />
      </el-form-item>

      <el-form-item label="密码" prop="passWord" v-if="!isEdit">
        <el-input v-model="ruleForm.passWord" :disabled="Boolean(isEdit)" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="addOrEditUserDialogVisible.show = false">取消</el-button>
        <el-button type="primary" @click="addOrEditUser(ruleFormRef)"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>

  <div style="display: flex">
    <Screen />
    <el-button
      style="width: 88px; color: #fff; margin-left: 15px"
      color="rgb(251, 113, 46)"
      type="primary"
      @click="(addOrEditUserDialogVisible.show = true), (addOrEditUserDialogVisible.userInfo = {})"
    >
      添加用户
    </el-button>
  </div>
  <el-table v-loading="loading" :data="userList" :row-style="{ height: '50px' }">
    <el-table-column type="index" label="序号" width="80">
      <template #default="scope">
        <div>
          {{ scope.$index + 1 * (pagination.currentPage - 1) * 12 + 1 }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="userName" label="用户名" />
    <el-table-column prop="phoneNumber" label="手机号" />
    <el-table-column prop="authorityId" label="角色">
      <template #default="scope">
        <div>
          {{
            allAuthorityList.length
              ? allAuthorityList.filter(
                  (authority) => authority.authorityId === scope.row.authorityId
                )[0].authorityName
              : ''
          }}
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="authorityId" label="编辑">
      <template #default="scope">
        <div style="display: flex">
          <el-button type="primary" @click="edit(scope.row)">编辑 </el-button>
          <el-button type="primary" @click="_changePassword(scope.row)">修改密码 </el-button>
          <el-button
            type="danger"
            @click="deleteDiaLogVisible = { show: true, userInfo: scope.row }"
            >删除
          </el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <div style="display: flex; padding-top: 10px">
    <el-pagination
      v-model:current-page="pagination.currentPage"
      style="margin-left: auto"
      background
      layout="prev, pager, next"
      :page-size="12"
      :pager-count="11"
      :total="pagination.total"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watchEffect, computed, watch } from 'vue'
import md5 from 'js-md5'
import { getUserList, addUser, editUser, deleteUser, changePassword } from '@/api/user.ts'
import moment from 'moment'
import { useRouter, useRoute } from 'vue-router'
import Screen from './screen.vue'
import { ElMessage } from 'element-plus'
import { useStore, mapState } from 'vuex'
import type { FormInstance, FormRules } from 'element-plus'

//router
const $store = useStore()
const route = useRoute()
const router = useRouter()

//vuex
let userState = mapState('userMng', ['screen'])
let screen: any = computed(userState.screen.bind({ $store }))
const globalDataState = mapState('globalData', ['allAuthorityList'])
interface Authority {
  authorityId: string
  authorityName: string
}
const allAuthorityList = computed<Authority[]>(
  globalDataState.allAuthorityList.bind({ $store }) || []
)
//state
const deleteDiaLogVisible = ref<{ show: boolean; userInfo: any }>({
  show: false,
  userInfo: {}
})
const loading = ref(true)
const addOrEditUserDialogVisible = ref<{ show: boolean; userInfo: any }>({
  show: false,
  userInfo: {}
})
const changePasswordDialogVisible = ref<{ show: boolean; userInfo: any }>({
  show: false,
  userInfo: {}
})
const userList = ref([])
interface pagination_type {
  currentPage: number
  pageSize: number
  total: number
}
const pagination = reactive<pagination_type>({
  currentPage: 0,
  pageSize: 12,
  total: 0
})
interface RuleForm {
  authorityId: string
  passWord: any
  userName: string
  newPassword?: string
  phoneNumber: string
}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  authorityId: '',
  passWord: '',
  userName: '',
  phoneNumber: ''
})
const isEdit = computed(() => {
  return Boolean(addOrEditUserDialogVisible.value.userInfo.id)
})
const rules = reactive<FormRules>({
  authorityId: [
    {
      required: true,
      trigger: 'change',
      message: '请选择角色'
    }
  ],
  passWord: [
    {
      required: true,
      trigger: 'change',
      message: '请输入密码'
    }
  ],
  newPassword: [
    {
      required: true,
      trigger: 'change',
      message: '请输入新密码'
    }
  ],
  phoneNumber: [
    {
      required: true,
      trigger: 'change',
      message: '请输入手机号'
    }
  ],
  userName: [
    {
      required: true,
      trigger: 'change',
      message: '请输入用户名'
    }
  ]
})

//watch
watch(
  () => addOrEditUserDialogVisible,
  (val: any) => {
    if (!val.value.show) {
      clear()
      //   addOrEditUserDialogVisible.value.userInfo = {};
    }
  },
  { deep: true }
)
watch(
  () => changePasswordDialogVisible,
  (val: any) => {
    if (!val.value.show) {
      clear()
      // changePasswordDialogVisible.value.userInfo = {};
    }
  },
  { deep: true }
)
watch(
  () => route.query,
  (val: any) => {
    if (route.path === '/userMng') {
      pagination.currentPage = val.page * 1
    }
  }
)

watch(
  () => screen,
  (newValue, oldValue) => {
    pagination.currentPage = 1
    router.push({
      path: '/userMng',
      query: { page: 1, type: 'user' }
    })
  },
  { deep: true }
)
watchEffect(() => {
  pagination.currentPage && _getUserList()
})

onMounted(() => {
  pagination.currentPage = router.currentRoute.value.query.page * 1
})

//method
const _deleteUser = async () => {
  try {
    const res = await deleteUser({
      id: deleteDiaLogVisible.value.userInfo.id,
      userName: deleteDiaLogVisible.value.userInfo.userName,
      uuid: deleteDiaLogVisible.value.userInfo.uuid
    })
    if (res.code === 0) {
      ElMessage.success(res.msg)
      deleteDiaLogVisible.value.show = false
      _getUserList()
    }
  } catch (error) {}
}

const edit = (userInfo) => {
  addOrEditUserDialogVisible.value.show = true
  addOrEditUserDialogVisible.value.userInfo = userInfo
  ruleForm.authorityId = userInfo.authorityId
  ruleForm.phoneNumber = userInfo.phoneNumber
  ruleForm.userName = userInfo.userName
}

const _changePassword = (userInfo) => {
  changePasswordDialogVisible.value.show = true
  changePasswordDialogVisible.value.userInfo = userInfo
  ruleForm.authorityId = userInfo.authorityId
  ruleForm.phoneNumber = userInfo.phoneNumber
  ruleForm.userName = userInfo.userName
}

const changePasswordHandle = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        const { passWord, newPassword, userName } = ruleForm
        const res = await changePassword({
          userName,
          passWord: md5(passWord),
          newPassword: md5(newPassword)
        })
        addOrEditUserDialogVisible.value.show = false
        ElMessage.success(res.msg)
      } catch (error) {
        console.error(error)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

const addOrEditUser = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        const API = isEdit.value ? editUser : addUser
        const { authorityId, passWord, phoneNumber, userName } = ruleForm
        const params: any = {
          phoneNumber,
          userName
        }
        // 添加用户
        if (!isEdit.value) {
          params.authorityId = authorityId
          params.passWord = md5(passWord)
        } else {
          const currentUser: any = addOrEditUserDialogVisible.value.userInfo
          params.uuid = currentUser.uuid
          params.id = currentUser.id
        }
        const res = await API(params)
        if (res.code === 0) {
          ElMessage.success(res.msg)
          await _getUserList()
          addOrEditUserDialogVisible.value.show = false
        }
      } catch (error) {
        console.error(error)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
const handleCurrentChange = (currentPage: any) => {
  router.push({
    path: '/userMng',
    query: { page: currentPage, type: 'user' }
  })
}
function clear() {
  ruleForm.authorityId = ''
  ruleForm.passWord = ''
  ruleForm.phoneNumber = ''
  ruleForm.userName = ''
}

async function _getUserList() {
  loading.value = true
  try {
    const { authorityId } = screen.value
    interface Screen {
      authorityId?: string
    }
    const screenParams: Screen = {}
    if (authorityId !== '') {
      screenParams.authorityId = authorityId
    }
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize
    }

    const res: any = await getUserList({
      ...params,
      ...screenParams
    })
    if (!res.data.list) {
      userList.value = []
      return
    }
    let list = [...res.data.list]
    userList.value = list
    pagination.total = res.data.total
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped></style>
