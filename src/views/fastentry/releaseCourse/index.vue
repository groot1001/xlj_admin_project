<template>
  <div class="releaseCourse app-container">
    <el-row :gutter="20" class>
      <el-col :span="24" :xs="24">
        <el-card style=" ">
          <div slot="header" class="top_box">
            <div class="ul_line"></div>
            <ul class="top_item">
              <li :class="{stepcss:steps>=1}">1</li>
              <li :class="{stepcss:steps>=2}">2</li>
              <li :class="{stepcss:steps>=3}">3</li>
            </ul>
            <ul class="lc_tit">
              <li>分类统计</li>
              <li>填写课程信息</li>
              <li>发布成功</li>
            </ul>
          </div>
          <div v-show="steps==2" class="ci_label">
            <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>发布课程信息
            <!-- <span>&nbsp; &nbsp; &nbsp;从已创建的课程中导入</span> -->
          </div>
          <selectClass v-show="steps==1" v-on:stepsChange="stepsChange" />
          <subSuccess v-show="steps==3" v-on:stepsChange="stepsChange" />
        </el-card>
        <!--传输选择好的类目结果 seleClassRst-->
        <!--传输修改的数据模型 id-->
        <writeInfo
          :seleClassRst="seleClassRst"
          :cid="cid"
          style="margin-top: 22px;"
          v-if="steps==2"
          v-on:stepsChange="stepsChange"
        />
      </el-col>
    </el-row>
    <div style="display:none">
      <vue-neditor-wrap :config="myConfig" :destroy="false"></vue-neditor-wrap>
    </div>
  </div>
</template>

<script>
import selectClass from "./components/selectClass";
import writeInfo from "./components/writeInfo";
import subSuccess from "./components/sub_success";
import { axpGet, axpPost } from "@/utils/axiosPme";
import { getToken } from "@/utils/auth";
import { watchs } from "fs";
import VueNeditorWrap from "vue-neditor-wrap";
export default {
  name: "releaseCourse",
  data() {
    return {
      steps: 1,
      cid: null,
      uplCouresmodel: {},
      seleClassRst: ["", ""],
      myConfig: {
        // 富文本配置
        serverUrl:
          "http://hc.6636fu.com/BusinessAfter/UploadImg/?newfile=richtext",
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: "/mechanism/NEditor/",
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 280,
        // 初始容器宽度
        initialFrameWidth: "93%",
        // 关闭自动保存
        enableAutoSave: false
      }
    };
  },
  components: {
    selectClass,
    writeInfo,
    subSuccess,
    VueNeditorWrap //富文本
  },
  methods: {
    stepsChange(pace, categorys = []) {
      this.steps = pace;
      if (categorys.length >= 2) {
        this.seleClassRst = categorys;
      }
    }
  },
  created() {
    //生命周期里接收参数
    let steps = this.$route.query.steps || 1; //接受参数关键代码
    this.steps = steps;
    let cid = this.$route.query.cid || "noId";
    if (cid != "noId") {
      this.cid = cid;
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  }
};
</script>

<style lang="scss">
.ci_label {
  color: #212c3d;
  font-size: 14px;
  span {
    color: #1985fd;
    cursor: pointer;
  }
}
.top_box {
  padding: 16px 0;
  position: relative;
}
.ul_line {
  width: 68%;
  border: 1px solid #eee;
  margin-left: 16%;
  position: absolute;
  top: 45px;
  left: 0;
  z-index: 1;
}
.lc_tit {
  z-index: 2;
  position: relative;
  display: flex;
  width: 70%;
  margin: 0 15%;
  justify-content: space-between;
  padding: 0;
  li {
    font-size: 12px;
    list-style: none;
    text-align: center;
    margin-top: 12px;
    color: #728092;
  }
}
.top_item {
  z-index: 2;
  position: relative;
  display: flex;
  width: 70%;
  margin: 0 15%;
  justify-content: space-between;
  padding: 0;
  li {
    list-style: none;
    height: 40px;
    width: 40px;
    border-radius: 100%;
    background-color: #728092;

    line-height: 40px;
    text-align: center;
    font-size: 12px;
    color: #fff;
  }
}
.stepcss {
  background-color: #1985fd !important;
}
</style>

