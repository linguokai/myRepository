<template>
  <div>
    <div class="contain">
      <div class="iphone">
        <div class="iphone-title">
          {{resourceForm.title.length > 10 ? resourceForm.title.substr(0, 10) + '...' : resourceForm.title}}
        </div>
        <div class="iphone-img">
          <img v-if="resourceForm.imgUrl==''" src="../../assets/icon/pic0.png" alt="">
          <img v-else :src="resourceForm.imgUrl" alt="">
        </div>
        <div class="iphone-content">
          <div>分类：<span>{{resourceForm.sortName}}</span></div>
          <div>介绍：<br><span>{{resourceForm.desc}}</span></div>
          <div>源点消耗：<span>{{resourceForm.pay}} 源点</span></div>
        </div>
        <div class="phone-bottom">
          <div class="phone-bottom-btn">一键获取资源</div>
          <div class="phone-bottom-view">浏览量 9 评分 5 收藏 0</div>
        </div>
        <hr color="gainsboro" size="5">
      </div>

      <div class="form">
        <el-form ref="form1" :model="resourceForm" label-width="80px" :rules="addrules">
          <el-form-item label="资源名称" prop="title">
            <el-input v-model="resourceForm.title"></el-input>
          </el-form-item>
          <el-form-item label="分类" prop="sort">
            <el-select v-model="resourceForm.sort" placeholder="请选择分类">
              <el-option :label="item.sortName" :value="item.sortId" v-for="(item, index) in sort" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="资源简介" prop="desc">
            <el-input type="textarea" v-model="resourceForm.desc"></el-input>
          </el-form-item>
          <el-form-item label="源点消耗" prop="pay">
            <el-input v-model.number="resourceForm.pay"></el-input>
          </el-form-item>
          <el-form-item label="资源链接" prop="link">
            <el-input v-model="resourceForm.link"></el-input>
          </el-form-item>
          <el-form-item label="验证码">
            <el-input v-model="resourceForm.linkCode" placeholder="可为空"></el-input>
          </el-form-item>
          <el-form-item label="资源主图">
            <up-img @imgUrl="imgUrl"></up-img>
          </el-form-item>
          <el-form-item label="立即上线">
            <el-switch v-model="resourceForm.online"></el-switch>
          </el-form-item>
        </el-form>
        <el-button type="success" @click="addResource">提交</el-button>
        <el-button type="info">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import req from '@/api/resourceManage.js'
import upImg from '@/components/uploadImg.vue'
export default {
  components: {
    upImg
  },
  data () {
    var checkPay = (rule, value, callback) => { // 源点消耗的格式判断
      setTimeout(() => {
        if (!Number.isInteger(value) && value !== '') {
          callback(new Error('请输入数字值'))
        } else {
          callback()
        }
      }, 100)
    }
    return {
      sort: [], // 资源分类数据
      addrules: { // 添加资源填写规则
        title: [
          { required: true, message: '请输入资源标题', trigger: 'blur' },
          { min: 2, message: '长度至少 2 个字符以上', trigger: 'blur' }
        ],
        sort: [{ required: true, message: '请输入资源分类', trigger: 'change' }],
        desc: [
          { required: true, message: '请输入资源详情', trigger: 'blur' },
          { min: 10, message: '长度至少 10 个字符以上', trigger: 'blur' }
        ],
        pay: [{ validator: checkPay, trigger: 'blur' }],
        link: [{ required: true, message: '请输入资源分类', trigger: 'blur' }]
      },
      resourceForm: {title: '', sort: '', desc: '', pay: 0, link: '', linkCode: '', imgUrl: '', sortName: '', online: false}
    }
  },
  mounted () {
    this.getSort()
  },
  methods: {
    getSort () { // 初始化分类
      req('getSort').then(res => {
        // console.log(res)
        this.sort = res
      })
    },
    imgUrl (imgUrl) { // 图片处理
      this.resourceForm.imgUrl = imgUrl
    },
    addResource () { // 提交资源添加
      if (this.resourceForm.pay === '') {
        this.resourceForm.pay = 0
      }
      this.$refs.form1.validate((valid) => {
        if (valid) {
          if (this.resourceForm.imgUrl.trim() === '') {
            this.$message.error('请添加一张图片')
          } else {
            // console.log(this.resourceForm, JSON.parse(sessionStorage.getItem('user')).userId)
            req('addResource', {
              userId: JSON.parse(sessionStorage.getItem('user')).userId,
              resource: this.resourceForm
            }).then(res => {
              if (res.code === '11') {
                req('operation', {
                  user: JSON.parse(sessionStorage.getItem('user')).userId,
                  operation: '新增资源数据【' + this.resourceForm.title.substr(0, 20) + '...】'
                })
                const h = this.$createElement
                this.$notify({ title: '添加成功', message: h('i', {style: 'color: teal'}, res.msg) })
                this.resourceForm = {title: '', sort: '', desc: '', pay: 0, link: '', linkCode: '', imgUrl: '', sortName: '', online: false}
              } else {
                this.$message.error(res.msg)
              }
              console.log(res)
            })
          }
        } else {
          return false
        }
      })
    }
  },
  watch: {
    resourceForm: { // 监听表单的值，从而赋值到手机模型里分类的值
      handler (newVal) {
        if (newVal.sort !== '') {
          for (var i = 0; i < this.sort.length; i++) {
            if (newVal.sort === this.sort[i]['sortId']) {
              newVal.sortName = this.sort[i]['sortName']
            }
          }
        } else {
          newVal.sortName = ''
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.contain{
  display: flex;
  .iphone{
    width: 400px;
    height: 650px;
    min-width: 400px;
    background: url('../../assets/iphone.png') no-repeat;
    background-size: 90%;
    background-position-y: center;
    text-align: center;
    .iphone-title{
      width: 90%;
      position: relative;
      top: 55px;
    }
    .iphone-img{
      width: 90%;
      position: relative;
      top: 85px;
      img{
        width: 150px;
      }
    }
    .iphone-content{
      text-align: left;
      position: relative;
      top: 100px;
      left: 50px;
      color: gray;
      font-size: 15px;
      div{
        width: 68%;
        margin: 10px 0;
        word-break: break-all;
        span{
          font-size: 13px;
        }
      }
      div:nth-child(2){
        span{
          display: block;
          text-indent: 20px;
        }
      }
    }
    .phone-bottom{
      width: 70%;
      position: relative;
      top: 120px;
      left: 50px;
      color: rgb(167, 164, 164);
      display: flex;
      .phone-bottom-btn{
        width: 80px;
        height: 20px;
        line-height: 20px;
        color: #1ae208;
        border-radius: 5px;
        border: 1px solid #14b605;
        font-size: 10px;
      }
      .phone-bottom-view{
        font-size: 12px;
        position: absolute;
        right: 20px;
      }
    }
    hr{
      width: 70%;
      position: relative;
      top: 130px;
      left: -18px;
    }
  }
  .form{
    margin-right: 40px;
    min-width: 500px;
  }
}
</style>
