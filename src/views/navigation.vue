<!-- 导航栏组件 -->
<template>
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-openeds="['1', '3']" :router="true" :disabled="true">
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-setting"></i>英克</template>
        <el-menu-item-group>
          <el-menu-item index="/addInckShopInfo">门店创建</el-menu-item>
          <el-menu-item index="/addInckPensonnelInfo">人员创建</el-menu-item>
          <el-menu-item index="/mac">网卡请求</el-menu-item>
          <el-menu-item index="/usemac">网卡使用</el-menu-item>
          <el-menu-item index="/pengingOrder">挂单查询</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>

export default {
  name: 'navigation'
}
</script>
