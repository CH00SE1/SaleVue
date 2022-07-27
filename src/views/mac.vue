<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
      <span>{{ title }}</span>
      </el-header>
      <el-main>
        <template>
            <el-table :data="macs" border style="width: 100%" :default-sort="{prop: 'credate', order: 'descending'}">
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
            <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                <el-button
                @click.native.prevent="auditRow(scope.$index)"
                type="text"
                size="small">
                审核
                </el-button>
                </template>
             </el-table-column>
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
import { macList, auditMac } from '../api/index'

export default {
  data () {
    return {
      macs: [],
      title: null
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      macList().then((_result) => {
        this.macs = _result.data.data
        if (_result.data.code === 200) {
          this.title = '网卡请求信息记录表'
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
    }
  }
}
</script>
