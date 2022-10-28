<template>
  <el-container style="height: 900px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']" :router="true" :disabled="true">
        <el-button type="text" @click="dialogFormVisible = true">销售查询</el-button>
        <el-dialog title="查询条件选择" :visible.sync="dialogFormVisible" width="60%">
          <el-form :model="queryParams" label-width="80px">
            <el-form-item label="门店ID">
              <el-input v-model="queryParams.shopId"></el-input>
            </el-form-item>
            <el-form-item label="时间段">
              <el-select v-model="queryParams.dateStr" placeholder="选择时间段">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  <span style="float: left; color: #008792; font-size: 13px">{{ item.label }}</span>
                  <span style="float: right; color: #ed1941; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="openSale">确 定</el-button>
          </div>
        </el-dialog>
        <navigation ref="navigation" :orderBean="orderBean"></navigation>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
        <span>{{ title }}</span>
      </el-header>
      <template>
        <div id="photo">
          <div id="main" style="width: 1700px; height: 360px"></div>
        </div>
      </template>
      <el-main>
        <template>
          <el-table v-loading="loading" :data="saleList" show-summary>
            <el-table-column prop="name" label="营业员" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="sumMoney" label="总销售" sortable align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="sumFlMoney" label="总毛利" sortable align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="fl.A+" label="A+" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="fl.A" label="A" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="fl.B" label="B" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="fl.C" label="C" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="fl.D" label="D" align="center" :show-overflow-tooltip="true" />
            <el-table-column prop="fl.E" label="E" align="center" :show-overflow-tooltip="true" />
            <el-table-column fixed="right" label="操作" width="160">
              <template slot-scope="scope">
                <el-button @click.native.prevent="querydtlList(scope.$index)" @click="dialogTableVisible = true"
                  type="text" size="mini">
                  明细
                </el-button>
                <el-button @click.native.prevent="exportExcel('.el-main .el-table__fixed-right', '销售数据')"
                  @click="dialogTableVisible = false" type="text" size="mini">
                  导出
                </el-button>
                <el-button size="mini" type="text" icon="el-icon-query" @click="handlePrint(scope.row, true)">打印
                </el-button>
                <el-dialog :append-to-body="true" custom-class="customWidth" :title="saleDetailName"
                  :visible.sync="dialogTableVisible" :modal-append-to-body="false">
                  <el-table v-loading="loading" :data="saledtlList" :span-method="objectSpanMethod">
                    <el-table-column fixed="left" property="rsaid" label="流水总单ID" width="100">
                      <template slot-scope="scope">
                        <el-popover trigger="click" placement="top">
                          <p>流水总单ID:{{ scope.row.rsaid }}</p>
                          <div slot="reference" class="name-wrapper">
                            <el-tag type="success" effect="dark">{{ scope.row.rsaid }}</el-tag>
                          </div>
                        </el-popover>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column property="rsadtlid" label="流水细单ID" width="100"></el-table-column> -->
                    <el-table-column property="credate" label="创建时间" width="200">
                      <template slot-scope="scope">
                        <i class="el-icon-time"></i>
                        <span style="margin-left: 10px">{{ scope.row.credate }}</span>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column type="index" width="50"></el-table-column> -->
                    <el-table-column property="insidername" label="会员姓名" width="160"></el-table-column>
                    <el-table-column property="goodsid" label="药品ID" width="100"></el-table-column>
                    <el-table-column property="goodsname" label="药品名称" width="200"></el-table-column>
                    <el-table-column property="goodstype" label="药品规格" width="180"></el-table-column>
                    <el-table-column property="factoryname" label="厂家" width="230"></el-table-column>
                    <el-table-column property="goodsqty" label="销售数量" width="100"></el-table-column>
                    <el-table-column property="realmoney" label="实收金额" width="100"></el-table-column>
                    <el-table-column property="fl" label="毛利分类" width="100"></el-table-column>
                    <!-- <el-table-column property="placepointid" label="门店ID" width="100"></el-table-column> -->
                    <el-table-column property="batchid" label="批次ID" width="120"></el-table-column>
                    <el-table-column property="lotno" label="批号" width="120"></el-table-column>
                    <el-table-column property="hospitalname" label="流向医院" width="200"></el-table-column>
                    <el-table-column property="recipehospital" label="处方医院" width="200"></el-table-column>
                    <!-- <el-table-column property="posno" label="柜组分类" width="100"></el-table-column> -->
                    <el-table-column fixed="right" property="employeename" label="营业员" width="90">
                      <template slot-scope="scope">
                        <el-popover trigger="hover" placement="top">
                          <p>毛利分类: {{ scope.row.fl }}</p>
                          <p>药品ID: {{ scope.row.goodsid }}</p>
                          <p>药品名称: {{ scope.row.goodsname }}</p>
                          <p>实收金额: {{ scope.row.realmoney }}</p>
                          <div slot="reference" class="name-wrapper">
                            <el-tag size="medium">{{ scope.row.employeename }}</el-tag>
                          </div>
                        </el-popover>
                      </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="操作" width="90">
                      <el-button
                        @click.native.prevent="exportExcel('.el-dialog__body .el-table__fixed-right', '个人销售明细')"
                        @click="dialogTableVisible = true" type="danger" size="mini">
                        导出
                      </el-button>
                    </el-table-column>
                  </el-table>
                  <div class="pagination">
                    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                      :page-sizes="[3, 5, 10, 20, 30, 50, 100, 1000]" :page-size="queryParams.pageSize"
                      layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                  </div>
                </el-dialog>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-main>
      <print-sale-detail ref="printSaleDetail" :orderBean="orderBean"></print-sale-detail>
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
  width: 200px;
  background-color: rgb(175, 215, 237);
}

