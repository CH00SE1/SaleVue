<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']" :router="true" :disabled="true">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>销售查询</template>
          <el-menu-item-group>
            <template slot="title">时间类型</template>
            <el-menu-item index="/day">当天</el-menu-item>
            <el-menu-item index="/yesterday">昨天</el-menu-item>
            <el-menu-item index="/month">当月</el-menu-item>
            <el-menu-item index="/lastmonth">上月</el-menu-item>
            <el-menu-item index="/year">当年</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
      <span>{{ title }}</span>
        <!-- <el-dropdown>
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>查看</el-dropdown-item>
            <el-dropdown-item>新增</el-dropdown-item>
            <el-dropdown-item>删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <span>刘少雄</span> -->
      </el-header>
      <el-main>
        <template>
            <el-table :data="saleList" border style="width: 150%" :row-style="{height: '0'}" :cell-style="{padding: '3px'}" :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :default-sort="{prop: 'sum_fl_money', order: 'descending'}">
            <el-table-column prop="name" label="姓名" width="140">
            </el-table-column>
            <el-table-column prop="sum_money" label="总销售" width="120">
            </el-table-column>
            <el-table-column prop="sum_fl_money" label="毛利"> </el-table-column>
            <el-table-column prop="fl.黄金单品" label="黄金单品"> </el-table-column>
            <el-table-column prop="fl.A" label="A类"> </el-table-column>
            <el-table-column prop="fl.B" label="B类"> </el-table-column>
            <el-table-column prop="fl.C" label="C类"> </el-table-column>
            <el-table-column prop="fl.D" label="D类"> </el-table-column>
            <el-table-column prop="fl.E" label="E类"> </el-table-column>
        </el-table>
        </template>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.el-header {
  background-color: rgb(253, 252, 252);
  color: #333;
  line-height: 60px;
}
.el-aside {
  color: #333;
}
.el-table--border {
    padding-left: 0px;
    text-align: center;
}
</style>

<script>
import {listMonthSale} from '../api/index'

export default {
  data () {
    return {
      saleList: [],
      title: null
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      listMonthSale().then((_result) => {
        this.saleList = _result.data.data.sales_info_details
        this.title = _result.data.data.title
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '后端接口连接异常',
          type: 'error'
        })
      })
    }
  }
}
</script>
