<template>
  <div class="app-container addOrder">
    <el-card style="min-height: 550px;">
      <div slot="header">
        <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>添加订单
      </div>
      <div class="form_box">
        <div class="input_box">
          <label for>学员姓名：</label>
          <el-input v-model="stuName" placeholder="请输入内容"></el-input>
        </div>
        <!-- <el-radio v-model="stuSex" label="1">先生</el-radio>
        <el-radio v-model="stuSex" label="2">女士</el-radio> -->
      </div>
      <div class="form_box">
        <div class="input_box">
          <label for>手机号码：</label>
          <el-input v-model="stuTel" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="form_box">
        <div class="input_box">
          <label for>订单号：</label>
          <el-input v-model="stuOrderNum" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="form_box">
        <div class="input_box">
          <label for>课程名称：</label>
          <el-select v-model="courseValue" @change="seeVal" filterable placeholder="请选择">
            <el-option
              v-for="item in courseOptions"
              :key="item.curriculumId"
              :label="item.curriculumName"
              :value="item.curriculumId"
            ></el-option>
          </el-select>
          <!-- <el-input v-model="stuCourseName" placeholder="请输入内容"></el-input> -->
        </div>
      </div>
      <div class="form_box">
        <div class="input_box">
          <label for>金额：</label>
          <el-input v-model="stuMoney" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <!-- <div class="form_box">
        <div class="input_box">
          <label for>下单时间：</label>
          <el-input v-model="stuDate" placeholder="请输入内容"></el-input>
        </div>
      </div>-->
      <div class="form_box">
        <div class="input_box">
          <label for>学习时间制：</label>
          <el-input v-model="stuTime" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <!-- <div class="form_box">
        <div class="input_box">
          <label for>QQ：</label>
          <el-input v-model="stuQQ" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="form_box">
        <div class="input_box">
          <label for>微信：</label>
          <el-input v-model="stuWx" placeholder="请输入内容"></el-input>
        </div>
      </div>-->
      <div class="form_box">
        <div class="input_box" style="width:500px;height:auto">
          <label for>备注：</label>
          <el-input type="textarea" :rows="3" v-model="stuRemarks" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="order_save">
        <el-button style="width:210px;" @click="saveOrder" type="primary">保存信息</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getToken} from "@/utils/auth";
import { axpGet,axpPost } from "@/utils/axiosPme";
export default {
  name: "addOrder",
  data() {
    return {
      stuName: "",
      stuTel: "",
      stuSex: "1",
      stuOrderNum: "",
      stuCourseName: "",
      stuMoney: "",
      // stuDate: "",
      stuTime: "",
      // stuQQ: "",
      // stuWx: "",
      stuRemarks: "",
      courseOptions: [],
      courseValue: ""
    };
  },
  methods: {
    saveOrder() {
      axpPost("http://hc.6636fu.com/BusinessAfter/AddOrder", {
        //
        token: getToken(),
        userName: this.stuName,
        userPhone: this.stuTel,
        orderCode: this.stuOrderNum,
        curriculumId: this.courseValue,
        orderPrice: this.stuMoney,
        studyStystem: this.stuTime,
        remark: this.stuRemarks
      })
        .then(res => {
          console.log(res);
          this.stuName = "";
          this.stuTel = "";
          this.stuOrderNum = "";
          this.courseValue = "";
          this.stuMoney = "";
          this.stuTime = "";
          this.stuRemarks = "";
          this.$message.success(res.message + "！！！");
        })
        .catch(err => {
          console.log(err);
        });
    },
    seeVal(e) {
      console.log(e);
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  },
  created() {
    axpGet("http://hc.6636fu.com/BusinessAfter/GetAddCurrDropdown", {
      //
      token: getToken()
    })
      .then(res => {
        console.log(res);
        this.courseOptions = res.data;
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>

<style lang="scss" scoped>
.form_box {
  padding: 12px 0px;
  display: flex;
  align-items: center;
  .input_box {
    width: 300px;
    display: flex;
    height: 35px;
    line-height: 35px;
    padding-right: 12px;
    .el-input {
      width: 200px;
    }
    .el-textarea {
      width: 400px;
    }
    label {
      font-size: 12px;
      width: 100px;
      text-align: right;
      padding-right: 12px;
    }
  }
}
.order_save {
  margin-left: 100px;
  margin-top: 12px;
}
</style>

