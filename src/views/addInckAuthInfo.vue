<template>
  <el-container style="height: 900px; border: 1px solid #eee">
    <navigation ref="navigation"></navigation>
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
        <span>{{ title }}</span>
      </el-header>
      <el-main>
        <template>
          <div class="app-container">
            <el-form :model="queryParams" :inline="true" label-width="150px">
              <el-form-item label="门店ID" prop="shopId">
                <el-input v-model="queryParams.deptid" placeholder="请输入门店ID" clearable size="small" style="width: 160px"
                  @keyup.enter.native="handleQuery" />
              </el-form-item>
              <el-form-item label="人员ID" prop="employeeid">
                <el-input v-model="queryParams.employeeid" placeholder="请输入门店ID" clearable size="small" style="width: 160px"
                  @keyup.enter.native="handleQuery" />
              </el-form-item>
              <el-form-item label="人员名称" prop="employeename">
                <el-input v-model="queryParams.employeename" placeholder="请输入门店ID" clearable size="small" style="width: 160px"
                  @keyup.enter.native="handleQuery" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button type="success" icon="el-icon-folder-add" size="mini"
                  @click="dialogVisible = true">批量特殊功能授权</el-button>
                <el-button type="info" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
            <el-table :data="employeeList" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column prop="employeeid" label="人员ID" align="center" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column prop="employeename" label="人员名称" align="center"
                :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="sex" label="性别" align="center" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="deptid" label="门店ID" align="center"
                :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="usestatus" label="使用状态" align="center" :formatter="isUseStatus"
                :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="phone" label="电话号码" align="center" :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="roleid" label="权限ID" align="center"
                :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="rolename" label="权限名称" align="center"
                :show-overflow-tooltip="true"></el-table-column>
              <el-table-column prop="medical" label="健康状态" align="center"
                :show-overflow-tooltip="true"></el-table-column>
            </el-table>
            <el-dialog title="批量授权" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
              <template>
                <el-select multiple collapse-tags v-model='selectedArray' @change='changeSelect' placeholder='请选择角色'>
                  <el-checkbox v-model="checked" @change='selectAll'>全选</el-checkbox>
                  <el-option v-for='(item, index) in authList' :key='index' :label="item.specialauthname" :value="item.specialauthid"></el-option>
                </el-select>
              </template>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAuth">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </template>
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-checkbox {
  text-align: right;
  width: 100%;
  padding-right: 10px;
}
</style>

<script>
import navigation from './navigation.vue'
import { pubEmployeeList, authList, addAuthPersonnelInfo } from '../api/index'

export default {
  components: {
    navigation
  },
  data () {
    return {
      multipleSelection: [],
      employeeList: [],
      authList: [],
      checked: false,
      selectedArray: [],
      dialogVisible: false,
      title: '特殊功能授权',
      queryParams: {
        deptid: null,
        employeeid: null,
        employeename: null
      },
      addAuthVo: {
        authids: [],
        personnels: []
      }
    }
  },
  created () {
    this.getAuthInfoList()
  },
  methods: {
    getAuthInfoList () {
      authList().then((_result) => {
        this.authList = _result.data
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '获取特殊权限列表失败',
          type: 'error'
        })
      })
    },
    getList () {
      pubEmployeeList(this.queryParams).then((_result) => {
        if (_result.data.code === 200) {
          this.employeeList = _result.data.data
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
    handleQuery () {
      this.getList()
    },
    resetQuery () {
      this.queryParams.deptid = null
    },
    selectSet () {
      this.$message({
        showClose: true,
        message: null,
        type: 'error'
      })
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    isUseStatus (row, index) {
      if (row.usestatus === 1) {
        return '启用'
      } else if (row.usestatus === 0) {
        return '停用'
      }
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    selectAll () {
      this.selectedArray = []
      if (this.checked) {
        this.authList.map((item) => {
          this.selectedArray.push(item.specialauthid)
        })
      } else {
        this.selectedArray = []
      }
    },
    changeSelect (val) {
      if (val.length === this.authList.length) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
    addAuth () {
      this.addAuthVo.authids = this.selectedArray
      this.addAuthVo.personnels = this.multipleSelection
      if (this.addAuthVo.authids.length === 0) {
        this.$message({
          showClose: true,
          message: '没有勾选任何特殊功能',
          type: 'error'
        })
      } else {
        addAuthPersonnelInfo(this.addAuthVo).then((_result) => {
          if (_result.data.code === 200) {
            this.$message({
              showClose: true,
              message: _result.data.msg,
              type: 'success'
            })
          }
        }).catch((_err) => {
          this.$message({
            showClose: true,
            message: '后端接口连接异常',
            type: 'error'
          })
        })
      }
      this.dialogVisible = false
      this.selectedArray = []
    }
  }
}

</script>
