<template>
  <div class="page" v-if="!isLoginPage">
    <!-- 修改密码的弹窗 -->
    <el-dialog v-model="changePasswordVisible" title="修改密码" width="30%" destroy-on-close>
      <el-form ref="ruleFormRef" :rules="rules" :model="ruleForm" label-width="120px" status-icon>
        <el-form-item label="原密码" prop="passWord">
          <el-input v-model="ruleForm.passWord" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="ruleForm.newPassword" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="newPasswordConfirm">
          <el-input v-model="ruleForm.newPasswordConfirm" />
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="changePasswordVisible = false"> 取消 </el-button>
          <el-button type="primary" @click="changePasswordHandle(ruleFormRef)"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
    <div class="header">
      <div style="color: #333" id="menuTitle">管理后台</div>
      <el-breadcrumb
        :separator-icon="ArrowRight"
        separator-class="el-icon-arrow-right"
        style="padding: 20px; display: flex; align-items: center"
      >
        <el-breadcrumb-item :to="item.path" v-for="(item, index) in breadcrumbList" :key="index">{{
          item.name
        }}</el-breadcrumb-item>
      </el-breadcrumb>

      <div style="display: flex; align-items: center">
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar :size="30" style="margin-right: 5px">
              <el-icon :size="22">
                <UserFilled color="rgb(133,175,245)" />
              </el-icon>
            </el-avatar>
            {{ userInfo.userName }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="changePasswordVisible = true">修改密码</el-dropdown-item>
              <el-dropdown-item @click="exit">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="content">
      <div class="menu" id="menu">
        <MenuBox :routes="routes" />
      </div>
      <div class="content_content">
        <div class="content_content_content"><RouterView /></div>
      </div>
    </div>
  </div>

  <login v-if="isLoginPage" />
</template>

<script lang="ts" setup>
import MenuBox from '@/components/menu/menu.vue'
import login from '@/views/login/index.vue'
import { routes } from '@/router'
import { useRouter } from 'vue-router'
import { onMounted, watch, reactive, ref, computed } from 'vue'
import { useStore, mapState, mapMutations } from 'vuex'
import { ArrowRight } from '@element-plus/icons-vue'
import md5 from 'js-md5'
import { ArrowDown } from '@element-plus/icons-vue'
import { changePassword } from '@/api/user.ts'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
const { updateUserInfo } = mapMutations('userInfoMng', ['updateUserInfo'])

// const UserFilled1 = <UserFilled color="#000" />

const $store = useStore()
const exit = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  localStorage.removeItem('userId')
  router.replace('/login')
}

let userInfoState = mapState('userInfoMng', ['userInfo'])
let userInfo: any = computed(userInfoState.userInfo.bind({ $store }))

console.log(userInfo.value, 'userInfo')
const changePasswordVisible = ref<boolean>(false)
const userId = ref(localStorage.getItem('userId'))

interface RuleForm {
  passWord: any
  newPassword: string
  newPasswordConfirm: string
}
const ruleForm = reactive<RuleForm>({
  passWord: '',
  newPassword: '',
  newPasswordConfirm: ''
})
const ruleFormRef = ref<FormInstance>()
const confirmPassWord = (rule: any, value: any, callback: any) => {
  if (value !== ruleForm.newPassword) {
    callback(new Error('2次输入的密码不一致，请重新输入'))
  } else {
    callback()
  }
}
const rules = computed(() => {
  return {
    passWord: [
      {
        required: true,
        trigger: ['blur', 'change'],
        message: '请输入密码'
      }
    ],
    newPassword: [
      {
        required: true,
        trigger: ['blur', 'change'],
        message: '请输入新密码'
      }
    ],
    newPasswordConfirm: [
      {
        required: true,
        trigger: ['blur', 'change'],
        message: '请再次输入新密码'
      },
      {
        validator: confirmPassWord,
        trigger: ['blur'],
        message: '2次输入的密码不一致，请重新输入'
      }
    ]
  }
})

const changePasswordHandle = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        const { passWord, newPassword } = ruleForm
        const res: any = await changePassword({
          id: userInfo.value.userId,
          passWord: md5(passWord),
          newPassword: md5(newPassword)
        })
        changePasswordVisible.value = false
        ElMessage.success(res.msg)
      } catch (error) {
        console.error(error)
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}

onMounted(() => {
  setTimeout(() => {
    if (
      localStorage.getItem('userId') &&
      localStorage.getItem('userName') &&
      !userInfo.value.userId &&
      !userInfo.value.userName
    ) {
      updateUserInfo.bind({ $store })({
        userName: localStorage.getItem('userName'),
        userId: localStorage.getItem('userId')
      })
    }
    document.getElementById('menuTitle').style.width =
      document.getElementById('menu').clientWidth - 12 + 'px'
  }, 100)
  $store.dispatch('globalData/getAllAuthorityList')
  $store.dispatch('globalData/getGoodsTypeList')
})

interface breadcrumb {
  name: string
  path: string
  redirect: string
}
const router = useRouter()
const isLoginPage = ref(false)

const breadcrumbList = ref<breadcrumb[]>([])
const generateBreadcrumb = () => {
  // 获取当前路由信息
  const matched = router.currentRoute.value.matched
  // 初始化面包屑导航数据
  breadcrumbList.value = []
  // 遍历路由信息，生成面包屑导航数据
  matched.forEach((item: { name: string; path: string; redirect: string }) => {
    const { name, path, redirect } = item
    breadcrumbList.value.push({
      name,
      path,
      redirect
    })
  })
}
watch(
  () => router.currentRoute.value.name,
  (newRouterName: any) => {
    setTimeout(() => {
      document.getElementById('menuTitle').style.width =
        document.getElementById('menu').clientWidth - 12 + 'px'
    }, 100)
    generateBreadcrumb()
    isLoginPage.value = newRouterName === 'login'
  },
  { immediate: true }
)
</script>
<style scope lang="less">
.page {
  .el-avatar {
    // background: #ffffff !important;
  }
}

.content {
  display: flex;
}
.header {
  color: #fff;
  height: 68px;
  padding: 0 24px;
  line-height: 68px;
  font-size: 18px;
  display: flex;
  background-image: radial-gradient(circle at 97% 2%, #f6c6c6 0%, #e5edfb00 66%);
}
.header > div:nth-child(3) {
  margin-left: auto;
}
.menu {
  min-height: calc(100vh - 68px);
  min-width: 180px;
  background: rgb(28, 43, 54);
}
.content_content {
  flex-grow: 1;
}
.content_content_content {
  background: #fff;
  min-height: 80vh;
  margin: 0 24px;
  padding: 24px;
  border-radius: 20px;
}
.example-showcase,
.el-dropdown-link {
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
}
</style>
