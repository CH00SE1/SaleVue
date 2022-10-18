<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <navigation ref="navigation"></navigation>
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
        <span>{{ title }}</span>
      </el-header>
      <el-main>
        <template>
          <el-table v-loading="loading" :data="macs">
            <el-table-column prop="seqid" label="序列" align="center">
            </el-table-column>
            <el-table-column prop="credate" label="申请时间" align="center" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="mac" label="MAC地址" align="center" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="fromip" label="请求IP地址" align="center" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="memo" label="请求信息" align="center" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="reqdate" label="请求时间" align="center" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="reqip" label="请求人IP" align="center" :show-overflow-tooltip="true"> </el-table-column>
            <el-table-column prop="reqemployeeid" label="请求人工号" align="center" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="reqemployeename" label="请求人姓名" align="center" :show-overflow-tooltip="true">
            </el-table-column>
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
        pageSize: 15
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
