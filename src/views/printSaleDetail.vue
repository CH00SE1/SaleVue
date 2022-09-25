<template>
  <el-dialog width="50%" :visible.sync="dialogVisible">
    <div id="printStickerView" style="width: 100%">
      <div>
        <el-card class="box-card" style="padding: 15px 20px">
          <div slot="header" class="clearfix">
            <el-card class="box-card" style="padding: 15px 20px">
              <span><b> #### 个 人 销 售 #### </b></span>
            </el-card>
          </div>
          <div>
            <el-row :gutter="24">
              <el-col :span="8">
                <div class="grid-content">营业员：<b>{{ orderBean.name }}</b></div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">总提成：{{ orderBean.sum_fl_money }}</div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content">总销售：{{ orderBean.sum_money }}</div>
              </el-col>
            </el-row>
          </div>
          <div v-for="(item, index) in orderBean.fl" :id="'printDiv' + index" :key="index"
            style="page-break-after: always; padding-top: 30px">
            <el-row type="flex" justify="center">
              <el-col :span="10">
                <div class="lightgreen-box">{{ index }}类：{{ item }}</div>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="printView">打 印</el-button>
    </span>
  </el-dialog>
</template>

<script>
import printJS from 'print-js'
import 'print-js/dist/print.css'

export default {
  name: 'printSaleDetail',
  props: {
    orderBean: Object
  },
  methods: {
    printView () {
      printJS({
        printable: 'printStickerView',
        documentTitle: '销售',
        type: 'html',
        headerStyle: 'text-align:center;color:#f00;width:100%;border:1px #000 solid;',
        targetStyles: ['*']
      })
    },
    showDialog () {
      this.dialogVisible = true
    }
  },
  data () {
    return {
      dialogVisible: false
    }
  }
}
</script>
