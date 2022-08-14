<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']" :router="true" :disabled="true">
        <el-button type="text" @click="dialogFormVisible = true">更改查询条件</el-button>
        <el-dialog title="查询信息" :visible.sync="dialogFormVisible">
          <el-form :model="queryParams">
            <el-form-item label="时间范围" :label-width="formLabelWidth">
              <el-input v-model="queryParams.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="门店ID" :label-width="formLabelWidth">
              <el-input v-model="queryParams.shopId" autocomplete="off"></el-input>
            </el-form-item>
            <template>
              <el-select v-model="queryParams.title" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
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
        统计门店各分类品种销售信息
      </el-header>
      <el-main>
        <template>
          <!-- echarts -->
          <div class="el-row-report">
            <el-row>
              <el-col class="el-col-report">
                <div id="main"></div>
              </el-col>
              <el-col class="el-col-report">
                <div id="main_pie"></div>
              </el-col>
            </el-row>
          </div>
        </template>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {queryFlNameDay} from '../api/index.js'
import * as echarts from 'echarts'

export default {
  data () {
    return {
      options: [{
        value: 'day',
        label: '今天'
      }, {
        value: 'yesterday',
        label: '昨天'
      }, {
        value: 'month',
        label: '本月'
      }, {
        value: 'lastmonth',
        label: '上月'
      }, {
        value: 'year',
        label: '今年'
      }],
      // 图表实列化
      myChart: '',
      // x轴数据名字
      saleXnameList: ['许晓晴', '高辉', '吴湘媚', '杨红梅', '贺嘉馨', '郑芳芳', '孙其全', '沈凤群', '系统管理员', '王宏兵'],
      saleXFlList: [ '黄金单品', 'A', 'B', 'C', 'D', 'E' ],
      saleYdateList: [],
      saleYSqtylist: [],
      saleYMoneylist: [],
      tmpList: [],
      list: [],
      dialogFormVisible: false,
      formLabelWidth: '120px',
      queryParams: {
        title: 'day',
        shopId: '32'
      }
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
    this.getList()
    this.getPieList()
  },
  methods: {
    getList () {
      queryFlNameDay(this.queryParams.title, this.queryParams.shopId).then((_result) => {
        this.saleYMoneylist = []
        this.saleYSqtylist = []
        this.list = _result.data.data
        // 循环处理数据
        for (var num = 0; num < this.saleXFlList.length; num++) {
          var dataNumber = 0
          var dataMoney = 0
          for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].fl === this.saleXFlList[num]) {
              dataNumber += this.list[i].goodsqty
              dataMoney += this.list[i].realmoney
            }
          }
          this.saleYSqtylist.push(dataNumber)
          this.saleYMoneylist.push(dataMoney)
        }
        this.drawpie('main_pie')
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '后端接口连接异常',
          type: 'error'
        })
      })
    },
    getPieList () {
      return function inieEcharts () {
        let newPromise = new Promise((resolve) => {
          resolve()
        })
        newPromise.then(() => {
          this.drawpie('main_pie')
        })
      }
    },
    drawLine (id) {
      // 初始化图标信息
      if (this.myChart !== null && this.myChart !== '' && this.myChart !== undefined) {
        this.myChart.dispose()
      }
      this.myChart = echarts.init(document.getElementById(id), 'dark', {width: 600, height: 400})
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
          data: this.saleXFlList
        },
        yAxis: [
          {
            type: 'value',
            name: '数值',
            position: 'left',
            axisLabel: {
              formatter: '{value} 个'
            }
          },
          {
            type: 'value',
            name: '金额',
            position: 'right',
            axisLabel: {
              formatter: '{value} 元'
            }
          }
        ],
        series: [
          {
            name: this.queryParams.shopId + '-' + this.queryParams.title + '销售数量',
            type: 'line',
            yAxisIndex: 0,
            data: this.saleYSqtylist
          },
          {
            name: this.queryParams.shopId + '-' + this.queryParams.title + '销售金额',
            type: 'line',
            // smooth: true,
            yAxisIndex: 1,
            data: this.saleYMoneylist
          }
        ]
      })
      this.myChart.setOption(option)
    },
    drawpie (id) {
      // 初始化图标信息
      if (this.myChart !== null && this.myChart !== '' && this.myChart !== undefined) {
        this.myChart.dispose()
      }
      this.myChart = echarts.init(document.getElementById(id), null, {width: 600, height: 400})
      const option = ({
        series: [{
          type: 'pie',
          data: [
            {
              value: 100,
              name: 'A'
            },
            {
              value: 200,
              name: 'B'
            },
            {
              value: 300,
              name: 'C'
            },
            {
              value: 400,
              name: 'D'
            },
            {
              value: 500,
              name: 'E'
            }
          ],
          roseType: 'area'
        }]
      })
      this.myChart.setOption(option)
    },
    openTitle () {
      this.dialogFormVisible = false
      this.getList()
    }
  }
}
</script>

<style>
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}
.el-aside {
  color: #333;
}
#main {
  width: 100%;
  height: 100%;
}
#main_pie {
  width: 100%;
  height: 100%;
}
.el-row-report {
  width: 100%;
  height: auto;
  display: flex;
}
.el-col-report {
  height: 300px;
  margin-top: 10px;
  margin-right: 20px;
  flex: 1;
}
</style>
