<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']" :router="true" :disabled="true">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>销售查询</template>
          <el-menu-item-group>
            <template slot="title">时间类型</template>
            <el-menu-item index="/day">当天</el-menu-item>
            <el-menu-item index="/yesterday">昨天</el-menu-item>
            <el-menu-item index="/month">当月</el-menu-item>
            <el-menu-item index="/lastmonth">上月</el-menu-item>
            <el-menu-item index="/year">当年</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-message"></i>英克</template>
          <el-menu-item-group>
             <el-menu-item index="/mac">入网请求审批</el-menu-item>
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
            <el-table :data="saleList" border style="width: 150%" :row-style="{height: '0'}" :cell-style="{padding: '3px'}" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
            <el-table-column prop="name" label="姓名" width="140">
            </el-table-column>
            <el-table-column prop="sum_money" label="总销售" width="120">
            </el-table-column>
            <el-table-column prop="sum_fl_money" label="毛利"> </el-table-column>
            <el-table-column prop="fl.黄金单品" label="黄金单品"> </el-table-column>
            <el-table-column prop="fl.A" label="A类"> </el-table-column>
            <el-table-column prop="fl.B" label="B类"> </el-table-column>
            <el-table-column prop="fl.C" label="C类"> </el-table-column>
            <el-table-column prop="fl.D" label="D类"> </el-table-column>
            <el-table-column prop="fl.E" label="E类"> </el-table-column>
            <el-table-column
                fixed="right"
                label="操作"
                width="120">
                <template slot-scope="scope">
                <el-button
                @click.native.prevent="querydtlList(scope.$index)"
                @click="dialogTableVisible = true"
                type="text"
                size="small">
                查询明细
                </el-button>
                <el-dialog :append-to-body="true" custom-class="customWidth" title="销售明细" :visible.sync="dialogTableVisible" :modal-append-to-body="false">
                  <el-table v-loading="loading" :data="saledtlList" border style="width: 150%" :row-style="{height: '0'}" :cell-style="{padding: '3px'}" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
                    <el-table-column property="rsaid" label="流水总单ID" width="100"></el-table-column>
                    <el-table-column property="rsadtlid" label="流水细单ID" width="100"></el-table-column>
                    <el-table-column property="credate" label="创建时间" width="160"></el-table-column>
                    <el-table-column property="goodsid" label="药品ID" width="100"></el-table-column>
                    <el-table-column property="goodstype" label="药品规格" width="100"></el-table-column>
                    <el-table-column property="factoryname" label="厂家" width="200"></el-table-column>
                    <el-table-column property="goodsqty" label="销售数量" width="100"></el-table-column>
                    <el-table-column property="realmoney" label="实收金额" width="100"></el-table-column>
                    <el-table-column property="placepointid" label="门店ID" width="100"></el-table-column>
                    <el-table-column property="goodsname" label="药品名称" width="150"></el-table-column>
                    <el-table-column property="fl" label="毛利分类" width="100"></el-table-column>
                    <el-table-column property="batchid" label="批次ID" width="100"></el-table-column>
                    <el-table-column property="lotno" label="批号" width="100"></el-table-column>
                    <el-table-column property="posno" label="柜组分类" width="100"></el-table-column>
                    <el-table-column property="employeename" label="营业员姓名" width="100"></el-table-column>
                  </el-table>
                  <div class="pagination">
                  <el-pagination
                  background
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :page-sizes="[3, 5, 10]"
                  :page-size="queryParams.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
                  </el-pagination>
                  </div>
                </el-dialog>
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
.customWidth{
  width: 90%;
}
body {
    margin: 0;
}
</style>

<script>
import { listDaySale, listNameDaySale } from '../api/index'

export default {
  data () {
    return {
      saleList: [],
      saledtlList: [],
      title: null,
      total: null,
      // 记录index页码
      index: null,
      loading: true,
      dialogTableVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 3,
        eName: null
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      listDaySale().then((_result) => {
        this.saleList = _result.data.data.sales_info_details
        this.title = _result.data.data.title
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '后端接口连接异常',
          type: 'error'
        })
      })
    },
    querydtlList (index) {
      this.index = index
      this.queryParams.eName = this.saleList[index].name
      listNameDaySale(this.queryParams).then((_result) => {
        if (_result.data.code === 200) {
          this.saledtlList = _result.data.data.rows
          this.total = _result.data.data.total
          this.loading = false
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
      this.querydtlList(this.index)
    },
    handleCurrentChange (val) {
      // 更新当前页码
      this.queryParams.pageNum = val
      this.loading = true
      this.querydtlList(this.index)
    }
  }
}
</script>
