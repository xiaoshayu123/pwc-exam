<template>
  <div>
    <el-card class="box-card">
      <p>username: {{user.username}}</p>
      <p>realname: {{user.realname}}</p>
      <p>description: {{user.description}}</p>
      <!-- <p v-for="user.followers"></p> -->
      <p v-if="user.followers">followers:{{user.followers}}</p>
    </el-card>
    <el-table
      :data="allUser"
      style="width: 50%;margin-left: 500px;">
      <el-table-column
        prop="realname"
        label="realname"
        width="180">
      </el-table-column>
      <el-table-column
        prop="description"
        label="description"
        width="180">
      </el-table-column>
      <el-table-column
      fixed="right"
      label="操作"
      width="100">
      <template slot-scope="scope">
        <el-button @click="handleClick(scope.row)" type="text" size="small">关注</el-button>
      </template>
    </el-table-column>
    </el-table>
  </div>
</template>

<script type="text/javascript">
  import axios from 'axios'
  export default {
    data () {
      return {
        user: {},
        activeName: 'first',
        allUser:[]
      }
    },
    created () {
      this.getData()
      this.getAllUser()
    },
    methods: {
      getData () {
        axios.get(`http://localhost:3000/api/user/auth/github/getData?token=${this.$route.query.access_token}`).then(res=>{
          console.log(res.data);
          this.user=res.data.data;
          if(this.user.followers)
          {
            let followers=this.user.followers.map(item=>item.realname);
        this.user.followers=followers;
          }
        })
      },
      handleClick(row) {
        console.log(row);
        axios.post('http://localhost:3000/api/user/addFollower',row).then(res=>{
            if(res)
            {
              console.log(res);
            axios.get(`http://localhost:3000/api/user/getInfo?username=${this.user.username}`).then(res=>{
        console.log(res);
        this.user=res.data.data;
        let followers=this.user.followers.map(item=>item.realname);
        this.user.followers=followers;
      })
            }
        })
      },
      getAllUser()
      {
        axios.get('http://localhost:3000/api/user/getAllInfo').then(res=>{
          this.allUser=res.data.data.data
          console.log(this.allUser);
        })
      }
    }
  }

</script>

<style scoped>
.image {
  height: 230px; 
}
</style>

