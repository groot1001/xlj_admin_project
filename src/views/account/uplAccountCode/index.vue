<template>
  <div id="uplAccountCode" class="app-container">
    <el-card style="min-height: 550px;position: relative;">
      <div slot="header">
        <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>修改密码
      </div>
      <div class="form_box">
        <div class="formInputBox">
          <div class="formInputTit">原密码：</div>
          <div class="formInput">
            <el-input placeholder="请输入原密码" v-model="OriginalInput" show-password></el-input>
          </div>
        </div>
        <div class="formInputBox">
          <div class="formInputTit">新密码：</div>
          <div class="formInput">
            <el-input placeholder="请输入新密码" v-model="NewInput" show-password></el-input>
          </div>
        </div>
        <div class="formInputBox">
          <div class="formInputTit">重复输入一下：</div>
          <div class="formInput">
            <el-input placeholder="请重复输入一下" v-model="RepeatInput" show-password></el-input>
          </div>
          <div class="pwdTips">{{pwdTips}}</div>
        </div>
        <div class="formInputBox">
          <el-button style="width:280px;margin-left:120px;" @click="updAccCode" type="primary">保存修改</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { axpGet, axpPost } from "@/utils/axiosPme";
import { getToken } from "@/utils/auth";
export default {
  components: {},
  props: {},
  data() {
    return {
      OriginalInput: "",
      NewInput: "",
      RepeatInput: "",
      pwdTips: ""
    };
  },
  watch: {
    RepeatInput(newVal, oldval) {
      if (newVal != this.NewInput) {
        this.pwdTips = "两次输入不一致！";
      } else {
        this.pwdTips = "";
      }
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    updAccCode() {
      axpPost("http://hc.6636fu.com/BusinessAfter/UpdatePwd", {
        token: getToken(),
        oldpwd: this.OriginalInput,
        newpwd: this.RepeatInput
      })
        .then(res => {
          if (res.code == "00000") {
            this.$message({
              type: "success",
              message: res.message+'请重新登录！'
            });
            this.logout();
          }else{
              this.$message({
            type: "error",
            message: res.message
          });
          }
        })
        .catch(err => {});
    }
  },
  created() {},
  mounted() {}
};
</script>
<style lang="scss" scoped>
#uplAccountCode {
  .formInputBox {
    display: flex;
    margin-top: 18px;
    .formInputTit {
      width: 120px;
      font-size: 16px;
      line-height: 36px;
    }
    .formInput {
      width: 280px;
    }
    .pwdTips {
      margin-left: 14px;
      color: #f00111;
      line-height: 36px;
      font-size: 12px;
    }
  }
}
</style>