.el-table--border {
  padding-left: 0px;
  text-align: center;
}

.customWidth {
  width: 80%;
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

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.el-main {
  width: 1700px;
  height: 500px;
}

</style>

<script>
import { listDaySale, listNameDaySale } from '../api/index'
import FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import * as echarts from 'echarts'
import navigation from './navigation.vue'
import printSaleDetail from './printSaleDetail.vue'

export default {
  components: {
    printSaleDetail,
    navigation
  },
  data () {
    return {
      // 日期选择数组
      options: [{value: 'day', label: '当天'}, {value: 'yesterday', label: '昨天'}, {value: 'lastmonth', label: '上月'}, {value: 'month', label: '本月'}, {value: 'year', label: '今年'}],
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
      saleDetailName: null,
      // 记录index页码
      index: null,
      loading: true,
      search: '',
      dialogTableVisible: false,
      dialogFormVisible: false,
      queryParams: {
        pageNum: 1,
        pageSize: 50,
        eName: null,
        dateStr: 'day',
        shopId: '32'
      },
      orderBean: {},
      rows: {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.drawLine('main')
      // 定时1分钟刷新页面
      // setInterval(this.getList, 1 * 60 * 1000)
    })
  },
  created () {
    this.getList(this.queryParams)
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
    getList (query) {
      listDaySale(query.dateStr, query.shopId).then((_result) => {
        if (_result.data.code === 200) {
          this.saleList = _result.data.data.salesInfoDetails
          for (var i = 0; i < this.saleList.length; i++) {
            this.saleYmlList[i] = this.saleList[i].sumMoney
            this.saleYmlmoneyList[i] = this.saleList[i].sumFlMoney
            this.saleXnameList[i] = this.saleList[i].name
          }
          this.drawLine('main')
          this.title = _result.data.data.title
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
    querydtlList (index) {
      this.loading = true
      this.index = index
      this.queryParams.eName = this.saleList[index].name
      this.saleDetailName = this.saleList[index].name + '销售明细'
      listNameDaySale(this.queryParams).then((_result) => {
        if (_result.data.code === 200) {
          this.saledtlList = _result.data.data.rows
          this.total = _result.data.data.total
          this.loading = false
          this.rowspan()
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
          message: _err,
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
        legend: {},
        grid: {
          left: 10,
          containLabel: true,
          bottom: 10,
          top: 10,
          right: 30
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLabel: {
            interval: 0,
            rotate: 40
          },
          data: this.saleXnameList
        },
        yAxis: [
          {
            type: 'value',
            name: '提成',
            position: 'left',
            axisLabel: {
              formatter: '{value} 元'
            }
          },
          {
            type: 'value',
            name: '销售',
            position: 'right',
            axisLabel: {
              formatter: '{value} 元'
            }
          }
        ],
        series: [
          {
            name: '提成',
            type: 'line',
            yAxisIndex: 0,
            areaStyle: {
              color: '#00CED1',
              opacity: 0.5
            },
            data: this.saleYmlmoneyList
          },
          {
            name: '销售',
            type: 'line',
            yAxisIndex: 1,
            areaStyle: {
              color: '#76EEC6',
              opacity: 0.5
            },
            data: this.saleYmlList
          }
        ]
      })
      this.myChart.setOption(option)
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return 'warning-row'
      } else {
        return 'success-row'
      }
    },
    rowspan () {
      // 每次调用清空数据
      this.spanArr = []
      this.position = 0
      this.saledtlList.forEach((item, index) => {
        if (index === 0) {
          this.spanArr.push(1)
          this.position = 0
        } else {
          if (this.saledtlList[index].rsaid === this.saledtlList[index - 1].rsaid) {
            this.spanArr[this.position] += 1
            this.spanArr.push(0)
          } else {
            this.spanArr.push(1)
            this.position = index
          }
        }
      })
    },
    objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
      if (columnIndex === 1) {
        const _row = this.spanArr[rowIndex]
        const _col = _row > 0 ? 1 : 0
        return {
          rowspan: _row,
          colspan: _col
        }
      }
    },
    handlePrint (row) {
      this.orderBean = row
      this.orderBean.detailList = this.saleList.data
      this.$refs.printSaleDetail.showDialog()
    },
    openSale () {
      this.loading = true
      this.saleYmlList = []
      this.saleYmlmoneyList = []
      this.saleXnameList = []
      this.getList(this.queryParams)
      this.dialogFormVisible = false
    }
  }
}
</script>
