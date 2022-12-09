<template>
  <el-container style="height: 900px; border: 1px solid #eee">
    <navigation ref="navigation"></navigation>
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
        <span>{{ titleAddPensonnelExcel }}</span>
        <el-link type="primary" :underline="false">
          <a target="_blank" href="http://192.168.10.87:8520/saleWeb/pubEmployee/excel/template"
            download="数据上传模板">下载模板</a>
        </el-link>
      </el-header>
      <el-main>
        <template>
          <div>
            <el-upload style="display: inline-block" action="string" :limit="1" :file-list="fileList"
              :on-error="loadFileError" :on-success="loadFileSuccess" :before-upload="beforeUpload" accept=".xlsx,.xls"
              :show-file-list="true" :http-request="uploadFile">
              <el-button type="primary">上传<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-upload>
          </div>
        </template>
        <el-divider content-position="center">当前上传表解析数据</el-divider>
        <el-table :data="employeeList" height="650px">
          <el-table-column prop="feedbackMsg" label="反馈结果" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="employeename" label="姓名" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="opcode" label="首拼" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="pinyin" label="全拼" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="sex" label="性别" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="deptid" label="部门ID" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="usestatus" label="使用状态" :formatter="isUseStatus" align="center"
            :show-overflow-tooltip="true" />
          <el-table-column prop="roleid" label="角色ID" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="rolename" label="角色名称" align="center" :show-overflow-tooltip="true" />
        </el-table>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import {excel2Table} from '../api/index'
import navigation from './navigation.vue'

export default {
  components: {
    navigation
  },
  data () {
    return {
      titleAddPensonnelExcel: 'excel英克人员导入',
      // 上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]
      fileList: [],
      // 允许上传次数（不刷新页面情况下）
      limitUpload: 100,
      employeeList: [
        {'employeeid': null, 'opcode': 'TYX', 'employeename': '唐易新111', 'pinyin': 'TANGYIXIN', 'deptid': 65, 'sex': '女', 'usestatus': 0, 'roleid': 184, 'rolename': '门店营业员', 'feedbackMsg': '人员表存在1条未创建'}
      ]
    }
  },
  methods: {
    // 导入失败，其中$message为elementui的消息提醒组件
    loadFileError () {
      this.$message({
        message: '文件上传失败!',
        type: 'error'
      })
    },
    loadFileSuccess () {
      this.$message({
        message: '文件上传成功!',
        type: 'success'
      })
    },
    beforeUpload (file) {
      const extension = file.name.split('.')[1] === 'xls'
      const extension2 = file.name.split('.')[1] === 'xlsx'
      const isLt50M = file.size / 1024 / 1024 < 50
      if (!extension && !extension2) {
        this.$message({
          message: '上传模板只能是 xls、xlsx格式!',
          type: 'error'
        })
      }
      if (!isLt50M) {
        this.$message({
          message: '上传模板大小不能超过 50MB!',
          type: 'error'
        })
      }
      return extension || extension2 || isLt50M
    },
    uploadFile (param) {
      excel2Table(param).then((res) => {
        if (res.data.code === 200) {
          this.employeeList = res.data.data
          this.$message({
            message: res.data.msg,
            type: 'success',
            center: true
          })
        } else {
          this.$message({
            showClose: true,
            center: true,
            message: res.data.msg,
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
    isUseStatus (row, index) {
      if (row.usestatus === 1) {
        return '启用'
      } else if (row.usestatus === 0) {
        return '未启用'
      }
    }
  }
}
</script>

<style>

</style>
