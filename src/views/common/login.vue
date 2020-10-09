<template>
  <div class="site-wrapper site-page--login min300">
    <div class="site-content__wrapper">
<!--      <div style="margin-left: 90%;margin-top: 3%;font-size: 18px;color: black;" @click="denglu()">登陆</div>  v-if="dataForm.denglu"-->
      <div class="site-content">
        <div class="brand-info">
          <h2 class="brand-info__text">测评系统管理后台</h2>
<!--          <p class="brand-info__intro">用心构造软件.用智慧服务客户</p>-->
        </div>
        <div class="login-main">
          <h3 class="login-title">管理员登录</h3>
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
                   status-icon>
            <el-form-item prop="userName">
              <el-input v-model="dataForm.userName" placeholder="帐号" size="medium" autofocus></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input v-model="dataForm.password" type="password" placeholder="密码" size="medium"></el-input>
            </el-form-item>
            <el-form-item prop="captcha">
              <el-row :gutter="20">
                <el-col :span="14">
                  <el-input v-model="dataForm.captcha" placeholder="验证码" size="medium">
                  </el-input>
                </el-col>
                <el-col :span="10" class="login-captcha">
                  <img :src="captchaPath" @click="getCaptcha()" alt=""
                       style="height: 32px; width: 96px; border-radius: 4px;">
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="dataFormSubmit()" style="width: 100%">登录</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
         <!-- <div style="position: absolute;bottom: -38px;left: 50%;transform: translate(-50%, -50%);">
            <a style="font-size:12px;color: #999;text-decoration: underline;" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33068302000640" target="_blank"><i style="display: inline-block;width: 14px; height: 16px;margin-right: 6px;background: url(https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superlanding/img/icon_police_2763990.png?v=md5) 0 0 no-repeat;vertical-align: middle; margin-top: -4px;"></i>浙ICP备19048499号</a>
            <p style="color: #999">定级备案网络科技有限公司 版权所有</p>
         </div>-->
  </div>
</template>

<script>
  import {getUUID} from '@/utils'

  export default {
    data () {
      return {
        dataForm: {
          // denglu: false,
          userName: '',
          password: '',
          uuid: '',
          captcha: ''
        },
        dataRule: {
          userName: [
            {required: true, message: '帐号不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          captcha: [
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ]
        },
        captchaPath: ''
      }
    },
    created () {
      this.getCaptcha()
    },
    methods: {
      // denglu () {
      //   this.dataForm.denglu = true
      // },
      // 提交表单
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.$http({
              url: '/base/login',
              method: 'post',
              data: {
                'userName': this.dataForm.userName,
                'password': this.dataForm.password,
                'uuid': this.dataForm.uuid,
                'captcha': this.dataForm.captcha
              }
            }).then(({data}) => {
              if (data && data.code === 200) {
                if (data.homeUrl) {
                  localStorage.setItem('homeUrl', data.homeUrl)
                }
                if (data.initMethod) {
                  sessionStorage.setItem('initMethod', data.initMethod)
                }
                this.$cookie.set('token', data.token)
                this.$router.replace({name: 'hello'})
                // if (data.initMethod) {
                //   this.$router.replace({name: data.initMethod})
                // } else {
                //   this.$router.replace({name: 'home'})
                // }
              } else {
                this.getCaptcha()
              }
            })
          }
        })
      },
      // 获取验证码
      getCaptcha () {
        this.dataForm.uuid = getUUID()
        this.captchaPath = this.$http.BASE_URL + `/captcha.jpg?uuid=${this.dataForm.uuid}`
      }
    }
  }
</script>

<style lang="scss">
  body {
    margin: 0;
    padding: 0;
    height: auto;
    background: url(~@/assets/img/login_bg.jpg) no-repeat center fixed;
    background-size: 100% 100%;
  }

  .site-wrapper.site-page--login {
    text-align: center;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;

    .site-content__wrapper {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      padding: 0;
      margin: 0;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: transparent;
    }

    .brand-info {
      margin: 10% 100px 0 90px;
      color: #fff;
    }

    .brand-info__text {
      margin: 0 0 22px 0;
      font-size: 28px;
      font-weight: 400;
      text-transform: uppercase;
    }

    .brand-info__intro {
      margin: 10px 0;
      font-size: 16px;
      line-height: 1.58;
      opacity: .6;
    }

    .login-main {
      border: 0px solid;
      border-radius: 20px;
      margin: 0 auto;
      max-width: 400px;
      min-width: 300px;
      top: 0;
      right: 0;
      padding: 10px 60px 10px;
      color: #fff;
      background: rgba(109, 109, 109, 0.23);
    }

    .login-title {
      font-size: 16px;
    }

    .login-captcha {
      overflow: hidden;

      > img {
        width: 100%;
        cursor: pointer;
      }

    }
    .login-btn-submit {
      width: 100%;
      margin-top: 38px;
    }

  }
</style>
