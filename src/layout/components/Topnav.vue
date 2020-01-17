<template>
  <div class="Topnav">
    <el-row :gutter="20" class>
      <el-col :span="24" :xs="24">
        <div class="Topnav_item" :style="{'background':theme}">
          <div class="Topnav_img_box">
            <router-link to="/">
            <img src="@/assets/images/logo.png" alt />
             </router-link>
          </div>

         <!--  <div class="flex_box Topnav_nav_box" v-if="fullWidth">
            <router-link to="/">
              <div :class="{this_tnbd_div:pagetype==='index'}">首页</div>
            </router-link>
            <router-link to="/shop_decoration">
              <div :class="{this_tnbd_div:pagetype==='shop_dec'}">店铺装修</div>
            </router-link>
            <router-link to="/account">
              <div :class="{this_tnbd_div:pagetype==='account'}">账户信息</div>
            </router-link>
            <router-link to="/template_management">
              <div :class="{this_tnbd_div:pagetype==='templ'}">模板管理</div>
            </router-link>
          </div> -->

          <div class="flex_box mymakeinfo" v-if="fullWidth">
            <router-link to="/">
              <div :class="{this_tnbd_div:pagetype==='index'}">首页</div>
            </router-link>
             <router-link to="/account">
              <div :class="{this_tnbd_div:pagetype==='account'}">账户信息</div>
            </router-link>
            <router-link to="/notice">
              <div :class="{this_tnbd_div:pagetype==='notice'}">我的消息</div>
            </router-link>
            <div> <a target="_blank" :href="'http://www.23huicai.com/mechanism/default/'+shop.shopID+'/DEFF'">我的站点</a></div>
            <!-- <div>新手入门</div> -->

            <div @click="logout">安全退出</div>
          </div>
          <div class="H5_item" v-if="!fullWidth">
            <svg-icon icon-class="list" @click="make_menu" class-name="H5-menu" />
          </div>
        </div>
        <transition name="toggle-cart">
          <div class="H5-menu-item" :style="{'background':theme}" v-if="!fullWidth&&!dismenu">
            <!-- <router-link to="/">
              <div :class="{this_tnbd_div:pagetype==='index'}">首页</div>
            </router-link>
            <router-link to="/shop_decoration">
              <div :class="{this_tnbd_div:pagetype==='shop_dec'}">店铺装修</div>
            </router-link>
            <router-link to="/account">
              <div :class="{this_tnbd_div:pagetype==='account'}">账户信息</div>
            </router-link>
            <router-link to="/template_management">
              <div :class="{this_tnbd_div:pagetype==='templ'}">模板管理</div>
            </router-link> -->
              <router-link to="/">
              <div :class="{this_tnbd_div:pagetype==='index'}">首页</div>
            </router-link>
             <router-link to="/account">
              <div :class="{this_tnbd_div:pagetype==='account'}">账户信息</div>
            </router-link>
            <router-link to="/notice">
              <div :class="{this_tnbd_div:pagetype==='notice'}">我的消息</div>
            </router-link>
            <div> <a target="_blank" :href="'http://www.23huicai.com/mechanism/default/'+shop.shopID+'/DEFF'">我的站点</a></div>
            <!-- <div>新手入门</div> -->
            <div @click="logout">安全退出</div>
          </div>
        </transition>
        <div style="height:75px"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Topnav",
  data() {
    return {
      pagetype: "index",
      fullWidth: true,
      dismenu: true
    };
  },

  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    make_menu() {
      this.dismenu = !this.dismenu;
    },
    page_width() {
      let screenWidth = window.screen.width;
      console.log(screenWidth);
      if (screenWidth < 800) {
        this.fullWidth = false;
      } else {
        this.fullWidth = true;
      }
    }
    // PageType(e) {
    //   this.pagetype = e;
    // }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    },
    shop(){
      return this.$store.state.user.shop
    }
  },

  beforeCreate() {
    let page,
      self = this;

    self.$router.beforeEach((to, from, next) => {
      page = to.path;
      console.log(page, "----");
      switch (page) {
        case "/shop_decoration":
          self.pagetype = "shop_dec";
          break;
        case "/account":
          self.pagetype = "account";
          break;
        case "/template_management":
          self.pagetype = "templ";
          break;
        case "/accounts/company_info":
          self.pagetype = "account";
          break;
        case "/accounts/qualifications":
          self.pagetype = "account";
          break;
        case "/accounts/uplAccountCode":
          self.pagetype = "account";
          break;
        case "/notice":
          self.pagetype = "notice";
          break;
        default:
          self.pagetype = "index";
      }
      next();
    });
  },
  mounted() {
    window.onresize = () => {
      this.page_width();
    };
    this.page_width();
  },
  created(){
  
  }
};
</script>

<style lang="scss">
// position: relative;
.Topnav_img_box {
  width: 12rem;
  display: flex;
  align-items: center;
  justify-content: center;
  img{
    width: 100%;
    margin-left: 40px;
  }
}
.Topnav_nav_box {
  width: 560px;
  padding: 0 60px;

  justify-content: space-between;
}
.this_tnbd_div {
  background-color: rgba(0, 0, 0, 0.3);
  // height: 34px;
}
.Topnav_nav_box div {
  padding: 0 21px;

  height: 36px;
  font-size: 14px;
  line-height: 36px;
  border-radius: 18px;
  // margin-top: 19px;
}

.Topnav .Topnav_item {
  position: fixed;
  display: flex;
  top: 0;
  z-index: 1999;
  left: 0;
  height: 74px;
  color: #fff;
  width: 100%;

  /* text-align: center; */
  /* background-color: #1286fd; */
  .H5_item {
    position: absolute;
    right: 14px;
    top: 24px;
    .H5-menu {
      font-size: 22px;
    }
  }
}
.H5-menu-item {
  color: #fff;
  width: 120px;
  position: fixed;
  z-index: 20190705;
  right: 0px;
  top: 75px;

  div {
    height: 42px;
    line-height: 42px;
    text-align: center;
  }
}
.mymakeinfo {
  position: absolute;
  right: 30px;
  top: 0;
  // line-height: 74px;
  justify-content: space-around;
  font-size: 14px;
  height: 74px;
}
.mymakeinfo div {
  // margin-left: 30px;
  height: 36px;
  line-height: 36px;
  border-radius: 17px;
      padding: 0 20px;
}
.flex_box {
  display: flex;
  align-items: center;
}
.toggle-cart-enter-active,
.toggle-cart-leave-active {
  transition: all 0.4s ease-out;
}
.toggle-cart-enter,
.toggle-cart-leave-active {
  transform: translateY(-100%);
}
</style>

