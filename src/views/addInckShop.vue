<template>
  <el-form ref="queryShopParams" :rules="rules" :model="queryShopParams" label-width="80px">
    <el-form-item label="人员工号" prop="operaterId">
      <el-input v-model.number="queryShopParams.operaterId"></el-input>
    </el-form-item>
    <el-form-item label="门店名称" prop="shopName">
      <el-input v-model="queryShopParams.shopName"></el-input>
    </el-form-item>
    <el-form-item label="门店区域" prop="areaId">
      <el-select v-model.number="queryShopParams.areaId" placeholder="请选择活动区域">
        <el-option v-for='(item, index) in options' :key='index' :label="item.areaname"
          :value="item.areadocid"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addInckShopCreate">立即创建</el-button>
      <el-button type="info" @click="reastParams">清除表单</el-button>
    </el-form-item>
  </el-form>
</template>

<script>

import { addInckShop, shopAreaList } from '../api/index'

export default {
  data () {
    return {
      options: [],
      titieAddShop: '英克门店新增',
      queryShopParams: {
        operaterId: '',
        shopName: '',
        areaId: ''
      },
      rules: {
        operaterId: [
          { required: true, message: '请输入英克人员工号ID' },
          { type: 'number', message: '人员ID必须为数字值' }
        ],
        areaId: [
          { type: 'number', message: '门店区域ID必须为数字值' }
        ],
        shopName: [
          { required: true, message: '请输入英克门店名称', trigger: 'blur' },
        ]
      }
    }
  },
  created () {
    this.getshopAreaList()
  },
  methods: {
    getshopAreaList () {
      shopAreaList().then((_result) => {
        this.options = _result.data
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '获取门店区域分类后端接口连接异常',
          type: 'error'
        })
      })
    },
    addInckShopCreate () {
      addInckShop(this.queryShopParams).then((_result) => {
        this.dialogFormVisible = false
        if (_result.data.code === 200) {
          this.reastParams()
          this.$message({
            showClose: true,
            message: _result.data.msg,
            type: 'success'
          })
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
    reastParams () {
      this.queryShopParams.operaterId = null
      this.queryShopParams.areaId = null
      this.queryShopParams.shopName = null
    }
  }
}
</script>
