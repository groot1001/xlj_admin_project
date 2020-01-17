<template>
  <el-card style="height:238px;margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <samp :style="{'color':theme}">●</samp>
      <span>我的站点</span>
    </div>
    <div class="site_box">
       <a target="_blank" :href="'http://www.23huicai.com/mechanism/default/'+url+'/DEFF'">
      <div class="site_box1">
        <div class="site_box-icon">
          <label for class="iconfont icondiannao"></label>
        </div>
        <p>我的网站</p>
      </div>
       </a>
      <!-- <div class="site_box1">
        <div class="site_box-icon">
          <label for class="iconfont iconshouji"></label>
        </div>
        <p>我的移动站</p>
      </div> -->
    </div>
  </el-card>
</template>

<script>
 import { getToken } from "@/utils/auth";
export default {
  props:{
    url:{
      type: String,
    }
    
  },

    data() {
    return {
      
    };
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  }
};
</script>
<style lang="scss" scoped>
.clearfix {
  color: #212c3d;
  font-size: 14px;
  samp {
    font-size: 8px;
  }
}
.site_box {
  display: flex;
  justify-content: space-around;
  .site_box1 {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    .site_box-icon {
      height: 100px;
      width: 100px;
      border-radius: 100%;
      background-color: #f2f6fe;
      line-height: 100px;
      text-align: center;
      label {
        font-size: 42px;
        color: #2b82fc;
      }
    }
    p{
      color:rgb(114,128,146);
      font-size: 12px;
    }
  }
}
</style>

