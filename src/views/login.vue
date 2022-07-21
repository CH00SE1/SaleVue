<template>
  <div id="background">
    <div id="logo">HS_System</div>
    <div id="login">
      <el-card class="box-card">
        <div id="form">
          <el-input v-model="username" placeholder="请输入内容"></el-input>
          <el-input
            placeholder="请输入密码"
            v-model="password"
            show-password
          ></el-input>
          <el-button type="primary">登录</el-button>
        </div>
      </el-card>
    </div>
    <div id="clock">
      <div id="time">{{time}}</div>
      <div id="date">{{date}}</div>
    </div>
    <div id="copyright">copyright © liushaoxiong {{date}}</div>
  </div>
</template>
<!-- 加上scoped组件 当前页面生效 -->
<style scoped>
#background {
  /* 90度渐变色 */
  background-image: linear-gradient(90deg, cyan, purple);
  background-size: 400%;
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0%;
  left: 0%;
  animation: myanimation 10s infinite;
}
@keyframes myanimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
#logo {
  color: aliceblue;
  font-size: 25px;
  font-weight: 800;
  text-transform: uppercase;
  position: absolute;
  top: 15%;
  left: 15%;
}
#login {
  position: absolute;
  top: 38%;
  left: 38%;
}
.el-card {
  width: 373px;
  height: 210px;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 15px;
}
#form{
  line-height: 60px;
  padding-left: 15px;
  padding-right: 15px;
}
#clock{
  color: aliceblue;
  position: absolute;
  top: 80%;
  left: 5%;
  text-align: left;
}
#time{
  font-size: 80px;
}
#date{
  font-size: 40px;
}
#copyright{
  color: aliceblue;
  position: absolute;
  top: 95%;
  left: 45%;
}
</style>
<script>
export default {
  data () {
    return {
      username: '',
      password: '',
      time: '',
      date: ''
    }
  },
  // vue钩子函数
  mounted () {
    this.$nextTick(() => {
      setInterval(this.update_clock, 1000)
    })
  },
  methods: {
    update_clock: function () {
      var d = new Date()
      var year = d.getFullYear()
      var mon = d.getMonth()
      var day = d.getDay()
      if (day < 10) {
        day = '0' + day
      }
      var hour = d.getHours()
      var minute = d.getMinutes()
      var seconds = d.getSeconds()
      this.time = hour + ':' + minute + ':' + seconds
      this.date = year + '/' + mon + '/' + day
    }
  }
}
</script>
