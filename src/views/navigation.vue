<!-- 导航栏组件 -->
<template>
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <el-menu :default-openeds="['1', '3']" :router="true" :disabled="true">
      <el-submenu index="1">
        <template slot="title"><i class="el-icon-setting"></i>英克</template>
        <el-menu-item-group>
          <el-menu-item index="/addInckAuthInfo">人员管理</el-menu-item>
          <el-menu-item index="/addInckShopInfo">门店创建</el-menu-item>
          <el-menu-item index="/addPensonnelExcelInfo">表格创建</el-menu-item>
          <el-menu-item index="/addInckPensonnelInfo">人员同步</el-menu-item>
          <el-menu-item index="/mac">网卡请求</el-menu-item>
          <el-menu-item index="/usemac">网卡使用</el-menu-item>
          <el-menu-item index="/pengingOrder">挂单查询</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
    <template>
      <p
        style="display: flex; align-items: center; justify-content: center; font-size: 12px; opacity: 0.6; margin: 20px 0;">
        © 2022
        <el-link type="primary" href="https://github.com/CH00SE1/" target="_blank" style="margin: 0 5px;">CHOOSE 1
        </el-link>
        版权
      </p>
    </template>
  </el-aside>
</template>

<script>

export default {
  name: 'navigation'
}
</script>
