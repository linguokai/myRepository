<template>
  <div>
    <div class="top">
      <!-- // 顶部条件查询表单 -->
      <el-form ref="searchForm" v-model="searchForm" label-width="80px">
        <el-form-item label="用户名" size="medium">
          <el-input placeholder="请输入用户名" v-model="searchForm.userName" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号" size="medium">
          <el-input placeholder="请输入用户手机号" v-model="searchForm.userPhone" clearable></el-input>
        </el-form-item>
        <el-form-item label="性别" size="medium">
          <el-select v-model="searchForm.gender" placeholder="请选择">
            <el-option v-for="item in gender" :key="item.value"
              :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <!-- // 顶部按钮功能 -->
      <div class="top-btn">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="resetsearchForm">重置</el-button>
      </div>
    </div>
    <!-- // 表格信息 -->
    <c-table :tableData="tableData" :select="false">
      <el-table-column prop="userPic" label="" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.userPic" class="head-img">
        </template>
      </el-table-column>
      <el-table-column v-for="(item,index) in Tprop" :key="index"
          :prop="item.prop" :label="item.lable" :width="item.width">
      </el-table-column>
      <el-table-column :formatter="formatter" prop="gender" label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.gender == 1" style="color:blue">男</span>
          <span v-else-if="scope.row.gender == 2" style="color:red">女</span>
          <span v-else style="color:gray">无记录</span>
        </template>
      </el-table-column>
      <el-table-column :formatter="formatter2" prop="userStatus" label="用户身份">
        <template slot-scope="scope">
          <span v-if="scope.row.userStatus == 0" style="color:gray">普通用户</span>
          <span v-else-if="scope.row.userStatus == 1" style="color:green">会员用户</span>
          <span v-else-if="scope.row.userStatus == 2" style="color:red">管理员</span>
        </template>
      </el-table-column>
    </c-table>
    <!-- // 分页栏 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="[5, 10, 20, 50]" :page-size="pageNum"
      layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
    </el-pagination>
  </div>
</template>

<script>
import cTable from '@/components/table.vue'
import req from '@/api/userinfor'
export default {
  components: {
    cTable
  },
  data () {
    return {
      searchForm: {userName: '', userPhone: '', gender: ''}, // 搜索表单
      gender: [{label: '男', value: 1}, {label: '女', value: 2}], // 搜索表单中类型下拉框
      Tprop: [
        { prop: 'userName', lable: '用户名', width: '160' },
        { prop: 'userPhone', lable: '手机号', width: '160' },
        { prop: 'personalSignature', lable: '个性签名', width: '' }
      ],
      tableData: [],
      currentPage: 1, // 当前页面
      pageNum: 5, // 每页数量
      totalPage: 0 // 查询总量
    }
  },
  mounted () {
    this.getTableData()
  },
  methods: {
    /* eslint-disable eqeqeq */
    // 格式化
    formatter (row, column, cellValue, index) {
      // console.log(row)
      if (row.gender === '1') {
        row.gender = '男'
      } else if (row.gender === '2') {
        row.gender = '女'
      }

      return cellValue
    },
    formatter2 (row, column, cellValue, index) {
      // console.log(row)
      if (row.userStatus === 0) {
        row.userStatus = '普通用户'
      } else if (row.userStatus === 1) {
        row.userStatus = '会员用户'
      } else if (row.userStatus === 2) {
        row.userStatus = '管理员'
      }

      return cellValue
    },
    // 顶部搜索按钮
    search () {
      // console.log(this.searchForm)
      this.currentPage = 1
      this.pageNum = 5
      this.getTableData()
    },
    // 重置搜索按钮
    resetsearchForm () {
      this.searchForm = {userName: '', userPhone: '', gender: ''}
      this.search()
      // console.log(this.searchForm)
    },
    // 获得表格信息
    getTableData () {
      req('getUser', {
        currentPage: this.currentPage,
        pageNum: this.pageNum,
        ...this.searchForm
      }).then(res => {
        console.log(res)
        if (res.code == '11') {
          this.$message({type: 'success', message: res.msg})
        } else {
          this.$message.error(res.msg)
        }
        this.tableData = res.data
        this.totalPage = res.totalPage
      })
    },
    // 每页数量
    handleSizeChange (e) {
      this.pageNum = e
      this.getTableData()
      console.log(e)
    },
    // 跳转到当前页
    handleCurrentChange (e) {
      this.currentPage = e
      this.getTableData()
      console.log(e)
    }
  }
}
</script>

<style lang="scss" scoped>
.top{
  display: flex;
  min-width: 1200px;
  .el-form{
    display: flex;
    flex-wrap: wrap;
    .el-input{
      width: 200px;
      float: left;
    }
  }
  .top-btn{
    text-align: left;
    margin: 0 0 20px 20px;
  }
}
.el-pagination{
  text-align: right;
  margin-top: 20px;
}
.head-img{
  width: 50px;
  height: 50px;
}

</style>
