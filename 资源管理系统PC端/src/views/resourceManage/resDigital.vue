<template>
  <div>
    <div class="title">统计信息</div>
    <div class="flex">
      <div class="table">
        <div>实时下载记录</div>
        <el-table :data="tableData" border>
          <el-table-column prop="time" label="时间" width="180"></el-table-column>
          <el-table-column prop="userName" label="用户" width="180"></el-table-column>
          <el-table-column prop="title" label="资源名称"></el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" @current-change="changeCurrentPage"
          :page-size="pageNum" :total="totalNum"></el-pagination>
      </div>
      <div class="infor">
        <chart1 :digitalData="digitalData1" :xAxisText="xAxisText1" class="chart1"
          :title="'系统近7天全网资源下载量'" :width="500" :height="350">
        </chart1>
        <div class="top-10">下载量排名前十资源</div>
        <el-table :data="tableData2" border>
          <el-table-column prop="resourceId" label="资源ID" width="180"></el-table-column>
          <el-table-column prop="resourceName" label="资源名称" width="180"></el-table-column>
          <el-table-column prop="download" label="下载次数"></el-table-column>
        </el-table>
      </div>
    </div>

    <!-- <chart2 :leftText="leftText" :digitalData="digitalData2" :title="'test'" :width="500" :height="500"></chart2> -->
  </div>
</template>

<script>
import chart1 from '@/components/chart1.vue'
import req from '@/api/resourceManage.js'
export default {
  components: {
    chart1
  },
  data () {
    return {
      tableData: [],
      currentPage: 1,
      pageNum: 10,
      totalNum: 0,
      tableData2: [],
      digitalData1: [],
      xAxisText1: ['07-18', '07-19', '07-20', '07-21', '07-22', '07-23', '07-24']
    }
  },
  mounted () {
    this.getdownloadDigital()
  },
  methods: {
    getdownloadDigital () {
      req('downloadDigital', {
        currentPage: this.currentPage
      }).then(res => {
        if (res.code === '11') {
          this.tableData = res.data
          this.totalNum = res.totalNum
        } else {
          this.$message.error('初始化统计信息错误')
          this.tableData = []
        }
      })
    },
    changeCurrentPage (e) {
      this.currentPage = e
      this.getdownloadDigital()
    }
  }
}
</script>

<style lang="scss" scoped>
div{
  color: gray;
}
.title{
  width: 100%;
  height: 40px;
  font-size: 18px;
  color: gray;
  text-align: left;
  border-bottom: 2px solid gainsboro;
}
.flex{
  display: flex;
  justify-content: center;
  .table{
    width: 50%;
    max-width: 600px;
    text-align: center;
    div:first-child{
      width: 100%;
      margin: 10px;
      text-align: center;
    }
    .el-table{
      width: 100%;
    }
  }
  .infor{
    width: 50%;
    margin: 10px;
    .chart1{
      margin: 30px;
    }
    .top-10{
      margin: 10px auto;
    }
  }
}
</style>
