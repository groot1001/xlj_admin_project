<template>
  <div class="addCourseClass app-container">
    <el-card style="min-height: 550px;">
      <div slot="header">
        <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>添加课程分类
      </div>
      <p class="accitps">
        您可新建产品系列，
        <span>5</span>条/天。（开通
        <span>中文商铺</span>功能，可新建产品系列
        <span>50</span>条/天！功能到期回复5条/天）请参阅：
        <a>《关于用户后台发布功能升级通知》</a>
      </p>
      <div class="form_box">
        <div class="input_box">
          <label for>大系列名称：</label>
          <el-input v-model="max_class_val" placeholder="请输入内容"></el-input>
        </div>
      </div>
      <div class="form_box">
        <div class="input_box" style="width:180px">
          <label for>产品排序：</label>
          <el-input style="width:80px;" v-model="rank"></el-input>
        </div>
        <p class="tips3">排序为倒叙,数值越大越靠前</p>
      </div>
      <p class="tips2">请您在下面的文本框填写属于此课程大系列的小系列名称，如果没有小系列，则不填</p>
      <div class="form_box" v-for="(i,index) in min_class" :key="index">
        <div class="input_box">
          <label for>小系列名称：</label>
          <el-input v-model="i.min_name" placeholder="请输入内容"></el-input>
        </div>
        <div v-if="index==min_class.length-1" @click="addMinClass()" class="addMinClass">添加</div>
        <div v-if="index>2" @click="deleMinClass(index)" class="deleMinClass">删除</div>
      </div>
      <div class="addClassbottom_btn">
        <el-button style="width:210px;" type="primary" @click="saveInfo">保存信息</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { axpGet } from "@/utils/axiosPme";
export default {
  name: "addCourseClass",
  data() {
    return {
      max_class_val: "",
      rank: "",
      min_class: [
        {
          min_name: ""
        },
        {
          min_name: ""
        },
        {
          min_name: ""
        }
      ]
    };
  },
  methods: {
    addMinClass() {
      var mc = this.min_class;
      mc.push({ min_name: "" });
    },
    deleMinClass(ind) {
      var mc = this.min_class;
      mc.splice(ind, 1);
      this.min_class = mc;
    },
    saveInfo() {
      if (this.max_class_val) {
    
        let minClass=this.min_class.filter(item => item.min_name);
        let pame = {
          bigcategory: this.max_class_val,
          subcategory: minClass.map(item => item.min_name).join(","),
          token: getToken(),
          sort: this.rank
        };

        let self = this;

        axpGet("http://hc.6636fu.com/BusinessAfter/AddCurrCategory", pame)
          .then(res => {
            console.log(res);
            self.$message.success(res.message + "！！！");
            self.max_class_val = "";
            self.rank = "";
            self.min_class = [
              {
                min_name: ""
              },
              {
                min_name: ""
              },
              {
                min_name: ""
              }
            ];
          })
          .catch(err => {
            console.log(err);
          });
      } else {
        this.$message.error("请输入大类名称！！！");
      }
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  }
};
</script>

 <style lang="scss" scoped>
.accitps {
  margin-top: 0;
  font-size: 12px;
  span {
    color: #ff6262;
  }
  a {
    color: #1f85fb;
  }
}
.form_box {
  padding: 12px 40px;
  display: flex;
  .input_box {
    width: 300px;
    display: flex;
    height: 35px;
    line-height: 35px;
    label {
      text-align: right;
      padding-right: 12px;
      font-size: 12px;
      width: 90px;
    }
    .el-input {
      width: 200px;
    }
  }
  .addMinClass {
    color: #1f85fb;
    line-height: 35px;
    margin-left: 12px;
    font-size: 12px;
  }
  .deleMinClass {
    color: #ff6262;
    line-height: 35px;
    margin-left: 12px;
    font-size: 12px;
  }
}
.tips2 {
  margin-left: 130px;
  font-size: 12px;
  color: #adb7c2;
}
.tips3 {
  font-size: 12px;
  color: #adb7c2;
}
.addClassbottom_btn {
  margin-top: 12px;
  margin-left: 130px;
}
</style>

