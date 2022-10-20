<template>
  <el-container style="height: 900px; border: 1px solid #eee">
    <navigation ref="navigation"></navigation>
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
        <span>{{ titieAddShop }}</span>
      </el-header>
      <el-main>
        <div class="demo-input-size">
          <el-card shadow="hover" :body-style="{ padding: '2px 2px 2px 2px' }">
            <el-input size="medium" placeholder="请输入英克人员id(eg:15700)" suffix-icon="el-icon-user"
              v-model="queryShopParams.operaterId">
              <template slot="prepend">英克人员ID</template>
            </el-input>
          </el-card>
          <el-card shadow="hover" :body-style="{ padding: '2px 2px 2px 2px' }">
            <el-input size="medium" placeholder="请输入门店名称(eg:湖南达嘉维康医药产业股份有限公司XXX店)" suffix-icon="el-icon-circle-plus"
              v-model="queryShopParams.shopName">
              <template slot="prepend">门店名称</template>
            </el-input>
          </el-card>
          <el-card shadow="hover" :body-style="{ padding: '3px 3px 3px 3px' }">
            <el-select v-model="queryShopParams.areaId" placeholder="选择门店区域类型">
              <el-option v-for="item in options" :key="item.areadocid" :label="item.areaname" :value="item.areadocid">
                <span style="float: left; color: #5686bf; font-size: 15px">{{ item.areaname }}</span>
                <span style="float: right; color: #FF0000; font-size: 15px">{{ item.areadocid }}</span>
              </el-option>
            </el-select>
          </el-card>
        </div>
        <el-row>
          <el-card shadow="hover" :body-style="{ padding: '2px' }">
            <el-button size="small" type="danger" icon="el-icon-close"/>
            <el-button size="small" type="primary" icon="el-icon-check" @click="dialogVisible = true"/>
          </el-card>
          <el-dialog title="仔细确认三个参数值是否正确?" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
            <el-card class="box-card" style="padding: 15px 20px">
              <el-row :gutter="24">
                <el-col :span="24">
                  <div class="grid-content">人员ID：<b>{{ queryShopParams.operaterId }}</b></div>
                </el-col>
                <el-col :span="24">
                  <div class="grid-content">门店名称：<b>{{ queryShopParams.shopName }}</b></div>
                </el-col>
                <el-col :span="24">
                  <div class="grid-content">区域ID：<b>{{ queryShopParams.areaId }}</b></div>
                </el-col>
              </el-row>
            </el-card>
            <span slot="footer" class="dialog-footer">
              <el-button size="small" type="danger" icon="el-icon-close" @click="dialogVisible = false" circle>
              </el-button>
              <el-button size="small" type="primary" icon="el-icon-check" @click="addInckShopStart" circle></el-button>
            </span>
          </el-dialog>
        </el-row>
        <el-header style="text-align: left; font-size: 25px">
          <span>
            <el-badge :value="posSize" class="item">门店创建日志记录</el-badge>
          </span>
        </el-header>
        <el-table v-loading="loading" :data="poslist" height="450">
          <el-table-column prop="id" label="序列" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="createdAt" label="创建时间" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="updatedAt" label="更新时间" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="posId" label="货架ID" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="shopId" label="门店ID" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="shopName" label="门店名称" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="counterId" label="柜组ID" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="storageId" label="保管账ID" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="status" label="货架插入状态" :formatter="isStatus" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="employeename" label="操作人员" align="center" :show-overflow-tooltip="true" />
        </el-table>
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
import { addInckShop, shopAreaList, posList } from '../api/index'
import navigation from './navigation.vue'

export default {
  components: {
    navigation
  },
  data () {
    return {
      options: [],
      // 操作记录数据
      poslist: [],
      posSize: null,
      dialogVisible: false,
      loading: true,
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
    this.getPosList()
  },
  methods: {
    isStatus (row, index) {
      if (row.status === 1) {
        return '已执行'
      } else if (row.status === 0) {
        return '未执行'
      }
      return '其他'
    },
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
          message: '获取门店区域分类后端接口连接异常',
          type: 'error'
        })
      })
    },
    getPosList () {
      posList().then((_result) => {
        this.poslist = _result.data.data
        this.posSize = this.poslist.length
        this.loading = false
      }).catch((_err) => {
        this.$message({
          showClose: true,
          message: '获取门店创建操作记录后端接口连接异常',
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
          this.getPosList()
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
