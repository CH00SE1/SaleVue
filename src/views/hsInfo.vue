<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']" :router="true" :disabled="true">
        <el-button type="text" @click="open">点击打开查询标题</el-button>
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
              <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                <el-button
                @click.native.prevent="downloadRow(scope.$index)"
                type="text"
                size="small">
                下载
                </el-button>
                </template>
             </el-table-column>
        </el-table>
        <div class="pagination">
        <el-pagination
         @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :page-sizes="[5, 10, 15, 20, 30, 50, 100]"
         :page-size="pageSize"
         layout="total, sizes, prev, pager, next, jumper"
         :total="total">
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
</style>

<script>
import { listHsInfo, DownloadVideo } from '../api/index'

export default {
  data () {
    return {
      hsInfoList: [],
      // 查询参数
      queryParams: {
        title: null,
        pageNum: 1,
        pageSize: 10,
        total: null
      }
    }
  },
  created () {
    this.open()
  },
  methods: {
    getList () {
      listHsInfo(this.queryParams).then((_result) => {
        this.hsInfoList = _result.data.data.rows
        this.total = _result.data.data.total
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '后端接口连接异常',
          type: 'error'
        })
      })
    },
    open () {
      this.$prompt('请输入标题', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '你的标题是: ' + value
        })
        this.queryParams.title = value
        this.getList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消输入'
        })
      })
    },
    handleSizeChange (val) {
      // val变化后的每页的条数
      this.queryParams.pageSize = val // 更新每页的条数
      this.getList() // 重新获取列表数据
    },
    handleCurrentChange (val) {
      this.queryParams.pageNum = val
      this.getList() // 重新获取列表数据
    },
    downloadRow (index) {
      DownloadVideo(this.hsInfoList[index]).then((_result) => {
        this.$message({
          showClose: true,
          message: this.hsInfoList[index].title + ' 下载中',
          type: 'success'
        })
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '下载接口连接异常',
          type: 'error'
        })
      })
    }
  }
}
</script>
