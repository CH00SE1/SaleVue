<template>
  <el-container style="height: 800px; border: 1px solid #eee">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
      <el-menu :default-openeds="['1', '3']" :router="true" :disabled="true">
        <el-submenu index="1">
          <template slot="title"><i class="el-icon-message"></i>英克操作</template>
          <el-menu-item-group>
            <el-menu-item index="/mac">请求表操作</el-menu-item>
            <el-menu-item index="/usemac">使用表操作</el-menu-item>
            <el-menu-item index="/pengingOrder">挂单管理</el-menu-item>
            <el-menu-item index="/addInckInfo">门店-人员创建</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <div id="shop">
        <el-card class="box-card">
          <el-header style="text-align: center; font-size: 30px">
            <span>{{ titieAddShop }}</span>
          </el-header>
          <el-main>
            <div class="demo-input-size">
              <el-input size="medium" placeholder="请输入英克人员id(eg:15700)" suffix-icon="el-icon-user"
                v-model="queryShopParams.operaterId">
                <template slot="prepend">英克人员ID</template>
              </el-input>
              <el-input size="medium" placeholder="请输入门店名称(eg:湖南达嘉维康医药产业股份有限公司XXX店)" suffix-icon="el-icon-circle-plus"
                v-model="queryShopParams.shopName">
                <template slot="prepend">门店名称</template>
              </el-input>
            </div>
            <el-row>
              <el-button type="primary" round @click="dialogVisible = true">提交</el-button>
              <el-button type="danger" round>取消</el-button>
              <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
                <span> 人员ID:{{queryShopParams.operaterId}} </span>
                <span> 门店名称:{{queryShopParams.shopName}} </span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="addInckShopStart">确 定</el-button>
                </span>
              </el-dialog>
            </el-row>
          </el-main>
        </el-card>
      </div>
      <div id="pensonnel">
        <el-card class="box-card">
          <el-header style="text-align: center; font-size: 30px">
            <span>{{ titleAddPensonnel }}</span>
          </el-header>
          <el-main>
            <div class="demo-input-size">
              <el-input size="medium" placeholder="请输入新门店ID(eg:16410)" suffix-icon="el-icon-user"
                v-model="queryPensonnelParams.newShopId">
                <template slot="prepend">新门店ID</template>
              </el-input>
              <el-input size="medium" placeholder="请输入旧门店ID(eg:32)" suffix-icon="el-icon-circle-plus"
                v-model="queryPensonnelParams.oldShopId">
                <template slot="prepend">旧门店ID</template>
              </el-input>
            </div>
            <el-row>
              <el-button type="primary" round @click="dialogVisible = true">提交</el-button>
              <el-button type="danger" round>取消</el-button>
              <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
                <span> 新门店ID:{{queryPensonnelParams.newShopId}} </span>
                <span> 旧门店ID:{{queryPensonnelParams.oldShopId}} </span>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary" @click="addInckPensonnelStart">确 定</el-button>
                </span>
              </el-dialog>
            </el-row>
          </el-main>
        </el-card>
      </div>
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
</style>

<script>
import { addInckShop, addPensonnel } from '../api/index'

export default {
  data () {
    return {
      dialogVisible: false,
      titieAddShop: '英克门店新增',
      titleAddPensonnel: '新旧门店人员工号角色同步',
      queryShopParams: {
        operaterId: '',
        shopName: ''
      },
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
    addInckShopStart () {
      addInckShop(this.queryShopParams).then((_result) => {
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
      this.dialogFormVisible = false
    },
    addInckPensonnelStart () {
      addPensonnel(this.queryPensonnelParams).then((_result) => {
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
      this.dialogFormVisible = false
    }
  }
}
</script>
