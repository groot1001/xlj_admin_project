<template>
  <el-card style="margin-bottom:20px;height:238px">
    <div class="user_card">
      <el-col :span="5" :xs="24">
        <div class="uc_rigth">
          <img style="width:100%;" :src="'http://hc.6636fu.com'+user.avatar" alt />
        </div>
      </el-col>
      <el-col :span="19" :xs="24">
        <div class="uc_left">
          <div class="ucl_tit">
            <h2>{{user.shop.shopName}}</h2>

            <!-- <label>（机构IP：55566598，上次登录：深圳）</label> -->
          </div>
          <div class="ucl_block">
            <div class>普通会员</div>
            <div class>{{user.shop.auditStatus}}</div>
            <!-- <div class>未实名认证</div> -->
          </div>
          <div class="ucl_info">
            <p>{{user.name}} 丨 ID：{{user.shop.shopID}} 丨 手机号：{{user.shop.shopPhone}}</p>
          </div>
          <!-- <div class="account_money">
            <label class="tit">账户余额:</label>
            <label class="money">￥{{user.shop.money}}</label>
            <label class="recharge">充值</label>
          </div>-->
          <div class="com_block">
            <p>
              <router-link to="/accounts/company_info">公司信息</router-link>丨
              <router-link to="/fastentry/releaseCourse">发布课程</router-link>丨
              <router-link to="/infoManage/infoList">资讯管理</router-link>
            </p>
          </div>
        </div>
      </el-col>
    </div>
    <el-col :span="24" :xs="24">
      <div class="broadcast">
        <div class="bro_box">
          <div class="tit_left">
            <label class="iconfont iconshengyin" style="font-size:12px;" />
            <label for>公告 :</label>
          </div>
          <div class="txt_rigth">
            <el-carousel height="30px" :loop='true'  :interval="3000" indicator-position='none' direction="vertical" :autoplay="true">
              <!--  -->
                <el-carousel-item v-for="(item,index) in noticeList" :key="index">
                  <router-link to="/notice">
                  <div style="width:100%;height:30px">{{item.name}}</div>
                  </router-link> 
                </el-carousel-item>
              <!-- -->
            </el-carousel>
          </div>
        </div>
      </div>
    </el-col>
    <!--
   <div slot="header" class="clearfix">
      <span>About me</span>
    </div>
  
    <div class="user-profile">
      <div class="box-center">
        <pan-thumb :image="user.avatar" :height="'100px'" :width="'100px'" :hoverable="false">
          <div>Hello</div>
          {{ user.role }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted">{{ user.role | uppercaseFirst }}</div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="education" /><span>Education</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            JS in Computer Science from the University of Technology
          </div>
        </div>
      </div>

      <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>Skills</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="70" />
          </div>
          <div class="progress-item">
            <span>JavaScript</span>
            <el-progress :percentage="18" />
          </div>
          <div class="progress-item">
            <span>Css</span>
            <el-progress :percentage="12" />
          </div>
          <div class="progress-item">
            <span>ESLint</span>
            <el-progress :percentage="100" status="success" />
          </div>
        </div>
      </div>
    </div>-->
  </el-card>
</template>

<script>
// import PanThumb from "@/components/PanThumb";
import { axpGet } from "@/utils/axiosPme";
// import { getToken } from "@/utils/auth";Carousel
export default {
  components: {},
  data() {
    return {
      noticeList: []
    };
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: "",
          email: "",
          avatar: "",
          roles: "",
        };
      }
    }
  },
  created() {
    this.getNotice();
  },
  methods: {
    getNotice() {
      axpGet("http://hc.6636fu.com/BusinessAfter/GetNotice", {})
        .then(res => {
          this.noticeList = res.data;
          // console.log(res.data,'noticeList=============')
        })
        .catch(err => {});
    }
  }
};
</script>

<style lang="scss" scoped>
.user_card {
  .uc_rigth {
    width: 130px;
    text-align: center;
    img {
      background-color: #f6f6f6;
    }
  }
  
  // display: flex;
  // padding: 20px;
  .uc_left {
    // margin:0 30px;
    .ucl_tit {
      display: flex;
      align-items: center;
      width: 100%;
      h2 {
        font-size: 18px;
        color: #212c3d;
      }
      label {
        color: #728092;
        font-size: 12px;
      }
    }
    .ucl_block {
      display: flex;
      font-size: 12px;

      div:first-child {
        color: #ffb348;
        border: #ffb348 solid 1px;
        border-radius: 2px;
        padding: 2px;
      }

      div:nth-child(2) {
        color: #1985fd;
        border: #1985fd solid 1px;
        border-radius: 2px;
        padding: 2px;
        margin: 0 12px;
      }
      div:last-child {
        color: #728092;
        border: #728092 solid 1px;
        border-radius: 2px;
        padding: 2px;
      }
    }
    .ucl_info p {
      font-size: 12px;
      color: #728092;
    }
    .account_money {
      .tit {
        font-size: 12px;
        color: #728092;
      }
      .money {
        font-size: 18px;
        color: #ffa60c;
        font-weight: bold;
      }
      .recharge {
        background-color: #ffa60c;
        color: #ffffff;
        font-size: 12px;
        padding: 3px;
        border-radius: 2px;
      }
    }
    .com_block {
      font-size: 12px;
      color: #1985fd;
    }
  }
}

.broadcast {
  border-top: solid #eee 1px;
  color: #728092;
  font-size: 12px;

  .bro_box {
    width: 100%;
    display: flex;
    padding: 20px 0;
    .tit_left {
      width: 8%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      // line-height: 28px;
    }
     .txt_rigth{
     width: 92%;
     line-height: 30px;
   }
  }
}

//  .box-center {
//    margin: 0 auto;
//    display: table;
//  }

//  .text-muted {
//    color: #777;
//  }

//  .user-profile {
//    .user-name {
//      font-weight: bold;
//    }

//    .box-center {
//      padding-top: 10px;
//    }

//    .user-role {
//      padding-top: 10px;
//      font-weight: 400;
//      font-size: 14px;
//    }

//    .box-social {
//      padding-top: 30px;

//      .el-table {
//        border-top: 1px solid #dfe6ec;
//      }
//    }

//    .user-follow {
//      padding-top: 20px;
//    }
//  }

//  .user-bio {
//    margin-top: 20px;
//    color: #606266;

//    span {
//      padding-left: 4px;
//    }

//    .user-bio-section {
//      font-size: 14px;
//      padding: 15px 0;

//      .user-bio-section-header {
//        border-bottom: 1px solid #dfe6ec;
//        padding-bottom: 10px;
//        margin-bottom: 10px;
//        font-weight: bold;
//      }
//    }
//  }
</style>
