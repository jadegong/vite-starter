<template>
  <div class="main login">
    <a-form :model="loginPageState.formParams" id="formLogin" class="user-layout-login" @finish="onFinish">
      <a-form-item
        name="userName"
        :rules="[{ required: true, message: '请输入用户名' }]"
      >
        <a-input v-model:value="loginPageState.formParams.userName" size="large" placeholder="请输入用户名">
          <template #prefix>
            <user-outlined />
          </template>
        </a-input>
      </a-form-item>

      <a-form-item
        name="password"
        :rules="[{ required: true, message: '请输入密码' }]"
        validateTrigger="blur"
      >
        <a-input-password
          v-model:value="loginPageState.formParams.password"
          class="password"
          size="large"
          placeholder="请输入密码"
        >
          <template #prefix>
            <lock-outlined />
          </template>
        </a-input-password>
      </a-form-item>

      <a-form-item>
        <a-row :gutter="0">
          <a-col :span="16">
            <a-form-item
              name="captcha"
              :rules="[{ required: true, message: '请输入验证码' }]"
              validateTrigger="blur"
              no-style
            >
              <a-input v-model:value="loginPageState.formParams.captcha" size="large" placeholder="请输入验证码">
                <template #prefix>
                  <robot-outlined />
                </template>
              </a-input>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <img class="captcha-img" :src="loginPageState.captchaImg" @click="getCaptchaImg" />
          </a-col>
        </a-row>
      </a-form-item>

      <a-form-item style="margin-top: 24px">
        <a-button
          size="large"
          type="primary"
          html-type="submit"
          class="login-button"
          :loading="loginPageState.loginBtn"
          :disabled="loginPageState.loginBtn"
        >登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, onMounted, } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import JSEncrypt from 'jsencrypt'
import { timeFix } from '@/utils/util'
import { getCaptchaCode, getPublicKey } from '@/api/user'

// components
import { UserOutlined, LockOutlined, RobotOutlined, } from '@ant-design/icons-vue'
import { message, notification } from 'ant-design-vue'

interface LoginFormState {
  userName: string;
  password: string;
  captcha: string;
}

interface LoginPageState {
  formParams: LoginFormState;
  captchaImg: string;
  captchaId: string;
  loginKey: string;
  publicKey: string;
  loginBtn: boolean;
}

export default defineComponent({
  name: 'LoginPage',
  components: {
    UserOutlined,
    LockOutlined,
    RobotOutlined,
  },
  setup() {
    // Variables defination
    const loginPageState = reactive<LoginPageState>({
      formParams: {
        userName: '',
        password: '',
        captcha: '',
      },
      captchaImg: '',
      captchaId: '',
      loginKey: '',
      publicKey: '',
      loginBtn: false,
    })
    const store = useStore()
    const router = useRouter()

    // functions
    const getCaptchaImg = () => {
      getCaptchaCode().then((res) => {
        loginPageState.captchaImg = 'data:image/png;base64,' + res.data.encodeStr
        loginPageState.captchaId = res.data.captchaId
      })
    }

    const rsaEncryption = (content: string) => {
      let encryptor = new JSEncrypt()
      console.log(loginPageState.publicKey)
      encryptor.setPublicKey(loginPageState.publicKey)
      let encryptedStr = encryptor.encrypt(content)
      console.log(encryptedStr)
      return encryptedStr
    }

    const onFinish = (values: any) => {
      if (!loginPageState.captchaId) {
        message.warning('请先获取验证码！')
        return false
      }
      if (!loginPageState.loginKey || !loginPageState.publicKey) {
        message.warning('请先获取加密密钥！')
        return false
      }

      loginPageState.loginBtn = true
      console.log(values)
      let loginParams = {
        userName: rsaEncryption(values.userName),
        password: rsaEncryption(values.password),
        captcha: values.captcha,
        captchaId: loginPageState.captchaId,
        key: loginPageState.loginKey,
      }
      store.dispatch('Login', loginParams)
        .then((res) => {
          store.dispatch('SetLoginInfo', res).then((res1) => {
            loginSuccess(res1)
          })
        })
        .catch(() => {
          getCaptchaImg()
        })
        .finally(() => {
          loginPageState.loginBtn = false
        })
    }
    const loginSuccess = (res: any) => {
      router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        notification.success({
          message: '欢迎',
          description: `${timeFix()}，欢迎回来`,
        })
      }, 1000)
    }

    // Life cycles
    onMounted(() => {
      getCaptchaImg()
      getPublicKey().then((res) => {
        console.log(res)
        loginPageState.loginKey = res.data.key
        loginPageState.publicKey = res.data.publicKey
      })
    })

    return {
      loginPageState,
      onFinish,
      getCaptchaImg,
    }
  },
})
</script>

<style lang="less">
.main {
  display: inline-block;
  margin-top: 40%;
  margin-left: 40%;
  padding: 24px;
  box-shadow: 0 0px 5px 2px #eee;
}
.login {
  .login-icon {
    position: absolute;
    z-index: 10;
    width: 32px;
    height: 32px;
    top: -7px;
    left: 7px;
  }

  .captcha-img {
    height: 40px;
    width: 100%;
  }

  .user-layout-login {
    width: 320px;
    label {
      font-size: 14px;
    }

    .getCaptcha {
      display: block;
      width: 100%;
      height: 40px;
    }

    .forge-password {
      font-size: 14px;
    }

    button.login-button {
      padding: 0 15px;
      font-size: 16px;
      height: 40px;
      width: 100%;
    }

    .user-login-other {
      text-align: left;
      margin-top: 24px;
      line-height: 22px;

      .item-icon {
        font-size: 24px;
        color: rgba(0, 0, 0, 0.2);
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: #1890ff;
        }
      }

      .register {
        float: right;
      }
    }
  }
}
</style>
