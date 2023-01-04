<template>
 <el-form ref="queryPensonnelParams" :rules="rules" :model="queryPensonnelParams" label-width="80px">
    <el-form-item label="同步ID" prop="synchronousShopId">
      <el-input v-model.number="queryPensonnelParams.synchronousShopId"></el-input>
    </el-form-item>
    <el-form-item label="参照ID" prop="referenceShopId">
      <el-input v-model.number="queryPensonnelParams.referenceShopId"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addInckPensonnelCreate">立即同步</el-button>
      <el-button type="info" @click="reastParams">清除表单</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { addPensonnel } from '../api/index'

export default {
  data () {
    return {
      queryPensonnelParams: {
        synchronousShopId: '',
        referenceShopId: ''
      },
      rules: {
        synchronousShopId: [
          { required: true, message: '请输入同步门店ID' },
          { type: 'number', message: '门店ID必须为数字值' }
        ],
        referenceShopId: [
          { required: true, message: '请输入参照门店ID', trigger: 'blur' },
          { type: 'number', message: '门店ID必须为数字值' }
        ]
      }
    }
  },
  methods: {
    addInckPensonnelCreate () {
      addPensonnel(this.queryPensonnelParams).then((_result) => {
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
      this.queryPensonnelParams.referenceShopId = null
      this.queryPensonnelParams.synchronousShopId = null
    }
  }
}
</script>
