<template>
  <div>
    <div class="header">
      <img v-if="isCollapse" src="../assets/icon/shrink0.png" @click="shrinkAside">
      <img v-else src="../assets/icon/shrink1.png" @click="shrinkAside">
      后台管理系统
    </div>
    <el-container>
      <el-menu default-active="1" class="el-menu-vertical-demo" :collapse="isCollapse"
          text-color="#ffffff" background-color="#242f41" :unique-opened="true" :style="!isCollapse ? 'width:200px;' : ''">
          <router-link :to="{path: '/'}">
            <el-menu-item index="1">
            <i class="el-icon-menu"></i>
            <span slot="title">系 统 首 页</span>
            </el-menu-item>
          </router-link>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-s-order"></i>
              <span slot="title">资 源 管 理</span>
            </template>
            <el-menu-item-group>
              <router-link :to="{path: '/manage'}"><el-menu-item index="2-1"><i class="el-icon-s-tools"></i>资源管理</el-menu-item></router-link>
              <router-link :to="{path: '/addResource'}"><el-menu-item index="2-2"><i class="el-icon-upload"></i>资源上传</el-menu-item></router-link>
              <router-link :to="{path: '/resDigital'}"><el-menu-item index="2-3"><i class="el-icon-s-order"></i>资源数据</el-menu-item></router-link>
            </el-menu-item-group>
          </el-submenu>
          <router-link :to="{path: '/sort'}">
            <el-menu-item index="3">
              <i class="el-icon-tickets"></i>
              <span slot="title">分 类 管 理</span>
            </el-menu-item>
          </router-link>
          <router-link :to="{path: '/advert'}">
            <el-menu-item index="4">
              <i class="el-icon-s-shop"></i>
              <span slot="title">首 页 轮 播 图</span>
            </el-menu-item>
          </router-link>
          <router-link :to="{path: '/userInfor'}">
            <el-menu-item index="5">
              <i class="el-icon-user-solid"></i>
              <span slot="title">用 户 信 息</span>
            </el-menu-item>
          </router-link>
          <router-link :to="{path: '/digital'}">
            <el-menu-item index="6">
              <i class="el-icon-s-data"></i>
              <span slot="title">统 计 资 料</span>
            </el-menu-item>
          </router-link>
          <el-menu-item index="7" @click="toPageWatch">
            <i class="el-icon-s-platform"></i>
            <span slot="title">监 控 大 厅</span>
          </el-menu-item>
          <router-link :to="{path: '/report'}">
            <el-menu-item index="8">
              <i class="el-icon-headset"></i>
              <span slot="title">举 报 专 栏</span>
            </el-menu-item>
          </router-link>
        </el-menu>

      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    shrinkAside () {
      this.isCollapse = !this.isCollapse
    },
    toPageWatch () {
      window.open('/#/watchWin')
    }
  }
}
</script>

<style lang="scss" scoped>
.header{
  width: 100%;
  height: 75px;
  line-height: 75px;
  text-align: left;
  font-size: 20px;
  color: white;
  background-color: #50467e;
  img{
    width: 30px;
    position: relative;
    top: 8px;
    margin-left: 50px;
    margin-right: 20px;
    cursor: pointer;
  }
}
.el-container{
  background: whitesmoke;
}
.el-menu{
  height:800px;
}
.el-main{
  height:800px;
  background: whitesmoke;
}
</style>
