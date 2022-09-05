<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']" :router="true" :disabled="true">
        <el-button type="text" @click="dialogFormVisible = true">查询</el-button>
        <el-dialog title="查询信息" :visible.sync="dialogFormVisible">
          <el-form :model="queryParams">
            <el-form-item label="标题" :label-width="formLabelWidth">
              <el-input v-model="queryParams.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="平台" :label-width="formLabelWidth">
              <el-input v-model="queryParams.platform" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="页码" :label-width="formLabelWidth">
              <el-input v-model="queryParams.page" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="分类ID" :label-width="formLabelWidth">
              <el-input v-model="queryParams.classId" autocomplete="off"></el-input>
            </el-form-item>
            <template>
              <el-select v-model="queryParams.platform" placeholder="选择平台">
                <el-option v-for="item in options" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
            </template>
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
        <span>{{ queryParams.title }}{{ queryParams.platform }}</span>
      </el-header>
      <el-main>
        <template>
          <el-table :row-class-name="tableRowClassName" v-loading="loading" :data="hsInfoList" style="width: 150%"
            :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }" ref="multipleTable" tooltip-effect="dark"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="id" label="序号ID" width="100">
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="160"></el-table-column>
            <el-table-column prop="classId" label="分类ID"> </el-table-column>
            <el-table-column prop="title" label="标题" width="400"> </el-table-column>
            <!-- <el-table-column prop="url" label="在线播放地址"> </el-table-column>
            <el-table-column prop="m3u8Url" label="视频下载地址"> </el-table-column> -->
            <el-table-column min-width="55" prop="photoUrl" label="预览图" width="210">
              <template slot-scope="scope">
                <el-popover placement="top-start" title="" trigger="hover">
                  <img :src="scope.row.photoUrl" />
                  <img slot="reference" :src="scope.row.photoUrl" style="width:110px;height:110px" />
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column prop="platform" label="平台" width="180"> </el-table-column>
            <el-table-column prop="page" label="页码"> </el-table-column>
            <el-table-column prop="location" label="位置"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="200">
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
          <!-- <div style="margin-top: 20px">
            <el-button @click="toggleSelection([hsInfoList[0], hsInfoList[1]])">选第一第二行</el-button>
            <el-button @click="toggleSelection()">取消全选</el-button>
          </div> -->
          <div class="pagination">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :page-sizes="[3, 5, 10, 12, 15, 20, 30, 50, 100]" :page-size="queryParams.pageSize"
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

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
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
      dialogFormVisible: false,
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
        this.hsInfoList = _result.data.data.rows
        this.total = _result.data.data.total
        this.loading = false
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '后端接口连接异常',
          type: 'error'
        })
      })
    },
    openTitle () {
      // 搜素条件
      this.loading = true
      this.handleCurrentChange(1)
      this.dialogFormVisible = false
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
    tableRowClassName ({row, rowIndex}) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      } else {
        return 'success-row'
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
        this.$message({showClose: true, message: this.multipleSelection, type: 'success', center: true})
      } else {
        this.$message({message: '取消选择', center: true})
      }
    }
  }
}
</script>
