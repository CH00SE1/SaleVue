<template>
  <el-container style="height: 850px; border: 1px solid #eee">
    <div id="searchShopId">
      <el-input placeholder="请输入门店ID" @keyup.enter.native="handleQuery" v-model="queryParams.placepointid">
      </el-input>
    </div>
    <div id="selectShopId">
      <el-form :model="queryParams">
        <template>
          <el-select v-model="queryParams.placepointid" placeholder="选择门店">
            <el-option v-for="item in options" :key="item.placepointname" :label="item.placepointname"
              :value="item.placepointid">
            </el-option>
          </el-select>
        </template>
      </el-form>
    </div>
    <div id="query">
      <el-button type="primary" icon="el-icon-search" v-on:click="handleQuery">查询</el-button>
    </div>
    <div id="reset">
      <el-button icon="el-icon-refresh" v-on:click="resetQuery">重置</el-button>
    </div>
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']" :router="true" :disabled="true">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>功能</template>
          <el-menu-item-group>
            <el-menu-item index="/mac">网卡模块</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
        <span>零售挂单信息</span>
      </el-header>
      <el-main>
        <el-table v-loading="loading" :data="pengdingOrders" stripe style="width: 100%"
          :default-sort="{ prop: 'date', order: 'descending' }">
          <el-table-column prop="rsaid" label="总单ID" sortable width="120">
          </el-table-column>
          <el-table-column prop="rsadtlid" label="细单ID" sortable width="120">
          </el-table-column>
          <el-table-column prop="credate" label="创建时间" sortable width="180">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span style="margin-left: 10px">{{ scope.row.credate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="placepointname" label="门店名称" width="180">
          </el-table-column>
          <el-table-column prop="cashiername" label="调出挂单人">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>人员工号:{{ scope.row.cashierid }}</p>
                <p>门店ID:{{ scope.row.placepointid }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{ scope.row.cashiername }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="clerkername" label="营业员">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p>人员工号:{{ scope.row.clerkerid }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag type="success">{{ scope.row.clerkername }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="realmoney" sortable label="实收金额" width="120">
          </el-table-column>
          <el-table-column prop="goodsid" label="货品ID">
          </el-table-column>
          <el-table-column prop="goodsname" label="货品名称">
          </el-table-column>
          <el-table-column prop="goodsunit" label="货品单位">
          </el-table-column>
          <el-table-column prop="goodsqty" sortable label="货品数量" width="120">
          </el-table-column>
          <el-table-column prop="useprice" label="货品单价">
          </el-table-column>
          <el-table-column prop="goodstype" label="货品规格">
          </el-table-column>
          <el-table-column prop="factoryname" label="货品厂家">
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="90">
            <el-button @click.native.prevent="exportExcel('.el-table__fixed-right', '挂单数据')"
              @click="dialogTableVisible = true" type="danger" size="mini">
              导出
            </el-button>
          </el-table-column>
        </el-table>
        <div class="pagination">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :page-sizes="[5, 7, 10, 20, 50, 100, 200, 1000]" :page-size="queryParams.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}
.el-aside {
  color: #333;
}

#searchShopId {
  position: absolute;
  top: 1.5%;
  left: 24%;
}

#selectShopId {
  position: absolute;
  top: 1.5%;
  left: 36%;
}

#query {
  position: absolute;
  top: 1.5%;
  left: 49%;
}

#reset {
  position: absolute;
  top: 1.5%;
  left: 55%;
}
</style>

<script>
import { pendingOrder, shopInfoAll } from '../api/index'
import * as XLSX from 'xlsx'
import FileSaver from 'file-saver'

export default {
  data () {
    return {
      pengdingOrders: [],
      total: null,
      options: [],
      dialogTableVisible: false,
      loading: true,
      queryParams: {
        pageNum: 1,
        pageSize: 5,
        placepointid: null
      }
    }
  },
  created () {
    this.getList()
    this.getShopInfo()
  },
  methods: {
    // 导出excel表格
    exportExcel (val, fliename) {
      let table = document.querySelector(val).cloneNode(true)
      var wb = XLSX.utils.table_to_book(table, { raw: true })
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fliename + '.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    },
    getList () {
      pendingOrder(this.queryParams).then((_result) => {
        if (_result.data.code === 200) {
          if (_result.data.msg === '0') {
            this.$notify({
              title: '门店ID' + this.queryParams.placepointid,
              message: '没有查询到挂单',
              type: 'success',
              position: 'bottom-left'
            })
          } else {
            this.pengdingOrders = _result.data.data.records
            this.total = _result.data.data.total
            this.loading = false
          }
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
          message: '后端接口连接异常111',
          type: 'error'
        })
      })
    },
    getShopInfo () {
      shopInfoAll().then((_result) => {
        this.options = _result.data
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '接口连接异常',
          type: 'error'
        })
      })
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
    handleQuery () {
      this.loading = true
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery () {
      this.loading = true
      this.queryParams.placepointid = null
      this.getList()
    }
  }
}
</script>
