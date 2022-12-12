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
            <el-form :model="queryParams" :inline="true" label-width="80px">
              <el-form-item label="门店ID" prop="shopId">
                <el-input v-model="queryParams.deptid" placeholder="请输入门店ID" clearable size="small" style="width: 160px"
                  @keyup.enter.native="handleQuery" />
              </el-form-item>
              <el-form-item label="人员ID" prop="employeeid">
                <el-input v-model="queryParams.employeeid" placeholder="请输入门店ID" clearable size="small"
                  style="width: 160px" @keyup.enter.native="handleQuery" />
              </el-form-item>
              <el-form-item label="人员名称" prop="employeename">
                <el-input v-model="queryParams.employeename" placeholder="请输入门店ID" clearable size="small"
                  style="width: 160px" @keyup.enter.native="handleQuery" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button type="success" icon="el-icon-circle-plus" size="mini"
                  @click="dialogRoleVisible = true">批量人员角色添加</el-button>
                <el-button type="success" icon="el-icon-folder-add" size="mini"
                  @click="dialogAuthVisible = true">批量特殊功能授权</el-button>
                <el-button type="info" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
            <el-divider content-position="center">人员信息数据展示</el-divider>
            <template>
              <el-table height="650" :data="employeeList" @selection-change="handleSelectionChange">
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
                <el-table-column prop="phone" label="电话号码" align="center"
                  :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="roleid" label="权限ID" align="center"
                  :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="rolename" label="权限名称" align="center"
                  :show-overflow-tooltip="true"></el-table-column>
                <el-table-column prop="medical" label="健康状态" align="center"
                  :show-overflow-tooltip="true"></el-table-column>
              </el-table>
              <div class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                  :page-sizes="[10, 15, 20, 50, 100, 200, 500, 1000]" :page-size="queryParams.pageSize"
                  layout="total, sizes, prev, pager, next, jumper" :total="total">
                </el-pagination>
              </div>
            </template>
            <el-dialog title="批量特殊功能授权" :visible.sync="dialogAuthVisible" width="30%" :before-close="handleClose">
              <template>
                <el-select multiple collapse-tags v-model='selectedArray' @change='changeAuthSelect' style="width:60%" placeholder='请选择功能'>
                  <el-checkbox v-model="checked" @change='selectAuthAll'>全选</el-checkbox>
                  <el-option v-for='(item, index) in authList' :key='index' :label="item.specialauthname"
                    :value="item.specialauthid"></el-option>
                </el-select>
              </template>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAuthVisible = false">取 消</el-button>
                <el-button type="primary" @click="addAuth">确 定</el-button>
              </span>
            </el-dialog>
            <el-dialog title="批量人员角色添加" :visible.sync="dialogRoleVisible" width="30%" :before-close="handleClose">
              <template>
                <el-select multiple collapse-tags v-model='selectedArray' @change='changeRoleSelect' style="width:60%" placeholder='请选择角色'>
                  <el-checkbox v-model="checked" @change='selectRoleAll'>全选</el-checkbox>
                  <el-option v-for='(item, index) in roleList' :key='index' :label="item.label"
                    :value="item.value"></el-option>
                </el-select>
              </template>
              <span slot="footer" class="dialog-footer">
                <el-button @click="dialogAuthVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
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
      roleList: [{value: '10', label: '门店店长'}, {value: '184', label: '门店营业员'}, {value: '174', label: '门店店长助理'}, {value: '175', label: '门店西药采购(请货)员'}, {value: '177', label: '门店西药验收员'}, {value: '181', label: '门店西药审方员'}, {value: '179', label: '门店西药陈列检查员'}, {value: '176', label: '门店中药采购(请货)员'}, {value: '182', label: '门店中药审方员'}, {value: '186', label: '门店中药调剂员'}, {value: '183', label: '门店质量负责人（中药）'}, {value: '186', label: '门店质量负责人（中药）'}, {value: '180', label: '门店中药陈列检查员'}, {value: '178', label: '门店中药验收员'}],
      checked: false,
      selectedArray: [],
      dialogAuthVisible: false,
      dialogRoleVisible: false,
      title: '特殊功能授权',
      total: null,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        deptid: null,
        employeeid: null,
        employeename: null
      },
      addAuthVo: {
        personnels: [],
        roles: [],
        authids: []
      }
    }
  },
  created () {
    this.getList()
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
          this.employeeList = _result.data.data.rows
          this.total = _result.data.data.total
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
      this.queryParams.pageNum = 1
      this.getList()
    },
    resetQuery () {
      this.queryParams.deptid = null
      this.queryParams.employeeid = null
      this.queryParams.employeename = null
      this.getList()
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
    selectAuthAll () {
      this.selectedArray = []
      if (this.checked) {
        this.authList.map((item) => {
          this.selectedArray.push(item.specialauthid)
        })
      } else {
        this.selectedArray = []
      }
    },
    changeAuthSelect (val) {
      if (val.length === this.authList.length) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
    addAuth () {
      this.addAuthVo.authids = this.selectedArray
      this.addAuthVo.personnels = this.multipleSelection
      if (this.addAuthVo.authids.length === 0 | this.addAuthVo.personnels.length === 0) {
        this.$message({
          showClose: true,
          message: '没有勾选任何特殊功能 | 没有勾选任何人员',
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
      this.dialogAuthVisible = false
      this.selectedArray = []
    },
    selectRoleAll () {
      this.selectedArray = []
      if (this.checked) {
        this.roleList.map((item) => {
          this.selectedArray.push(item.value)
        })
      } else {
        this.selectedArray = []
      }
    },
    changeRoleSelect (val) {
      if (val.length === this.roleList.length) {
        this.checked = true
      } else {
        this.checked = false
      }
    },
    addRole () {
      this.addAuthVo.roles = this.selectedArray
      this.addAuthVo.personnels = this.multipleSelection
      if (this.addAuthVo.roles.length === 0 | this.addAuthVo.personnels.length === 0) {
        this.$message({
          showClose: true,
          message: '没有勾选任何人员角色 | 没有勾选任何人员',
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
      this.dialogRoleVisible = false
      this.selectedArray = []
    },
    handleSizeChange (val) {
      // 更新每页条数
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      // 更新当前页码
      this.queryParams.pageNum = val
      this.getList()
    }
  }
}

</script>
