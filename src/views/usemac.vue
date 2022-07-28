<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <div id = "search-mac">
      <el-input
      placeholder="请输入网卡mac"
      @keyup.enter.native="handleQuery"
      v-model="queryParams.mac">
      </el-input>
    </div>
    <div id = "search-name">
      <el-input
      placeholder="请输入最后使用人姓名"
      @keyup.enter.native="handleQuery"
      v-model="queryParams.lastemployeename">
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
          <template slot="title"><i class="el-icon-message"></i>网卡操作</template>
          <el-menu-item-group>
            <el-menu-item index="/mac">请求表操作</el-menu-item>
            <el-menu-item index="/usemac">使用表操作</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
      <span>{{ title }}</span>
      </el-header>
      <el-main>
        <template>
            <el-table :data="macs" border style="width: 100%">
            <el-table-column prop="seqid" label="序列">
            </el-table-column>
            <el-table-column prop="credate" label="申请时间">
            </el-table-column>
            <el-table-column prop="mac" label="MAC地址"> </el-table-column>
            <el-table-column prop="fromip" label="请求IP地址"> </el-table-column>
            <el-table-column prop="memo" label="请求信息"> </el-table-column>
            <el-table-column prop="reqdate" label="请求时间"> </el-table-column>
            <el-table-column prop="reqip" label="请求人IP"> </el-table-column>
            <el-table-column prop="reqemployeeid" label="请求人工号"> </el-table-column>
            <el-table-column prop="reqemployeename" label="请求人姓名"> </el-table-column>
            <el-table-column prop="lastdate" label="最后时间"> </el-table-column>
            <el-table-column prop="lastemployeeid" label="最后使用工号"> </el-table-column>
            <el-table-column prop="lastemployeename" label="最后使用姓名"> </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                <el-button
                @click.native.prevent="deleteRow(scope.$index)"
                type="text"
                size="small">
                删除
                </el-button>
                </template>
             </el-table-column>
        </el-table>
        <div class="pagination">
        <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
        </el-pagination>
        </div>
        </template>
      </el-main>
    </el-container>
    <div id="copyright">copyright © CH00SE1 {{time}}</div>
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
  left: 30%;
}
#search-name{
  position: absolute;
  top: 1%;
  left: 45%;
}
#search{
  position: absolute;
  top: 1%;
  left: 60%;
}
#reset{
position: absolute;
  top: 1%;
  left: 65%;
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
      queryParams: {
        pageNum: 1,
        pageSize: 5,
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
            type: 'success'
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
      this.getList()
    },
    handleCurrentChange (val) {
      // 更新当前页码
      this.queryParams.pageNum = val
      this.getList()
    },
    handleQuery () {
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery () {
      this.queryParams.mac = null
      this.queryParams.lastemployeename = null
      this.getList()
    }
  }
}
</script>
