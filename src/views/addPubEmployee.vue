<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="姓名" prop="employeename">
      <el-input v-model="ruleForm.employeename"></el-input>
    </el-form-item>
    <el-form-item label="性别" prop="sex">
      <el-select v-model="ruleForm.sex" placeholder="请选择性别" style="width:100%">
        <el-option label="男" value="男"></el-option>
        <el-option label="女" value="女"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="门店" prop="deptid">
      <el-select v-model="ruleForm.deptid" filterable placeholder="请选择门店" style="width:100%">
        <el-option v-for="(item, index) in shopList" :key="index" :label="item.placepointname"
          :value="item.placepointid"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="角色" prop="roleid">
      <el-select v-model="ruleForm.roleid" filterable placeholder="请选择角色" style="width:100%">
        <el-option v-for='(item, index) in roleList' :key='index' :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="备注" prop="medical">
      <el-input type="textarea" v-model="ruleForm.medical"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="submitForm('ruleForm')" type="primary" icon="el-icon-check" circle></el-button>
      <el-button @click="resetForm('ruleForm')" type="danger" icon="el-icon-close" circle></el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { getPlacePointInfo, addPubEmployee } from '../api/index'

export default {
  data () {
    return {
      shopList: [],
      roleList: [{value: '10', label: '门店店长'}, {value: '184', label: '门店营业员'}, {value: '174', label: '门店店长助理'}, {value: '175', label: '门店西药采购(请货)员'}, {value: '177', label: '门店西药验收员'}, {value: '181', label: '门店西药审方员'}, {value: '179', label: '门店西药陈列检查员'}, {value: '176', label: '门店中药采购(请货)员'}, {value: '182', label: '门店中药审方员'}, {value: '186', label: '门店中药调剂员'}, {value: '183', label: '门店质量负责人（中药）'}, {value: '186', label: '门店质量负责人（中药）'}, {value: '180', label: '门店中药陈列检查员'}, {value: '178', label: '门店中药验收员'}, {value: '11', label: '连锁采购员'}, {value: '2146', label: 'DTP医保开票员'}, {value: '708', label: '特门医保开票员'}, {value: '826', label: '门店医保'}],
      ruleForm: {
        employeename: '',
        sex: '',
        deptid: '',
        roleid: '',
        medical: ''
      },
      rules: {
        employeename: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 3, message: '长度在 2 到 3 个字符', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        deptid: [
          { required: true, message: '请选择门店', trigger: 'change' }
        ],
        roleid: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        medical: [
          { required: true, message: '请填写备注', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getShopInfo()
  },
  methods: {
    save () {
      // 创建人员
      addPubEmployee(this.ruleForm).then((_result) => {
        this.$message({
          showClose: true,
          message: _result.data.msg,
          type: 'success'
        })
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '保存失败',
          type: 'error'
        })
      })
    },
    getShopInfo () {
      getPlacePointInfo().then((_result) => {
        this.shopList = _result.data
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '获取门店列表失败',
          type: 'error'
        })
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$message({
            showClose: true,
            message: this.ruleForm,
            type: 'success'
          })
          this.save()
        } else {
          this.$message({
            showClose: true,
            message: '保存失败',
            type: 'error'
          })
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>

</style>
