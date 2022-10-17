<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']" :router="true" :disabled="true">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>英克操作</template>
          <el-menu-item-group>
            <el-menu-item index="/mac">请求表操作</el-menu-item>
            <el-menu-item index="/usemac">使用表操作</el-menu-item>
            <el-menu-item index="/pengingOrder">挂单管理</el-menu-item>
            <el-menu-item index="/addInckShopInfo">门店创建</el-menu-item>
            <el-menu-item index="/addInckPensonnelInfo">人员创建</el-menu-item>
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
          <el-table v-loading="loading" border :data="macs" style="width: 150%" :row-style="{ height: '0' }"
            :cell-style="{ padding: '3px' }" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
            <el-table-column prop="seqid" label="序列" width="70">
            </el-table-column>
            <el-table-column prop="credate" label="申请时间" width="170">
            </el-table-column>
            <el-table-column prop="mac" label="MAC地址" width="170"> </el-table-column>
            <el-table-column prop="fromip" label="请求IP地址" width="160"> </el-table-column>
            <el-table-column prop="memo" label="请求信息"> </el-table-column>
            <el-table-column prop="reqdate" label="请求时间" width="170"> </el-table-column>
            <el-table-column prop="reqip" label="请求人IP" width="160"> </el-table-column>
            <el-table-column prop="reqemployeeid" label="请求人工号"> </el-table-column>
            <el-table-column prop="reqemployeename" label="请求人姓名"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="160">
              <template slot-scope="scope">
                <el-button @click.native.prevent="auditRow(scope.$index)" type="success" effect="dark" size="mini">
                  审核
                </el-button>
                <el-button @click.native.prevent="deleteRow(scope.$index)" type="danger" size="mini">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :page-sizes="[5, 10, 20, 50]" :page-size="queryParams.pageSize"
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
</style>

<script>
import { macList, auditMac, deleteReqMac } from '../api/index'

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
        pageSize: 10
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
      macList(this.queryParams).then((_result) => {
        if (_result.data.code === 200) {
          this.macs = _result.data.data.rows
          this.total = _result.data.data.total
          this.loading = false
          this.title = '网卡请求表'
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
    auditRow (index) {
      auditMac(this.macs[index]).then((_result) => {
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
    deleteRow (index) {
      const usemac = this.macs[index].mac
      const reqemployeename = this.macs[index].reqemployeename
      const usesq = this.macs[index].seqid
      this.$confirm('是否确认信息为"' + usesq + ' - ' + usemac + ' - ' + reqemployeename + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.deleteMacInfo(this.macs[index])
        })
        .catch(() => {
          this.$message({
            showClose: true,
            message: '[ ' + usemac + '-' + reqemployeename + '' + ' ]' + '取消删除操作',
            type: 'warning'
          })
        })
    },
    deleteMacInfo (v) {
      deleteReqMac(v).then((_result) => {
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
    }
  }
}
</script>
