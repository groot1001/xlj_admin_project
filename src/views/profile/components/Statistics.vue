<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="statistics_tit">
      <samp :style="{'color':theme}">●</samp>
      <span>分类统计</span>
    </div>
    <div class="count_box">
      <el-col :span="4" :xs="24">
        <div class="count_item">
          <div class>
            <svg-icon icon-class="message" class-name="card-panel-icon" />
          </div>
          <div class="count_titem_right">
            <div>咨 询</div>
            <count-to
              :start-val="0"
              :end-val="mediaData.consultationNum"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="4" :xs="24">
        <div class="count_item">
          <div class>
            <div class="iconfont iconvideo"></div>
          </div>
         
          <div class="count_titem_right">
            <div>课 程</div>
            <count-to
              :start-val="0"
              :end-val="mediaData.curriculumNum"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="4" :xs="24">
        <div class="count_item">
           <div class>
            <svg-icon icon-class="excel" class-name="excel-icon" />
            <!-- <div class="card-panel-icon iconfont iconrili"></div> -->
          </div>
          <div class="count_titem_right">
            <div>校区</div>
            <count-to
              :start-val="0"
              :end-val="mediaData.schoolNum"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="4" :xs="24">
        <div class="count_item">
          <div class>
            <svg-icon icon-class="documentation" class-name="documentation-icon" />
          </div>
          <div class="count_titem_right">
            <div>文 章</div>
            <count-to
              :start-val="0"
              :end-val="mediaData.articleNum"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="4" :xs="24">
        <div class="count_item">
          <div class>
            <i class="el-icon-question" />
          </div>
          <div class="count_titem_right">
            <div>评 论</div>
            <count-to
              :start-val="0"
              :end-val="mediaData.answerNum"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
      <el-col :span="4" :xs="24">
        <div class="count_item">
          <div class>
            <i class="el-icon-picture" />
          </div>
          <div class="count_titem_right">
            <div>图 片</div>
            <count-to
              :start-val="0"
              :end-val="mediaData.imagesNum"
              :duration="3000"
              class="card-panel-num"
            />
          </div>
        </div>
      </el-col>
    </div>
    <div style="padding:16px 16px 0;">
      <line-chart :chart-data="lineChartData" />
    </div>
  </el-card>
</template>

<script>
import CountTo from "vue-count-to";
import LineChart from "../../../views/dashboard/admin/components/LineChart";
import { getToken } from "@/utils/auth";
import { axpGet } from "@/utils/axiosPme";
const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
};
export default {
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      mediaData: {}
    };
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type];
    }
  },
  components: {
    CountTo,
    LineChart
  },
  created() {
    axpGet("http://hc.6636fu.com/BusinessAfter/CateStatistics", {
      //获取
      token: getToken()
    })
      .then(res => {
        console.log(res.data,'mediaData');
        this.mediaData = res.data;
        this.lineChartData = {
          expectedData: [0, 0, 0, 0, 0, 0, 0],
          actualData: [res.data.consultationNum, res.data.curriculumNum, res.data.schoolNum, res.data.articleNum, res.data.answerNum,res.data.imagesNum]
        };
      })
      .catch(err => {
        console.log(err);
      });
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  }
};
</script>

<style lang="scss">
.statistics_tit {
  font-size: 14px;
  color: #212c3d;
}
.count_box {
  padding-bottom: 160px;
  .count_item {
    background-color: #f2f6fe;
    // height: 66px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    padding: 22px;
    .count_titem_right {
      div {
        font-size: 16px;
        color: #212c3d;
      }
      .card-panel-num {
        color: #728092;
        font-size: 22px;
        margin-top: 6px;
        display: block;
      }
    }
    .message {
    }
    .card-panel-icon {
      font-size: 48px;
      color: #36a3f7;
    }
    .excel-icon {
      font-size: 48px;
      color: #40c9c6;
    }
    .el-icon-picture {
      font-size: 48px;
      color: #42b983;
    }
    .el-icon-question {
      font-size: 48px;
      color: #f4516c;
    }
    .documentation-icon {
      font-size: 48px;
      color: #34bfa3;
    }
    .iconvideo {
      font-size: 43px;
      color: #769aff;
    }
  }
}
</style>

