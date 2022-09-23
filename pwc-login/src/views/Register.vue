<template>
  <el-card class="box-card">
    <el-row type="flex" justify="center">
      <el-col :span="12">
        <el-form label-position="left" label-width="80px" :model="formRegister" :rules="rules" ref="formRegister">
          <el-form-item label="账号" prop="username">
            <el-input v-model="formRegister.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="formRegister.password"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="realname">
            <el-input v-model="formRegister.realname"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="formRegister.phone"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="code">
                <el-button type="primary" @click="sendSmsCode">验证码</el-button>
              <el-input v-model="formRegister.code"></el-input>
            </el-form-item>
          <el-form-item label="个人介绍" prop="description">
            <el-input v-model="formRegister.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="loginByphone">立即注册</el-button>
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
          username: '',
          password: '',
          realname: '',
          phone:'',
          code:'',
          description:''
        },
      }
    },
    methods: {
      sendSmsCode(){
            axios.get(`http://127.0.0.1:3000/api/user/sendSmsCodeToUser?phone=${this.formRegister.phone}`).then((res=>{
                this.code=res.data.data.code
                console.log(this.code);
            }))
        },
        loginByphone(){
          axios.post('http://localhost:3000/api/user/register',this.formRegister).then(res=>{
            if(res.data.errno!=1)
            {
              this.$message.success(res.data.message)
                // 登录成功 跳转至首页
                this.$router.push('/login')
            }
          })
        },
      addUser () {
        let user = this.formRegister
        let formData = {
          name: user.name,
          password: user.password
        }
        // 表单验证
        this.$refs['formRegister'].validate((valid) => {
          if (valid) {
            this.$rest.user.register(formData)
              .then(res => {
                console.dir(res)
                if (!res.success) {
                  this.$message.error(res.message)
                } else {
                  this.$message.success(res.message)
                  this.$router.push('/login')
                }
              })
              .catch(err => {
                this.$message.error(`${err.message}`)
              })
          } else {
            this.$message.error('表单验证失败!')
            return false
          }
        })
      }
    }
  }

</script>
