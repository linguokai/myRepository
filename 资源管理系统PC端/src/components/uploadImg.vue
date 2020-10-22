<template>
  <div class="addPic" v-loading="loading">
    <img v-if="imgUrl != '' " :src="imgUrl" alt="" class="upload-pic">
    <img v-if="imgUrl != '' " src="../assets/icon/del.png" alt="删除" class="del-pic" @click="delPic">
    <span v-else>+</span>
    <!-- <img src="http://127.0.0.1/ziyuan/runtime/storage/resourceImg/20200715/a84fc68e272fc0a7cf95e5a2f857f21a.png" alt="">
    <span>+</span> -->
    <input type="file" id="image" name="image" @change="handleImg" accept="image/jpeg,image/jpg,image/png">
  </div>
</template>

<script>
export default {
  name: 'uploadImg',
  props: {
    clearImg: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      imgUrl: '',
      loading: false
    }
  },
  mounted () {
  },
  methods: {
    handleImg (e) {
      this.loading = true
      var fileDom = document.querySelector('input[type=file]')
      if (fileDom.files[0].size / 2048 > 2000) {
        // 图片大小 > 2mb
        this.$message.error('图片大小不能超过2mb')
      } else if (fileDom.files[0].type !== 'image/png' &&
        fileDom.files[0].type !== 'image/jpg' &&
        fileDom.files[0].type !== 'image/jpeg') {
        // 只能上传 jpg/jpeg/png图片
        this.$message.error('只能上传 jpg/jpeg/png图片')
      } else {
        let form = new FormData()
        let imgFile = document.getElementById('image').files[0]
        form.append('image', imgFile, imgFile.name) // 通过append向form对象添加数据
        this.$axios({
          method: 'post',
          url: 'http://106.53.245.88/ziyuan/public/index.php/Upload/upload',
          // url: 'http://106.53.245.88/xiehoushufang_hh/public/index.php/Upload/upload',
          data: form,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          this.loading = false
          // console.log(res)
          if (res.data.code === 0) {
            this.$message.error('系统错误，上传失败')
          } else {
            this.$message({message: '上传成功', type: 'success'})
            this.imgUrl = res.data.replace('\\', '/')
            // console.log(this.imgUrl)
            this.$emit('imgUrl', this.imgUrl)
          }
        }).catch((res) => {
          this.$message({message: '上传失败，请检查网络是否流畅', type: 'error'})
          console.log(res)
        })
      }
    },
    delPic () {
      this.imgUrl = ''
      this.$emit('imgUrl', this.imgUrl)
    }
  },
  watch: {
    clearImg (newVal, oldVal) {
      console.log(newVal, oldVal)
      this.imgUrl = ''
    }
  }
}
</script>

<style scoped>
.addPic{
  width: 150px;
  height: 150px;
  background: white;
  border: 1px dashed gray;
  color: gray;
  position: relative;
}
.addPic:hover{
  border: 2px dashed rgb(89, 114, 255);
}
input{
  width: 150px;
  height: 150px;
  opacity: 0;
  z-index: 99;
}
span{
  display: block;
  position: absolute;
  font-size: 30px;
  top: 50px;
  left: 65px;
}
.upload-pic{
  width: 130px;
  height: 130px;
  position: absolute;
  right: 10px;
  bottom: 10px;
}
.del-pic{
  width: 25px;
  height: 25px;
  position: absolute;
  right: -30px;
  cursor: pointer;
}
</style>
