<template>
  <el-container style="height: 900px; border: 1px solid #eee">
    <navigation ref="navigation"></navigation>
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
        <span>{{ titleAddPensonnel }}</span>
      </el-header>
      <el-main>
        <div class="demo-input-size">
          <el-card shadow="hover" :body-style="{ padding: '3px 3px 3px 3px' }">
            <el-input size="medium" placeholder="请输入新门店ID（示例:16410）" suffix-icon="el-icon-user"
              v-model="queryPensonnelParams.synchronousShopId">
              <template slot="prepend">同步门店ID</template>
            </el-input>
          </el-card>
          <el-card shadow="hover" :body-style="{ padding: '3px 3px 3px 3px' }">
            <el-input size="medium" placeholder="请输入旧门店ID（示例:32）" suffix-icon="el-icon-circle-plus"
              v-model="queryPensonnelParams.referenceShopId">
              <template slot="prepend">参照门店ID</template>
            </el-input>
          </el-card>
        </div>
        <el-row>
          <el-card shadow="hover" :body-style="{ padding: '2px' }">
            <el-button size="small" type="danger" icon="el-icon-close"/>
            <el-button size="small" type="primary" icon="el-icon-check" @click="dialogVisible = true"/>
          </el-card>
          <el-dialog title="仔细确认两个参数值是否正确?" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-card class="box-card" style="padding: 15px 20px">
              <el-row :gutter="24">
                <el-col :span="24">
                  <div class="grid-content">同步门店ID：<b>{{ queryPensonnelParams.synchronousShopId }}</b></div>
                </el-col>
                <el-col :span="24">
                  <div class="grid-content">参照门店ID：<b>{{ queryPensonnelParams.referenceShopId }}</b></div>
                </el-col>
              </el-row>
            </el-card>
            <span slot="footer" class="dialog-footer">
              <el-button size="small" type="danger" icon="el-icon-close" @click="dialogVisible = false" circle/>
              <el-button size="small" type="primary" icon="el-icon-check" @click="addInckPensonnelStart" circle/>
            </span>
          </el-dialog>
        </el-row>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>

.el-select .el-input {
  width: 130px;
}

.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

#copyright{
  color: rgb(0, 0, 0);
  position: absolute;
  top: 97%;
  left: 45%;
}

</style>

<script>
import { addPensonnel } from '../api/index'
import navigation from './navigation.vue'

export default {
  components: {
    navigation
  },
  data () {
    return {
      dialogVisible: false,
      titleAddPensonnel: '人员创建角色同步',
      queryPensonnelParams: {
        synchronousShopId: '',
        referenceShopId: ''
      }
    }
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    addInckPensonnelStart () {
      this.dialogVisible = false
      addPensonnel(this.queryPensonnelParams).then((_result) => {
        this.dialogFormVisible = false
        if (_result.data.code === 200) {
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
    }
  }
}
</script>
