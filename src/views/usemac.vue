<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <navigation ref="navigation"></navigation>
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
        <span>{{ title }}</span>
      </el-header>
      <el-main>
        <template>
          <div class="app-container">
            <el-form :model="queryParams" :inline="true" label-width="150px">
              <el-form-item label="网卡mac" prop="mac">
                <el-input v-model="queryParams.mac" placeholder="请输入网卡mac" clearable size="small" style="width: 240px"
                  @keyup.enter.native="handleQuery" />
              </el-form-item>
              <el-form-item label="最后使用人姓名" prop="lastemployeename">
                <el-input v-model="queryParams.lastemployeename" placeholder="请输入请求人姓名" clearable size="small"
                  style="width: 240px" @keyup.enter.native="handleQuery" />
              </el-form-item>
              <el-form-item label="请求人姓名" prop="reqemployeename">
                <el-input v-model="queryParams.reqemployeename" placeholder="请输入网卡mac" clearable size="small"
                  style="width: 240px" @keyup.enter.native="handleQuery" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="macs">
              <el-table-column prop="seqid" label="序列" align="center"></el-table-column>
              <el-table-column prop="credate" label="创建时间" align="center" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column prop="mac" label="MAC地址" align="center" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="memo" label="请求信息" align="center" :show-overflow-tooltip="true"> </el-table-column>
              <el-table-column prop="reqdate" label="请求时间" align="center" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column prop="reqip" label="请求人IP" align="center" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column prop="reqemployeeid" label="请求人工号" align="center"></el-table-column>
              <el-table-column prop="reqemployeename" label="请求人姓名" align="center" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column prop="lastip" label="最后登录IP" align="center" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column prop="lastdate" label="最后时间" align="center" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column prop="lastemployeeid" label="最后使用工号" align="center"></el-table-column>
              <el-table-column prop="lastemployeename" label="最后使用姓名" align="center" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column fixed="right" label="操作">
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
          </div>
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
.app-container {
  padding: 20px;
}
body {
    margin: 0;
}
</style>

<script>
import { useMacList, deleteMac } from '../api/index'
import navigation from './navigation.vue'

export default {
  components: {
    navigation
  },
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
        mac: null,
        reqemployeename: null
      }
    }
  },
  created () {
    this.getList()
  },
  mounted () {
  },
  methods: {
    getList () {
      useMacList(this.queryParams).then((_result) => {
        if (_result.data.code === 200) {
          this.macs = _result.data.data.rows
          this.total = _result.data.data.total
          this.loading = false
          this.title = '网卡使用表'
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
