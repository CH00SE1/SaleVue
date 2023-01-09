<template>
  <el-container style="height: 900px; border: 1px solid #eee">
    <navigation ref="navigation"></navigation>
    <el-container>
      <el-header style="text-align: center; font-size: 30px">
        <span>{{ titieAddShop }}</span>
      </el-header>
      <el-main>
        <el-dialog title="新增英克门店" :visible.sync="dialogInckShopVisible" width="30%" :before-close="handleClose">
          <addInckShopVue ref="addInckShopVue"></addInckShopVue>
        </el-dialog>
        <el-dialog title="同步门店人员" :visible.sync="dialogInckPensonnelVisible" width="30%" :before-close="handleClose">
          <addInckPensonnelInfoVue ref="addInckPensonnelInfoVue"></addInckPensonnelInfoVue>
        </el-dialog>
        <el-button type="danger" icon="el-icon-folder-add" size="small" @click="dialogInckShopVisible = true"
          plain>新增英克门店</el-button>
        <el-button type="success" icon="el-icon-circle-plus" size="small" @click="dialogInckPensonnelVisible = true"
          plain>同步门店人员</el-button>
        <el-divider content-position="center">创建英克门店，同步新建门店人员角色信息数据！</el-divider>
        <el-header style="text-align: left; font-size: 20px">
          <span>
            <el-badge :value="posSize" class="item">门店信息</el-badge>
          </span>
        </el-header>
        <el-table v-loading="loading" :data="poslist" height="640">
          <el-table-column prop="id" label="序列" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="createdAt" label="创建时间" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="updatedAt" label="更新时间" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="posId" label="货架ID" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="shopId" label="门店ID" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="shopName" label="门店名称" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="counterId" label="柜组ID" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="storageId" label="保管账ID" align="center" :show-overflow-tooltip="true" />
          <el-table-column prop="status" label="货架插入状态" :formatter="isStatus" align="center"
            :show-overflow-tooltip="true" />
          <el-table-column prop="employeename" label="创建人员" align="center" :show-overflow-tooltip="true" />
        </el-table>
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
import { posList } from '../api/index'
import addInckPensonnelInfoVue from './addInckPensonnelInfo.vue'
import addInckShopVue from './addInckShop.vue'
import navigation from './navigation.vue'

export default {
  components: {
    navigation,
    addInckPensonnelInfoVue,
    addInckShopVue
  },
  data () {
    return {
      options: [],
      // 操作记录数据
      poslist: [],
      posSize: null,
      titieAddShop: '门店-人员-同步',
      dialogInckShopVisible: false,
      dialogInckPensonnelVisible: false,
      loading: true
    }
  },
  created () {
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
    }
  }
}
</script>
