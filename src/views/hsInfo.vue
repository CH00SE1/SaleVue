<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-input v-model="queryParams.title" placeholder="请输入标题"></el-input>
      <el-button @click="handleQuery()">搜索</el-button>
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
      <span>{{ queryParams.title }}信息展示</span>
      </el-header>
      <el-main>
        <template>
            <el-table :data="hsInfoList" border style="width: 100%" :default-sort="{prop: 'sum_fl_money', order: 'descending'}">
            <el-table-column prop="id" label="序号" width="140"></el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="120"></el-table-column>
            <el-table-column prop="title" label="标题"> </el-table-column>
            <el-table-column prop="url" label="在线播放地址"> </el-table-column>
            <el-table-column prop="m3u8Url" label="视频下载地址"> </el-table-column>
            <el-table-column prop="classId" label="分类ID"> </el-table-column>
            <el-table-column prop="platform" label="平台"> </el-table-column>
            <el-table-column prop="page" label="页码"> </el-table-column>
            <el-table-column prop="location" label="位置"> </el-table-column>
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
import {listHsInfo} from '../api/index'

export default {
  data () {
    return {
      hsInfoList: [],
      // 查询参数
      queryParams: {
        title: '秘书'
      }
    }
  },
  watch () {
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      listHsInfo(this.queryParams).then((_result) => {
        this.hsInfoList = _result.data.data.rows
        console.log(_result.data.data.rows)
      }).catch((_err) => {
        alert('后台数据获取异常')
      })
    }
  },
  handleQuery () {
    this.getList()
  }
}
</script>
