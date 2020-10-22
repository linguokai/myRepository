<template>
  <div>
    <div style="display:flex;">
      <div class="admin">
        <div>
          <img :src="user.userPic" alt="">
          <div>
            <font>{{user.userName}}</font>
            <font @click="logout">退出登录</font>
          </div>
        </div>
        <div>上次登录时间: {{user.login.time}}</div>
        <div>上次登录地点: {{user.login.place}}</div>
        <div>上次登录的ip: {{user.login.ip}}</div>
      </div>

      <div class="recent-note">
        <div class="note-item">
          <div style="background: #005bd1;">
            <img src="../assets/icon/users.png" alt="">
          </div>
          <div class="note-num1">{{totalDigit.userNum}}<p>用户总量</p></div>
        </div>
        <div class="note-item">
          <div style="background: #be0000;">
            <img src="../assets/icon/view.png" alt="">
          </div>
          <div class="note-num2">{{totalDigit.clickNum}}<p>访问点击累计</p></div>
        </div>
        <div class="note-item">
          <div style="background: #008d3f;">
            <img src="../assets/icon/resource.png" alt="">
          </div>
          <div class="note-num3">{{totalDigit.resourceNum}}<p>资源总量</p></div>
        </div>
        <div class="note-item">
          <div style="background: #c0c400;">
            <img src="../assets/icon/demand.png" alt="">
          </div>
          <div class="note-num4">{{totalDigit.demandNum}}<p>需求总量</p></div>
        </div>
      </div>
    </div>

    <div style="display:flex;margin: 30px 0;">
      <div class="symstem-envir">
        <div>系统环境</div>
        <div>当前时间：{{realtime}}</div>
        <div>当前系统：window 10 64位</div>
        <div>系统语言：ThinkPhp6 + Vue</div>
        <div>当前ip地址：{{user.ip}}</div>
      </div>

      <div class="journal-data" v-loading="loading">
        <div>操作日志 <img src="../assets/icon/clear.png" alt="" @click="delJournal"></div>
        <el-table :data="journal">
          <el-table-column prop="time" label="时间" width="180"></el-table-column>
          <el-table-column prop="operation" label="记录"></el-table-column>
        </el-table>
        <el-pagination layout="prev, pager, next" :total="journalTotal" :page-size="4"
          :current-page="journalCurrentPage" @current-change="journalcurrentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import req from '@/api/index.js'
export default {
  data () {
    return {
      realtime: '',
      loading: true,
      user: {
        userId: '', userName: '', userPic: '../assets/icon/my.png', ip: '', login: {ip: '', time: '', place: ''}
      },
      totalDigit: {userNum: '', clickNum: '', resourceNum: '', demandNum: ''},
      journalTotal: 0, // 日志总页数
      journalCurrentPage: 1, // 日志当前页
      journal: [{
        time: '',
        operation: ''
      }] // 日志操作记录
    }
  },
  mounted () {
    this.getStateDate()
    this.getTotalDigit()
    this.getOperation()
    setInterval(() => {
      this.realtime = new Date().toLocaleString()
    }, 1000)
  },
  methods: {
    logout () {
      sessionStorage.clear()
      req('addOperation', {
        user: this.user.userId,
        operation: '退出系统登录'
      }).then(res => {
        console.log(res)
      })
      this.$router.push({path: '/login'})
    },
    journalcurrentChange (e) {
      this.journalCurrentPage = e
      this.getOperation()
    },
    getStateDate () { // 获取管理员登陆后的个人信息
      this.user = JSON.parse(sessionStorage.getItem('user'))
      console.log(this.user)
    },
    getTotalDigit () { // 获取首页统计数字
      req('getTotalDigit').then(res => {
        this.totalDigit = res
        console.log(res)
      })
    },
    getOperation () { // 获取首页日志数据
      req('getOperation', {
        userId: this.user.userId,
        currentPage: this.journalCurrentPage
      }).then(res => {
        this.journalTotal = res.totalPage
        this.journal = res.data
        console.log(res)
        this.loading = false
      })
    },
    delJournal () { // 清空日志文件
      this.$confirm('此操作将永久删除日志, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        req('delOperation', {
          userId: this.user.userId
        }).then((res) => {
          if (res.code === '11') {
            this.$message({type: 'success', message: res.msg})
            req('addOperation', {
              user: this.user.userId,
              operation: '清空操作日志内容'
            }).then(() => {
              this.journalCurrentPage = 1
              this.getOperation()
            })
          } else {
            this.$message({type: 'error', message: res.msg})
          }
          console.log(res)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
div{
  text-align: center;
}
.admin{
  width: 500px;
  min-width: 400px;
  height: 280px;
  border-radius: 10px;
  background: white;
  display: flex;
  flex-direction: column;
  img{
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin: 20px 0;
    border: 1px solid gainsboro;
  }
  div{
    width: 100%;
    color: gray;
    margin: 5px 20px;
    text-align: left;
  }
  div:first-child{
    width: 80%;
    margin: 0 auto;
    display: flex;
    border-bottom: 1px solid gainsboro;
    div{
      padding: 40px 20px;
      font:first-child{
        color: black;
        font-size: 30px;
        margin-bottom: 10px;
        display: block;
      }
      font:last-child{
        font-size: 15px;
        color: rgb(165, 165, 165);
        display: block;
        cursor: pointer;
      }
      font:last-child:hover{
        font-weight: 600;
        color: rgb(0, 140, 255);
      }
    }
  }
  div:nth-child(2){
    padding-top: 10px;
  }
}
.recent-note{
  width: 800px;
  height: 280px;
  min-width: 700px;
  background: white;
  margin-left: 30px;
  border-radius: 10px;
  display: flex;
  flex-wrap: wrap;
  .note-item{
    width: 300px;
    height: 80px;
    margin: auto;
    display: flex;
    border: 1px solid gainsboro;
    div:first-child{
      width: 80px;
      height: 80px;
      img{
        position: relative;
        top: 25px;
        width: 30px;
        height: 30px;
      }
    }
    div:nth-child(2){
      flex: 1;
      font-size: 30px;
      font-weight: 600;
      position: relative;
      top: 10px;
      p{
        margin: 0;
        color: gray;
        font-size: 10px;
      }
    }
    .note-num1{color: #005bd1;}
    .note-num2{color: #be0000;}
    .note-num3{color: #008d3f;}
    .note-num4{color: #c0c400;}
  }
}
.journal-data{
  width: 800px;
  position: relative;
  div{
    margin-bottom: 10px;
    img{
      width: 20px;
      height: 20px;
      position: relative;
      left: 20px;
      top: 3px;
      cursor: pointer;
    }
    img:hover{
      opacity: 0.5;
    }
  }
  // .reset-journal{
  //   width: 80px;
  //   height: 25px;
  //   line-height: 25px;
  //   font-size: 12px;
  //   border: 1px solid #c9c7c7;
  //   position: absolute;
  //   right: 20px;
  //   border-radius: 5px;
  //   top: -5px;
  //   color: #b3b3b3;
  //   cursor: pointer;
  // }
  // .reset-journal:hover{
  //   background: white;
  // }
  .el-table{
    border-radius: 10px;
  }
}
.symstem-envir{
  width: 500px;
  min-width: 400px;
  height: 280px;
  border-radius: 10px;
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 30px;
  div{
    width: 80%;
    height: 40px;
    line-height: 40px;
    margin: 5px 30px;
    color: gray;
    text-align: left;
  }
  div:first-child{
    text-align: center;
  }
}
</style>
