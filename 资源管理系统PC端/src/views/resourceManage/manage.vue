<template>
  <div>
    <!-- // 顶部条件查询表单 -->
    <el-form ref="searchForm" v-model="searchForm" label-width="80px">
      <el-form-item label="资源 ID" size="medium">
        <el-input placeholder="请输入资源id" v-model="searchForm.resourceId" clearable></el-input>
      </el-form-item>
      <el-form-item label="资源名" size="medium">
        <el-input placeholder="请输入资源名称" v-model="searchForm.title" clearable></el-input>
      </el-form-item>
      <el-form-item label="进度" size="medium">
        <el-select v-model="searchForm.verification" placeholder="请选择">
          <el-option v-for="item in verifi" :key="item.value"
            :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间" size="medium">
        <el-date-picker v-model="searchForm.time" type="datetimerange" range-separator="至"
        start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- // 顶部按钮功能 -->
    <div class="top-btn">
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="resetsearchForm">重置</el-button>
      <el-button type="danger" @click="deleteVisible = true">删除</el-button>
    </div>
    <!-- // 表格信息 -->
    <c-table :tableData="tableData" :select="true" @selection="selection">
      <el-table-column prop="resourcePic" label="" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.resourcePic" style="width:100px;">
        </template>
      </el-table-column>
      <el-table-column v-for="(item,index) in Tprop" :key="index" show-overflow-tooltip
          :prop="item.prop" :label="item.lable" :width="item.width">
      </el-table-column>
      <el-table-column :formatter="formatter" prop="verification" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.verification == '1'" style="color:blue">已审核</span>
          <span v-else style="color:red">未审核</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="180">
        <template slot-scope="scope">
          <el-button v-if="scope.row.verification == '0'" type="success" @click="shenhe(scope.row,1)">通过</el-button>
          <el-button v-if="scope.row.verification == '1'" type="warning" @click="shenhe(scope.row,0)">撤回</el-button>
          <el-popconfirm  title="此操作不可逆,确定删除?" @onConfirm="delete1(scope.row)">
            <el-button type="danger" icon="el-icon-delete" slot="reference"></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </c-table>
    <!-- // 分页栏 -->
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page="currentPage" :page-sizes="[5, 10, 20, 50]" :page-size="pageNum"
      layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
    </el-pagination>

    <!-- 是否确定删除? -->
    <el-dialog  title="提示" :visible.sync="deleteVisible" width="30%" center>
      <span>是否确定删除</span>
      <span slot="footer" class="dialog-footer">
      <el-button @click="deleteVisible = false">取 消</el-button>
      <el-button type="primary" @click="delete2">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import cTable from '@/components/table.vue'
import req from '@/api/resourceManage.js'
export default {
  components: {
    cTable
  },
  data () {
    return {
      loginUser: '', // 登录的用户
      searchForm: {resourceId: '', title: '', verification: '', time: ''}, // 搜索表单
      verifi: [{label: '未审核', value: 0}, {label: '已审核', value: 1}], // 搜索表单中类型下拉框
      Tprop: [
        { prop: 'resourceId', lable: 'ID', width: '160' },
        { prop: 'title', lable: '资源名称', width: '' },
        { prop: 'desc', lable: '资源简介', width: '250' },
        { prop: 'time', lable: '时间', width: '' },
        { prop: 'author', lable: '作者', width: '' }
      ],
      tableData: [],
      currentPage: 1, // 当前页面
      pageNum: 5, // 每页数量
      totalPage: 0, // 查询总量
      selectData: [], // 表格选择的数据
      deleteVisible: false
    }
  },
  mounted () {
    this.getTableData()
    this.loginUser = JSON.parse(sessionStorage.getItem('user')).userId
  },
  methods: {
    /* eslint-disable eqeqeq */
    // 格式化
    formatter (row, column, cellValue, index) {
      // console.log(row)
      if (row.verification === '0') {
        row.verification = '未审核'
      } else if (row.verification === '1') {
        row.verification = '已审核'
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
      this.searchForm = {resourceId: '', title: '', verification: '', time: ''}
      this.search()
      // console.log(this.searchForm)
    },
    // 审核资源按钮
    shenhe (resource, verification) {
      req('verification', {
        resourceId: resource.resourceId,
        verification: verification
      }).then(res => {
        if (res.code == '11') {
          // this.$message({type: 'success', message: res.msg})
          this.getTableData()
          let operation = ''
          if (parseInt(verification) == 0) {
            operation = '成功撤回了资源【' + resource.title.substr(0, 20) + '...】'
          } else {
            operation = '审核通过了资源【' + resource.title.substr(0, 20) + '...】'
          }
          req('addOperation', {
            user: this.loginUser,
            operation: operation
          }).then()
        } else {
          this.$message({type: 'error', message: res.msg})
        }
        console.log(res)
      })
    },
    // 删除单个资源的按钮
    delete1 (resource) {
      req('delResource', {
        resourceId: resource.resourceId
      }).then(res => {
        if (res.code == '11') {
          this.$message({type: 'success', message: res.msg})
          this.getTableData()
          req('addOperation', {
            user: this.loginUser,
            operation: '成功删除了资源【' + resource.title.substr(0, 10) + '...】'
          }).then()
        } else {
          this.$message({type: 'error', message: res.msg})
        }
      })
    },
    // 删除选中资源的按钮
    delete2 () {
      let resourceId = ''
      for (var i = 0; i < this.selectData.length; i++) {
        resourceId = resourceId + this.selectData[i].resourceId + ','
      }
      resourceId = resourceId.substr(0, resourceId.length - 1)
      req('delResource', {
        resourceId: resourceId
      }).then(res => {
        if (res.code == '11') {
          this.$message({type: 'success', message: res.msg})
          this.getTableData()
          req('addOperation', {
            user: this.loginUser,
            operation: '批量删除了' + this.selectData.length + '个资源，id为【' + resourceId.substr(0, 40) + '...】'
          }).then()
        } else {
          this.$message({type: 'error', message: res.msg})
        }
        this.deleteVisible = false
      })
    },
    // 获得表格信息
    getTableData () {
      if (this.searchForm.time == null) {
        this.searchForm.time = ''
      }
      console.log(this.searchForm.time)
      if (this.searchForm.time != '') {
        this.searchForm.time[0] = this.$moment(this.searchForm.time[0]).format('YYYY-MM-DD HH:mm:ss')
        this.searchForm.time[1] = this.$moment(this.searchForm.time[1]).format('YYYY-MM-DD HH:mm:ss')
      }
      console.log(this.searchForm)
      req('searchResource', {
        currentPage: this.currentPage,
        pageNum: this.pageNum,
        ...this.searchForm
      }).then((res) => {
        if (res.code == '11') {
          // this.$message({ message: res.msg, type: 'success' })
        } else {
          this.$message({ message: res.msg, type: 'error' })
        }
        this.tableData = res.data
        this.totalPage = res.totalPage
        console.log(res)
      }).catch(() => {
        this.$message({ message: '网络出错，数据中断', type: 'error' })
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
    },
    // 选择的数据
    selection (val) {
      this.selectData = val
    }
  }
}
</script>

<style lang="scss" scoped>
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
.el-pagination{
  text-align: right;
  margin-top: 20px;
}

</style>
