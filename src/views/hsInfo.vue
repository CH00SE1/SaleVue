<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']" :router="true" :disabled="true">
        <!-- <el-button type="text" @click="openTitle">查询标题</el-button> -->
        <el-button type="text" @click="dialogFormVisible = true">打开查询条件</el-button>
        <el-dialog title="查询信息" :visible.sync="dialogFormVisible">
          <el-form :model="queryParams">
            <el-form-item label="标题" :label-width="formLabelWidth">
              <el-input v-model="queryParams.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="平台" :label-width="formLabelWidth">
              <el-input v-model="queryParams.platform" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="openTitle">确 定</el-button>
          </div>
        </el-dialog>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
        <span>{{ queryParams.title }} * {{ queryParams.platform }}</span>
      </el-header>
      <el-main>
        <template>
          <el-table :data="hsInfoList" style="width: 150%" :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            :default-sort="{ prop: 'sum_fl_money', order: 'descending' }">
            <el-table-column prop="id" label="序号" width="140"></el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="120"></el-table-column>
            <el-table-column prop="title" label="标题"> </el-table-column>
            <el-table-column prop="url" label="在线播放地址"> </el-table-column>
            <el-table-column prop="m3u8Url" label="视频下载地址"> </el-table-column>
            <el-table-column prop="classId" label="分类ID"> </el-table-column>
            <el-table-column prop="platform" label="平台"> </el-table-column>
            <el-table-column prop="page" label="页码"> </el-table-column>
            <el-table-column prop="location" label="位置"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click.native.prevent="downloadRow(scope.$index)" type="text" size="small">
                  下载
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :page-sizes="[3, 5, 10, 15, 20, 30, 50, 100]" :page-size="queryParams.pageSize"
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
</style>

<script>
import { listHsInfo, DownloadVideo } from '../api/index'

export default {
  data () {
    return {
      hsInfoList: [],
      total: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      // 查询参数
      queryParams: {
        title: null,
        pageNum: 1,
        pageSize: 5,
        platform: null
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      listHsInfo(this.queryParams).then((_result) => {
        this.hsInfoList = _result.data.data.rows
        this.total = _result.data.data.total
        this.$notify({
          title: '请求消息',
          message: this.queryParams,
          offset: 100,
          type: 'success'
        })
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '后端接口连接异常',
          type: 'error'
        })
      })
    },
    openTitle () {
      this.getList()
      this.dialogFormVisible = false
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
    downloadRow (index) {
      DownloadVideo(this.hsInfoList[index]).then((_result) => {
        this.$message({
          showClose: true,
          message: _result.data.msg,
          type: 'success'
        })
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: this.hsInfoList[index].title + ' ==> 下载地址连接异常',
          type: 'error'
        })
      })
    }
  }
}
</script>
