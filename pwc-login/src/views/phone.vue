<template>
    <el-card class="box-card">
      <el-row type="flex" justify="center">
        <el-col :span="12">
          <el-form label-position="left" label-width="80px" :model="formRegister"  ref="formRegister">
            <el-form-item label="手机号" prop="name">
              <el-input v-model="formRegister.phone"></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="password">
                <el-button type="primary" @click="sendSmsCode">验证码</el-button>
              <el-input v-model="formRegister.code"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="loginByPhone">立即登录</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
  </template>
  
  <script type="text/javascript">
      import axios from 'axios'
    export default {
      data () {
  
        return {
          formRegister: {
            phone: '',
            code: '',
          },
          code:""
        }
      },
      methods: {
        sendSmsCode(){
            axios.get(`http://localhost:3000/api/user/sendSmsCodeToUser?phone=${this.formRegister.phone}`).then((res=>{
                this.code=res.data.data.code
                console.log(this.code);
            }))
        },
        loginByPhone()
        {
            axios.get(`http://localhost:3000/api/user/login?phone=${this.formRegister.phone}&code=${this.formRegister.code}&type=phone`).then(res=>{
                if (res) {
                console.log(res);
                this.$store.commit('updateUser',res.data.data)
                this.$message.success(res.data.message)
                // 登录成功 跳转至首页
                this.$router.push('/')
              } else {
                this.$message.error(res.message)
                return false
              }
            })
        }
      }
    }
  
  </script>
  