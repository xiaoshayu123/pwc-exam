<template>
  <el-card class="box-card">
    <el-row type="flex" justify="center">
      <el-col :span="12">
        <el-form label-position="left" label-width="80px" :model="formLogin"  ref="formLogin">
          <el-form-item label="账号" prop="name">
            <el-input v-model="formLogin.name"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="formLogin.password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPassword">
            <el-input v-model="formLogin.checkPassword"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
            <el-button @click="resetForm">取消</el-button>
          </el-form-item>
          <el-form-item>
            <span style="cursor:pointer;" @click="GoGithub">
              <i class="el-icon-fa-github"></i>
            </span>
          </el-form-item>
          <el-form-item>
            <router-link to="/phone">
              <el-button type="">手机号登录<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </router-link>
          </el-form-item>
          <el-form-item>
            <router-link to="/register">
              <el-button type="">没有账号，立即注册<i class="el-icon-arrow-right el-icon--right"></i></el-button>
            </router-link>
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
        formLogin: {
          name: '',
          password: '',
          checkPassword: ''
        },
      }
    },
    methods: {
      // 向登录接口发起请求
      login () {
        let user = this.formLogin
        // 表单验证
        this.$refs['formLogin'].validate((valid) => {
          if (valid) {
            // 通过验证之后才请求登录接口
            axios.get(`http://localhost:3000/api/user/login?username=${user.name}&password=${user.password}&type=username`).then(res=>{
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
          } else {
            this.$message.error('表单验证失败!')
            return false
          }
        })
      },
      GoGithub () {
        axios.get('http://localhost:3000/api/user/auth/github').then(res=>{
          console.log(res.data);
          window.location.href = res.data.message
        })
      },
  }
}

</script>
