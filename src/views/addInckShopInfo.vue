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
            <el-menu-item index="/addInckShopInfo">门店创建</el-menu-item>
            <el-menu-item index="/addInckPensonnelInfo">人员创建</el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
        <span>{{ titieAddShop }}</span>
      </el-header>
      <el-main>
        <div class="demo-input-size">
          <el-card shadow="hover" :body-style="{ padding: '5px 5px 5px 5px' }">
            <el-input size="medium" placeholder="请输入英克人员id(eg:15700)" suffix-icon="el-icon-user"
              v-model="queryShopParams.operaterId">
              <template slot="prepend">英克人员ID</template>
            </el-input>
          </el-card>
          <el-card shadow="hover" :body-style="{ padding: '5px 5px 5px 5px' }">
            <el-input size="medium" placeholder="请输入门店名称(eg:湖南达嘉维康医药产业股份有限公司XXX店)" suffix-icon="el-icon-circle-plus"
              v-model="queryShopParams.shopName">
              <template slot="prepend">门店名称</template>
            </el-input>
          </el-card>
          <el-card>
            <template>
              <el-select v-model="queryShopParams.areaId" placeholder="选择门店区域类型">
                <el-option v-for="item in options" :key="item.areadocid" :label="item.areaname" :value="item.areadocid">
                  <span style="float: left; color: #5686bf; font-size: 15px">{{ item.areaname }}</span>
                  <span style="float: right; color: #FF0000; font-size: 15px">{{ item.areadocid }}</span>
                </el-option>
              </el-select>
            </template>
          </el-card>
        </div>
        <el-row>
          <el-card shadow="hover" :body-style="{ padding: '17px 160px' }">
            <el-button type="primary" round @click="dialogVisible = true">执行</el-button>
            <el-button type="danger" round>取消</el-button>
          </el-card>
          <el-dialog title="仔细确认三个参数值是否正确?" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <span style="float: left; color: #007d65; font-size: 15px; font-weight: bold;">人员ID:{{
            queryShopParams.operaterId }}</span>
            <span style="float: center; color: #d71345; font-size: 15px; font-weight: bold;">门店名称:{{
            queryShopParams.shopName }}</span>
            <span style="float: right; color: #426ab3; font-size: 15px; font-weight: bold;">区域ID:{{
            queryShopParams.areaId }}</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addInckShopStart">确 定</el-button>
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
import { addInckShop, shopAreaList } from '../api/index'

export default {
  data () {
    return {
      options: [],
      dialogVisible: false,
      titieAddShop: '英克门店新增模块',
      queryShopParams: {
        operaterId: '',
        shopName: '',
        areaId: ''
      }
    }
  },
  created () {
    this.getshopAreaList()
  },
  methods: {
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    getshopAreaList () {
      shopAreaList().then((_result) => {
        this.options = _result.data
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '分组获取门店区域分类后端接口连接异常',
          type: 'error'
        })
      })
    },
    addInckShopStart () {
      this.dialogVisible = false
      addInckShop(this.queryShopParams).then((_result) => {
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
