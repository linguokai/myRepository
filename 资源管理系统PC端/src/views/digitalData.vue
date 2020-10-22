<template>
  <div>
    <div class="title">统计信息</div>
    <div class="chart">
      <chart1 :digitalData="digitalData1" :xAxisText="xAxisText1"
        :title="'系统近七天访问人数'" :width="500" :height="350">
      </chart1>
      <chart2 :leftText="leftText" :digitalData="digitalData2"
        :title="'用户分布最多前五城市'" :width="500" :height="400">
      </chart2>
      <chart3 :text="centerText" :digitalData="digitalData3"
        :title="'各分类资源占比'" :width="500" :height="400">
      </chart3>
    </div>

    <!-- <chart2 :leftText="leftText" :digitalData="digitalData2" :title="'test'" :width="500" :height="500"></chart2> -->
  </div>
</template>

<script>
import chart1 from '@/components/chart1.vue'
import chart2 from '@/components/chart2.vue'
import chart3 from '@/components/chart3.vue'

export default {
  components: {
    chart1,
    chart2,
    chart3
  },
  mounted () {
  },
  data () {
    return {
      digitalData1: [1, 2, 3, 4, 10, 5, 1],
      xAxisText1: ['07-18', '07-19', '07-20', '07-21', '07-22', '07-23', '07-24'],
      leftText: ['广州市', '佛山市', '深圳市', '上海市', '北京市'],
      digitalData2: [
        {value: 200, name: '广州市'},
        {value: 100, name: '佛山市'},
        {value: 100, name: '深圳市'},
        {value: 50, name: '上海市'},
        {value: 50, name: '北京市'}
      ],
      centerText: ['广州市', '佛山市', '深圳市', '上海市', '北京市'],
      digitalData3: [
        {value: 200, name: '广州市'},
        {value: 100, name: '佛山市'},
        {value: 100, name: '深圳市'},
        {value: 50, name: '上海市'},
        {value: 50, name: '北京市'}
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.title{
  width: 100%;
  height: 40px;
  font-size: 18px;
  color: gray;
  text-align: left;
  border-bottom: 2px solid gainsboro;
}
.chart{
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  div{
    margin: 30px 30px;
  }
}
</style>
