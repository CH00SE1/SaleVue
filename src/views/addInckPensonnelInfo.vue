<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <navigation ref="navigation"></navigation>
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
        <span>{{ titleAddPensonnel }}</span>
      </el-header>
      <el-main>
        <div class="demo-input-size">
          <el-card shadow="hover" :body-style="{ padding: '5px 5px 5px 5px' }">
            <el-input size="medium" placeholder="请输入新门店ID(eg:16410)" suffix-icon="el-icon-user"
              v-model="queryPensonnelParams.newShopId">
              <template slot="prepend">新门店ID</template>
            </el-input>
          </el-card>
          <el-card shadow="hover" :body-style="{ padding: '5px 5px 5px 5px' }">
            <el-input size="medium" placeholder="请输入旧门店ID(eg:32)" suffix-icon="el-icon-circle-plus"
              v-model="queryPensonnelParams.oldShopId">
              <template slot="prepend">旧门店ID</template>
            </el-input>
          </el-card>
        </div>
        <el-row>
          <el-card shadow="hover" :body-style="{ padding: '17px 160px' }">
            <el-button type="primary" round @click="dialogVisible = true">执行</el-button>
            <el-button type="danger" round>取消</el-button>
          </el-card>
          <el-dialog title="仔细确认两个参数值是否正确?" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-card class="box-card" style="padding: 15px 20px">
              <el-row :gutter="24">
                <el-col :span="24">
                  <div class="grid-content">新门店ID：<b>{{ queryPensonnelParams.newShopId }}</b></div>
                </el-col>
                <el-col :span="24">
                  <div class="grid-content">旧门店ID：<b>{{ queryPensonnelParams.oldShopId }}</b></div>
                </el-col>
              </el-row>
            </el-card>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addInckPensonnelStart">确 定</el-button>
            </span>
          </el-dialog>
        </el-row>
      </el-main>
    </el-container>
    <div id="copyright">copyright © 刘少雄</div>
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
      titleAddPensonnel: '新旧门店人员工号角色同步',
      queryPensonnelParams: {
        newShopId: '',
        oldShopId: ''
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
