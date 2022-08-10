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
      <template>
        <div id="photo">
          <div id="main" style="width: 600px; height: 400px"></div>
        </div>
      </template>
      <el-main>
        <template>
          <el-table :data="saleList" v-loading="loading" show-summary style="width: 100%" :row-style="{ height: '0' }"
            :cell-style="{ padding: '3px' }" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form label-position="left" inline class="demo-table-expand">
                  <el-form-item label="姓名">
                    <span>{{ props.row.name }}</span>
                  </el-form-item>
                  <el-form-item label="总销售">
                    <span>{{ props.row.sum_money }}</span>
                  </el-form-item>
                  <el-form-item label="提成">
                    <span>{{ props.row.sum_fl_money }}</span>
                  </el-form-item>
                  <el-form-item label="黄金单品">
                    <span>{{ props.row.fl.黄金单品 }}</span>
                  </el-form-item>
                  <el-form-item label="A类">
                    <span>{{ props.row.fl.A }}</span>
                  </el-form-item>
                  <el-form-item label="B类">
                    <span>{{ props.row.fl.B }}</span>
                  </el-form-item>
                  <el-form-item label="C类">
                    <span>{{ props.row.fl.C }}</span>
                  </el-form-item>
                  <el-form-item label="D类">
                    <span>{{ props.row.fl.D }}</span>
                  </el-form-item>
                  <el-form-item label="E类">
                    <span>{{ props.row.fl.E }}</span>
                  </el-form-item>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="140"></el-table-column>
            <el-table-column prop="sum_money" label="总销售" width="120"></el-table-column>
            <el-table-column prop="sum_fl_money" label="毛利"> </el-table-column>
            <el-table-column prop="fl.黄金单品" label="黄金单品"> </el-table-column>
            <el-table-column prop="fl.A" label="A类"> </el-table-column>
            <el-table-column prop="fl.B" label="B类"> </el-table-column>
            <el-table-column prop="fl.C" label="C类"> </el-table-column>
            <el-table-column prop="fl.D" label="D类"> </el-table-column>
            <el-table-column prop="fl.E" label="E类"> </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click.native.prevent="querydtlList(scope.$index)" @click="dialogTableVisible = true"
                  type="text" size="small">
                  明细
                </el-button>
                <el-button @click.native.prevent="exportExcel('.el-main .el-table__fixed-right', '销售数据')"
                  @click="dialogTableVisible = false" type="text" size="small">
                  导出
                </el-button>
                <el-dialog :append-to-body="true" custom-class="customWidth" title="销售明细"
                  :visible.sync="dialogTableVisible" :modal-append-to-body="false">
                  <el-table height="700px" v-loading="loading" :data="saledtlList" highlight-current-row
                    style="width: 150%" :row-style="{ height: '0' }" :cell-style="{ padding: '3px' }"
                    :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
                    <el-table-column type="index" width="50">
                    </el-table-column>
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
                    <el-table-column property="employeename" label="营业员" width="100"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="120">
                      <el-button
                        @click.native.prevent="exportExcel('.el-dialog__body .el-table__fixed-right', '个人销售明细')"
                        @click="dialogTableVisible = true" type="text" size="small">
                        导出
                      </el-button>
                    </el-table-column>
                  </el-table>
                  <div class="pagination">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                      :page-sizes="[3, 5, 10, 20, 30, 50, 100]" :page-size="queryParams.pageSize"
                      layout="total, sizes, prev, pager, next, jumper" :total="total">
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
  width: 93%;
}
body {
    margin: 0;
}
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 100px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 1px;
    margin-bottom: 0;
    width: 50%;
}
</style>

<script>
import { listDaySale, listNameDaySale } from '../api/index'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import * as echarts from 'echarts'

export default {
  data () {
    return {
      // 图表实列化
      myChart: '',
      // y轴销售金额
      saleYmlList: [],
      // y轴提成金额
      saleYmlmoneyList: [],
      // x轴数据名字
      saleXnameList: [],
      saleList: [],
      saledtlList: [],
      title: null,
      total: null,
      // 记录index页码
      index: null,
      loading: true,
      dateTime: 'day',
      shopId: '32',
      dialogTableVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 50,
        eName: null
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.drawLine('main')
      // 定时1分钟刷新页面
      setInterval(this.getList, 1 * 60 * 1000)
    })
  },
  created () {
    this.getList()
  },
  methods: {
    // 导出excel表格
    exportExcel (val, fliename) {
      /* generate workbook object from table */
      // 因为element-ui的表格的fixed属性导致多出一个table，会下载重复内容，这里删除掉
      let table = document.querySelector(val).cloneNode(true)
      var wb = XLSX.utils.table_to_book(table, { raw: true })
      /* get binary string as output */
      // 因为element-ui的表格的fixed属性导致多出一个table，会下载重复内容，这里删除掉
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), fliename + '.xlsx')
      } catch (e) { if (typeof console !== 'undefined') console.log(e, wbout) }
      return wbout
    },
    getList () {
      listDaySale().then((_result) => {
        this.saleList = _result.data.data.sales_info_details
        for (var i = 0; i < this.saleList.length; i++) {
          this.saleYmlList[i] = this.saleList[i].sum_money
          this.saleYmlmoneyList[i] = this.saleList[i].sum_fl_money
          this.saleXnameList[i] = this.saleList[i].name
        }
        this.drawLine('main')
        this.title = _result.data.data.title
        this.loading = false
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '后端接口连接异常',
          type: 'error'
        })
      })
    },
    querydtlList (index) {
      this.loading = true
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
    },
    drawLine (id) {
      // 初始化图标信息
      if (this.myChart !== null && this.myChart !== '' && this.myChart !== undefined) {
        this.myChart.dispose()
      }
      this.myChart = echarts.init(document.getElementById(id))
      const option = ({
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['销售金额折线图', '提成金额折线图']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.saleXnameList
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '提成金额折线图',
            type: 'line',
            data: this.saleYmlmoneyList
          },
          {
            name: '销售金额折线图',
            type: 'line',
            data: this.saleYmlList
          }
        ]
      })
      this.myChart.setOption(option)
    }
  }
}
</script>
