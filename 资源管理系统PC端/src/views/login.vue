<template>
  <div class="login-back">
    <div class="login-input">
      <div>
        <img src="../assets/title_left.png" alt="">
        <span>资源管理系统登录</span>
        <img src="../assets/title_right.png" alt="">
      </div>
      <div>
        <img src="../assets/person.png" alt="">
        <input type="text" placeholder="请输入账号" autocomplete="off" v-model="loginForm.user">
      </div>
      <div>
        <img src="../assets/lock.png" alt="" >
        <input type="password" placeholder="请输入密码" autocomplete="off"
          v-on:keyup.enter="login" v-model="loginForm.password">
      </div>
      <div>
        <div class="login-btn" @click="login" v-loading="loading"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">登 录</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      loginForm: {user: '', password: ''},
      loading: false,
      // url: 'http://10.4.35.16/ziyuan/public/index.php/' // 局域网
      url: 'http://106.53.245.88/ziyuan/public/index.php/' // 腾讯云
    }
  },
  methods: {
    login () {
      this.loading = true
      if (this.loginForm.user === '') {
        this.$message.error('用户名不能为空')
        this.loading = false
      } else if (this.loginForm.password === '') {
        this.$message.error('密码不能为空')
        this.loading = false
      } else if (this.loginForm.user.indexOf(' ') !== -1 || this.loginForm.password.indexOf(' ') !== -1) {
        this.$message.error('用户名或密码输入格式有问题')
        this.loading = false
      } else {
        this.$axios({
          url: this.url + 'manage/login',
          method: 'post',
          data: this.loginForm
        }).then(res => {
          if (res.data.code === '11') {
            this.$message({ message: res.data.msg, type: 'success' })
            if (res.data.data.login === 0) {
              res.data.data.login = {time: '暂无', ip: '暂无', place: '暂无登录记录'}
            }
            sessionStorage.setItem('user', JSON.stringify(res.data.data))
            this.$router.push({path: '/index'})
          } else {
            this.$message.error(res.data.msg)
          }
          this.loading = false
          console.log(res)
        }).catch(() => {
          this.$message.error('网络连接出错')
          this.loading = false
        })

        this.$axios({
          url: this.url + 'manage/printIp'
        }).then((res) => {
          let operation = {
            user: this.loginForm.user,
            operation: '在【' + res.data.place + '】登录了资源平台管理系统'
          }
          this.$axios({
            url: this.url + 'manage/operation',
            method: 'post',
            data: operation
          }).then(() => {})
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.login-back{
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-image: url('../assets/loginPic.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  justify-content: center;
  .login-input{
    width: 500px;
    height: 400px;
    position: relative;
    top: 80px;
    background: url('../assets/border.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    div{
      width: 100%;
      color: white;
      margin: auto;
      line-height: 120px;
    }
    div:first-child{
      height: 100px;
      font-size: 20px;
    }
    div:nth-child(2), div:nth-child(3){
      width: 80%;
      height: 80px;
      text-align: center;
      background: url('../assets/loginInput.png');
      background-size: 80% 80%;
      background-repeat: no-repeat;
      background-position: center;
      img{
        width: 30px;
        position: relative;
        left: 20px;
        bottom: 10px;
      }
      input{
        width: 60%;
        height: 30px;
        position: relative;
        bottom: 20px;
        background: none;
        border: 0;
        color: powderblue;
        text-align: center;
        outline: none;
      }
    }
    div:last-child{
      width: 60%;
      height: 140px;
      .login-btn{
        width: 80%;
        height: 50px;
        line-height: 50px;
        margin: 10px auto;
        background: rgba($color: #ce9019, $alpha: 0.7);
        border-top-left-radius: 15px;
        border-bottom-right-radius: 15px;
      }
      .login-btn:hover{
        cursor: pointer;
        color: whitesmoke;
        background: rgba($color: #ce9019, $alpha: 0.9);
      }
      .login-btn:active{
        background: rgba($color: #a56b00, $alpha: 1);
      }
    }
  }
}
</style>
