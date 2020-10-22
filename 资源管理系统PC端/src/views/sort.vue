<template>
  <div>
    <div class="title">资源分类<el-button class="add-sort" @click="changedialogVisible">✎ 新增分类</el-button></div>
    <div class="flex">
      <div class="item-left">
        <el-menu @select="selectMenu">
          <el-menu-item v-for="(item, index) in sort" :key="index" :index="item.sortId">
            {{item.sortName}}
          </el-menu-item>
        </el-menu>
      </div>
      <div class="item-infor">
        <div class="sort-name">资源详情</div>
        <div class="sort-detail" v-loading="loading">
          <el-form label-width="80px">
            <el-form-item label="分类 ID">
              <el-input v-model="detailForm.sortId" size="small" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="分类名称">
              <el-input v-model="detailForm.sortName" size="small"></el-input>
            </el-form-item>
            <el-form-item label="分类排名">
              <el-input v-model="detailForm.position" size="small"></el-input>
            </el-form-item>
            <el-form-item label="分类备注">
              <el-input class="textarea" type="textarea" v-model="detailForm.remark"></el-input>
            </el-form-item>
            <el-form-item label="展示">
              <el-switch v-model="detailForm.display"></el-switch>
            </el-form-item>
          </el-form>
          <div class="sort-detail-btn">
            <el-button type="primary" @click="updateSort">确 认</el-button>
            <el-button type="danger" @click="delSort">删 除</el-button>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="新增资源" :visible.sync="dialogVisible" width="500px">
      <el-form :model="dialogForm" label-width="80px" :rules="dialogrules" ref="form1">
        <el-form-item label="分类 ID" prop="sortId">
          <el-input v-model="dialogForm.sortId" size="small"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="sortName">
          <el-input v-model="dialogForm.sortName" size="small"></el-input>
        </el-form-item>
        <el-form-item label="分类排名" prop="position">
          <el-input v-model="dialogForm.position" size="small"></el-input>
        </el-form-item>
        <el-form-item label="分类备注">
          <el-input class="textarea" type="textarea" v-model="dialogForm.remark"></el-input>
        </el-form-item>
        <el-form-item label="展示">
          <el-switch v-model="dialogForm.display"></el-switch>
        </el-form-item>
        <el-button style="position:relative;left:380px;" type="primary" @click="addSort">确 认</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import req from '@/api/sort.js'
export default {
  data () {
    var checkPosition = (rule, value, callback) => {
      setTimeout(() => {
        var numReg = /^[0-9]*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(value)) {
          callback(new Error('请输入数字值'))
        } else if (value === '') {
          callback(new Error('请输入位置排名'))
        } else {
          callback()
        }
      }, 100)
    }
    return {
      loading: true,
      sort: [], // 分类集合
      detailForm: {},
      dialogForm: {sortId: '', sortName: '', position: '', remark: '', display: false},
      dialogVisible: false, // 弹窗对话是否可见
      dialogrules: {
        sortId: [{ required: true, message: '请输入分类id', trigger: 'blur' }],
        sortName: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
        position: [{ validator: checkPosition, trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.getSort()
  },
  methods: {
    getSort () { // 初始化分类
      req('getSort').then(res => {
        console.log(res)
        this.sort = res
        setTimeout(() => {
          this.selectMenu(this.sort[0].sortId)
        }, 1000)
      })
    },
    selectMenu (sortId) {
      for (var i = 0; i < this.sort.length; i++) {
        if (this.sort[i]['sortId'] === sortId) {
          this.detailForm = this.sort[i]
          if (this.sort[i].display) {
            this.detailForm.display = true
          } else {
            this.detailForm.display = false
          }
        }
      }
      this.loading = false
    },
    delSort () {
      let operation = '删除了分类“ ' + this.detailForm.sortName + ' ”和其分类下的所有资源（不可逆操作）'
      this.$confirm('此操作将永久删除该分类，并且该分类下的资源也都会被释放, 是否继续?', '警告提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$confirm('该操作不可逆，确定要删除所有资源?', '危险提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          req('delSort', {
            sortId: this.detailForm.sortId
          }).then(res => {
            if (res.code === '11') {
              this.$message({type: 'success', message: res.msg})
              req('addOperation', {
                user: JSON.parse(sessionStorage.getItem('user')).userId,
                operation: operation
              }).then()
              this.getSort()
            } else { this.$message.error(res.msg) }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      })
    },
    changedialogVisible () {
      this.dialogVisible = true
    },
    updateSort () { // 更新分类详情
      console.log(this.detailForm)
      req('updateSort', {
        ...this.detailForm
      }).then(res => {
        if (res.code === '11') {
          this.$message({type: 'success', message: res.msg})
        } else { this.$message.error(res.msg) }
        console.log(res)
      }).catch(() => {
        this.$message.error('系统错误，请检查网络连接或者稍后再试')
      })
    },
    addSort () { // 添加分类
      this.$refs.form1.validate((valid) => {
        if (valid) {
          console.log(this.dialogForm)
          req('addSort', {
            ...this.dialogForm
          }).then(res => {
            if (res.code === '11') {
              this.$message({type: 'success', message: res.msg})
              this.dialogVisible = false
              this.dialogForm = {sortId: '', sortName: '', position: '', remark: '', display: false}
              this.getSort()
            } else { this.$message.error(res.msg) }
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button{
  width: 80px;
  height: 35px;
  line-height: 0;
}
.title{
  width: 100%;
  height: 40px;
  font-size: 18px;
  color: gray;
  text-align: left;
  border-bottom: 2px solid gainsboro;
  position: relative;
  .add-sort{
    position: absolute;
    right: 0;
    top: -5px;
    width: 120px;
    height: 35px;
  }
}
.flex{
  display: flex;
  position: relative;
  left: 30px;
  top: 30px;
  .item-left{
    width: 500px;
    height: 500px;
    background: white;
    border-radius: 10px;
    overflow: auto;
    .el-menu-item{
      height: 40px;
      line-height: 40px;
    }
  }
  .item-infor{
    width: 800px;
    height: 600px;
    // background: chartreuse;
    margin-left: 40px;
    text-align: center;
    .sort-detail{
      text-align: left;
      .el-input{
        width: 200px;
      }
      .textarea{
        width: 60%;
      }
    }
    .sort-detail-btn{
      margin-top: 30px;
    }
  }
}

</style>
