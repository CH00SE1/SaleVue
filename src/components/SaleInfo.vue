<template>
  <div id="app">
    <el-card>
      <!-- 请求参数请按照自己返回数据解析-->
      <div v-for="item in info.data.sales_info_details" :key="item">
        {{ item.name }}
        {{ item.sum_money }}
        {{ item.sum_fl_money }}
        {{ item.fl }}
      </div>
    </el-card>
  </div>
</template>

<script>
</script>

<script>
import axios from "axios";
export default {
  data() {
    return {
      info: null,
    };
  },
  mounted() {
    axios
      .get("http://localhost:8520/sentinel_client_sale/sales/shop/month/32") // 若没有更改index.js配置此处应写全部路径 http://localhost:6062/user/findUser
      .then(
        (response) => (this.info = response.data),
        (reason) => {
          console.log("error");
        }
      );
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
