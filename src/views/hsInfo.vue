<template>
  <el-container style="height: 900px; border: 1px solid #eee">
    <el-container>
      <el-main>
        <template>
          <div class="app-container">
            <el-form :model="queryParams" :inline="true" label-width="40px">
              <el-form-item label="标题" prop="title">
                <el-input v-model="queryParams.title" placeholder="请输入标题" clearable size="small" style="width: 240px"
                  @keyup.enter.native="handleQuery" />
              </el-form-item>
              <el-form-item label="平台" prop="platform">
                <el-input v-model="queryParams.platform" placeholder="请输入平台" clearable size="small" style="width: 240px"
                  @keyup.enter.native="handleQuery" />
              </el-form-item>
              <el-form-item label="分类" prop="classId">
                <el-input v-model="queryParams.classId" placeholder="请输入分类" clearable size="small" style="width: 240px"
                  @keyup.enter.native="handleQuery" />
              </el-form-item>
              <template>
                <el-form-item label="平台" prop="platform">
                  <el-select v-model="queryParams.platform" placeholder="选择平台">
                    <el-option v-for="item in options" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>
                </el-form-item>
              </template>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
            <el-table v-loading="loading" :data="hsInfoList" height="770" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column prop="id" label="ID" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">{{ scope.row.id }}</template>
              </el-table-column>
              <el-table-column min-width="60" prop="photoUrl" label="预览图" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-popover placement="top-start" title="" trigger="hover">
                    <img :src="scope.row.photoUrl" />
                    <img slot="reference" :src="scope.row.photoUrl" style="width:110px;height:110px" />
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="createdAt" label="创建时间" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.createdAt }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="classId" label="分类ID" align="center" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column prop="title" label="标题" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <a :href="scope.row.url" target="_blank">
                    {{ scope.row.title }}
                  </a>
                </template>
              </el-table-column>
              <el-table-column prop="platform" label="平台" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-popover trigger="hover" placement="top">
                    <p>FileName: "{{ scope.row.title }}",</p>
                    <p>Url: "{{ scope.row.m3u8Url }}",</p>
                    <p>playUrl: "{{ scope.row.url }}"</p>
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium">{{ scope.row.platform }}</el-tag>
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="page" label="页码" align="center" :show-overflow-tooltip="true"> </el-table-column>
              <el-table-column prop="location" label="位置" align="center" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column fixed="right" label="操作" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <el-button @click.native.prevent="downloadRow(scope.$index)" type="danger" size="mini">
                    下载
                  </el-button>
                  <el-button @click.native.prevent="exportExcel('.el-main .el-table__fixed-right', '视频数据')"
                    @click="dialogTableVisible = false" size="mini">
                    导出
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination">
              <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :page-sizes="[3, 5, 10, 12, 15, 20, 30, 50, 100]" :page-size="queryParams.pageSize"
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

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

#copyright{
  color: rgb(0, 0, 0);
  position: absolute;
  top: 97%;
  left: 43%;
}

</style>

<script>
import { listHsInfo, DownloadVideo, queryPlatform } from '../api/index'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'

export default {
  data () {
    return {
      options: [],
      hsInfoList: [],
      total: null,
      dialogTableVisible: false,
      formLabelWidth: '120px',
      loading: true,
      multipleSelection: [],
      // 查询参数
      queryParams: {
        title: null,
        pageNum: 1,
        pageSize: 5,
        classId: null,
        platform: null,
        page: null
      }
    }
  },
  created () {
    this.getList()
    this.getplatfrom()
  },
  methods: {
    // 导出excel表
    exportExcel (val, fliename) {
      let table = document.querySelector(val).cloneNode(true)
      var wb = XLSX.utils.table_to_book(table, { raw: true })
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fliename + '.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    },
    getplatfrom () {
      queryPlatform().then((_result) => {
        this.options = _result.data
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '分组获取平台数据后端接口连接异常',
          type: 'error'
        })
      })
    },
    getList () {
      listHsInfo(this.queryParams).then((_result) => {
        if (_result.data.code === 200) {
          this.hsInfoList = _result.data.data.rows
          this.total = _result.data.data.total
        } else {
          this.$message({
            showClose: true,
            message: _result.data.msg,
            type: 'error'
          })
        }
        this.loading = false
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '后端接口连接异常',
          type: 'error'
        })
      })
    },
    handleQuery () {
      // 搜素条件
      this.loading = true
      this.handleCurrentChange(1)
    },
    resetQuery () {
      this.queryParams.title = null
      this.queryParams.classId = null
      this.queryParams.page = null
      this.queryParams.pageSize = 5
      this.queryParams.platform = null
      this.handleCurrentChange(1)
    },
    handleSizeChange (val) {
      // 更新每页条数
      this.loading = true
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      // 更新当前页码
      this.loading = true
      this.queryParams.pageNum = val
      this.getList()
    },
    downloadRow (index) {
      console.log('下载触发' + index)
      if (this.multipleSelection.length !== 0) {
        DownloadVideo(this.multipleSelection).then((_result) => {
          if (_result.data.code === 200) {
            this.$notify({
              title: '下载操作成功',
              message: _result.data.data,
              type: 'success',
              position: 'bottom-left'
            })
          }
          if (_result.data.code === 500) {
            this.$notify.error({
              title: '文件在下载中,一分钟后重试',
              message: _result.data.msg,
              position: 'bottom-left'
            })
          }
        }).catch((_err) => {
          this.$notify.error({
            title: '下载失败',
            message: this.hsInfoList[index].title + ' ==> 下载发生异常',
            position: 'bottom-left'
          })
        })
      } else {
        this.$notify.error({
          title: '下载失败',
          message: '没有任何选中记录!!!',
          position: 'bottom-left'
        })
      }
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      if (this.multipleSelection.length !== 0) {
        this.$message({
          showClose: true,
          message: this.multipleSelection,
          type: 'success',
          center: true
        })
      }
    }
  }
}
</script>
