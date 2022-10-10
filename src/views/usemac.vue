<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <div id="search-mac">
      <el-input placeholder="请输入网卡mac" @keyup.enter.native="handleQuery" v-model="queryParams.mac">
      </el-input>
    </div>
    <div id="search-name">
      <el-input placeholder="请输入最后使用人姓名" @keyup.enter.native="handleQuery" v-model="queryParams.lastemployeename">
      </el-input>
    </div>
    <div id="search-name2">
      <el-input placeholder="请输入请求人姓名" @keyup.enter.native="handleQuery" v-model="queryParams.reqemployeename">
      </el-input>
    </div>
    <div id="search">
      <el-button type="primary" icon="el-icon-search" v-on:click="handleQuery">查询</el-button>
    </div>
    <div id="reset">
      <el-button icon="el-icon-refresh" v-on:click="resetQuery">重置</el-button>
    </div>
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']" :router="true" :disabled="true">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>英克操作</template>
          <el-menu-item-group>
            <el-menu-item index="/mac">请求表操作</el-menu-item>
            <el-menu-item index="/usemac">使用表操作</el-menu-item>
            <el-menu-item index="/pengingOrder">挂单管理</el-menu-item>
            <el-menu-item index="/addInckInfo">门店-人员创建</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
        <div id="mybreadcrunb">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/mac' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>使用管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <span>{{ title }}</span>
      </el-header>
      <el-main>
        <template>
          <el-table highlight-current-row="true" lazy="true" v-loading="loading" border :data="macs" style="width: 150%"
            :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
            <el-table-column prop="seqid" label="序列" width="70"></el-table-column>
            <el-table-column prop="credate" label="创建时间" width="170"></el-table-column>
            <el-table-column prop="mac" label="MAC地址" width="170"></el-table-column>
            <el-table-column prop="memo" label="请求信息" width="200"> </el-table-column>
            <el-table-column prop="reqdate" label="请求时间" width="170"></el-table-column>
            <el-table-column prop="reqip" label="请求人IP" width="140"></el-table-column>
            <el-table-column prop="reqemployeeid" label="请求人工号"></el-table-column>
            <el-table-column prop="reqemployeename" label="请求人姓名"> </el-table-column>
            <el-table-column prop="lastip" label="最后登录IP" width="140"></el-table-column>
            <el-table-column prop="lastdate" label="最后时间" width="170"></el-table-column>
            <el-table-column prop="lastemployeeid" label="最后使用工号"></el-table-column>
            <el-table-column prop="lastemployeename" label="最后使用姓名"></el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
              <template slot-scope="scope">
                <el-button @click.native.prevent="deleteRow(scope.$index)" type="danger" size="mini">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :page-sizes="[5, 10, 15, 20, 50]" :page-size="queryParams.pageSize"
              layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </template>
      </el-main>
    </el-container>
    <div id="copyright">copyright © 刘少雄 {{ time }}</div>
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
#copyright{
  color: rgb(0, 0, 0);
  position: absolute;
  top: 97%;
  left: 43%;
}
#search-mac{
  position: absolute;
  top: 1%;
  left: 24%;
}
#search-name{
  position: absolute;
  top: 1%;
  left: 36%;
}
#search-name2{
  position: absolute;
  top: 1%;
  left: 49%;
}
#search{
  position: absolute;
  top: 1%;
  left: 62%;
}
#reset{
  position: absolute;
  top: 1%;
  left: 67%;
}
#mybreadcrunb{
  position: absolute;
  top: 10%;
  left: 12%;
}
body {
    margin: 0;
}
</style>

<script>
import { useMacList, deleteMac } from '../api/index'

export default {
  data () {
    return {
      macs: [],
      title: null,
      time: null,
      total: null,
      loading: true,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        lastemployeename: null,
        mac: null
      }
    }
  },
  created () {
    this.getList()
  },
  mounted () {
    this.$nextTick(() => {
      setInterval(this.update_clock, 500)
    })
  },
  methods: {
    getList () {
      useMacList(this.queryParams).then((_result) => {
        this.macs = _result.data.data.rows
        this.total = _result.data.data.total
        this.loading = false
        if (_result.data.code === 200) {
          this.title = '网卡使用表'
        } else {
          this.$message({
            showClose: true,
            message: '获取数据失败',
            type: 'error'
          })
        }
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '后端接口连接异常',
          type: 'error'
        })
      })
    },
    deleteRow (index) {
      const usemac = this.macs[index].mac
      const uselastemployeename = this.macs[index].lastemployeename
      const usesq = this.macs[index].seqid
      this.$confirm('是否确认信息为"' + usesq + ' - ' + usemac + ' - ' + uselastemployeename + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteInfo(this.macs[index])
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: '[ ' + usemac + '-' + uselastemployeename + '' + ' ]' + '取消删除操作',
            type: 'warning'
          })
        })
    },
    deleteInfo (v) {
      deleteMac(v).then((_result) => {
        if (_result.data.code === 200) {
          this.$message({
            showClose: true,
            message: _result.data.msg,
            type: 'success'
          })
          this.getList()
        } else {
          this.$message({
            showClose: true,
            message: _result.data.msg,
            type: 'error'
          })
        }
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '后端接口连接异常',
          type: 'error'
        })
      })
    },
    update_clock: function () {
      var d = new Date()
      var year = d.getFullYear()
      var mon = this.gTime(d.getMonth() + 1)
      var day = this.gTime(d.getDate())
      var hour = this.gTime(d.getHours())
      var minute = this.gTime(d.getMinutes())
      var seconds = this.gTime(d.getSeconds())
      this.time = year + '-' + mon + '-' + day + ' ' + hour + ':' + minute + ':' + seconds
    },
    gTime: function (num) {
      if (num < 10) {
        num = '0' + num
      }
      return num
    },
    handleSizeChange (val) {
      // 更新每页条数
      this.queryParams.pageSize = val
      this.loading = true
      this.getList()
    },
    handleCurrentChange (val) {
      // 更新当前页码
      this.queryParams.pageNum = val
      this.loading = true
      this.getList()
    },
    handleQuery () {
      this.queryParams.pageNum = 1
      this.loading = true
      this.getList()
    },
    resetQuery () {
      this.queryParams.mac = null
      this.queryParams.lastemployeename = null
      this.queryParams.reqemployeename = null
      this.loading = true
      this.getList()
    }
  }
}
</script>
