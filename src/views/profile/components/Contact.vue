<template>
  <el-card style="height:238px;padding:0;margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <samp :style="{'color':theme}">●</samp>
      <span>专属客服</span>
    </div>
    <div class="contact_box">
      <div class="contact_info">
        <div class="concatImg">
          <img :src="service.WaiterImg" alt />
        </div>
        <div class="ci_rig">
          <div class="contact_name">{{service.WaiterName}}</div>
          <p class="contact_position">{{service.WaiterDetail}}专属客服专属客服专属客服专属客服专属客服</p>
        </div>
      </div>
    </div>
    <div class="contact_num">
      <p class="iconfont iconshouji1">{{service.WaiterPhone}}</p>
      <p class="iconfont icondianhua">{{service.WaiterTel}}</p>
    </div>
    <div class="contact-btn" @click="goQQ(service.WaiterQQ)" :style="{'background-color':theme}">
      <label for class="iconfont iconiconfontqq"></label>
      <span>QQ在线</span>
    </div>
  </el-card>
</template>

<script>
import { axpGet } from "@/utils/axiosPme";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      service: {
        AddTime: null,
        BTC_Shop: null,
        Id: 0,
        ShopId: null,
        WaiterDetail: "高级商务推广经理",
        WaiterImg: require("@/assets/images/contact.png"),
        WaiterName: "刘经理",
        WaiterPhone: "155-1234-5678",
        WaiterQQ: "2432204661",
        WaiterTel: "0755-26970105"
      }
    };
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  },
  created() {
    this.getService();
  },
  methods: {
    getService() {
      axpGet("http://hc.6636fu.com/BusinessAfter/GetWaiter", {
        token: getToken()
      })
        .then(res => {
          console.log(res.data, "service");

          if (res.data.WaiterName) {
            this.service = res.data;
          }
        })
        .catch(err => {});
    },
    goQQ(qq) {
      window.open(
        `tencent://message/?uin=${qq}&amp;Site=sc.chinaz.com&amp;Menu=yes`,
        "_blank"
      );
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
.concatImg img {
  width: 54px;
  height: 54px;
  border-radius: 100%;
}
.contact_box {
  padding: 0 14px;
  .contact_info {
    display: flex;
    .contact_name {
      font-size: 14px;
      color: #212c3d;
    }
    .contact_position {
      font-size: 12px;
      color: #728092;
      width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .ci_rig {
      margin: 5px 12px 0;
    }
  }
}
.contact_num {
  p {
    margin: 12px 0;
    font-size: 12px;
    color: #728092;
    text-align: center;
  }
}
.contact-btn {
  cursor: pointer;
  width: 80%;
  margin: 0 auto;
  color: #ffffff;
  border-radius: 15px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  span {
    font-size: 12px;
  }
}
</style>
