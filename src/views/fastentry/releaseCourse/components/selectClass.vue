<template>
  <div class="selectClass">
    <div>
      <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>选择分类
    </div>
    <div class="lnquire_box">
      <input type="text" v-model="categoryNameVal" placeholder="请输入您要找的分类名" />
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="选择分类">
        <div class="etp_item">
          <el-col :span="5" :xs="24">
            <div class="scroll_box" ref="scroll_box">
              <ul class="infinite-list">
                <li
                  v-for="(i,index) in courseClass"
                  :key="index"
                  class="infinite-list-item"
                  @click="sele_max_class(index)"
                  :class="{active_color:maxClassInd==index}"
                  :ref="'_'+index"
                >
                  <label for>{{ i.categoryBigName }}</label>
                  <span for class="iconfont iconfanhuizuojiantouxiangzuoshangyibuxianxing"></span>
                </li>
              </ul>
            </div>
          </el-col>
          <el-col :span="19" :xs="24">
            <div class="sele_min_class">
              <div class="smic_item" v-for="(c,ind) in courseClass[maxClassInd].subData" :key="ind">
                <div
                  class="smic_item_tit"
                  :class="{active_min_class_color:ind==minClassInd}"
                  @click="sele_min_class(ind)"
                >{{c.categorySubName}}</div>
              </div>

              <div v-if="courseClass[maxClassInd].subData.length==0" class="min_class_null">暂无数据~</div>
            </div>
          </el-col>
          <el-col :span="24" :xs="24">
            <div class="this_sele_class">
              <span>您当前选择的分类是：</span>
              <label for>
                {{courseClass[maxClassInd].categoryBigName}}
                <label
                  v-if="courseClass[maxClassInd].subData.length>0"
                >>{{courseClass[maxClassInd].subData[minClassInd].categorySubName}}</label>
              </label>
            </div>
          </el-col>
        </div>
        <el-col :span="24" :xs="24">
          <div @click="stepsChangeone()" class="sele_next">下一步</div>
        </el-col>
      </el-tab-pane>
      <!-- <el-tab-pane disabled label="从主营行业中进行选择">从主营行业中进行选择</el-tab-pane> -->
    </el-tabs>
    
  </div>
</template>

<script>
import { axpGet } from "@/utils/axiosPme";
import { Message } from "element-ui";
import { getToken } from "@/utils/auth";
import { filter } from "minimatch";

export default {
  name: "selectClass",
  data() {
    return {
      categoryNameVal: "",
      maxClassInd: 0,
      minClassInd: 0,
      maxClassTit: "",
      minClassTit: "",
      courseClass: [
        { categoryBigId: "", categoryBigName: "", sort: 0, subData: [] }
      ],
      backupsCourseClass: []

    };
  },

  methods: {
    sele_max_class(ind) {
      this.maxClassInd = ind;
      let self = this;
      //   let _id='_'+ind
      //  let scroll_li= this.$refs[`${_id}`];//字符串模板模板套用
      let distance = 41 * ind;
      self.$refs.scroll_box.scrollTop = distance;
    },
    sele_min_class(ind) {
      this.minClassInd = ind;
    },
    stepsChangeone() {
      let maxClassRst = {},
        minClassRst = {};
      maxClassRst.categoryBigName = this.courseClass[
        this.maxClassInd
      ].categoryBigName;
      maxClassRst.currBigCateId = this.courseClass[
        this.maxClassInd
      ].categoryBigId;

      if (this.courseClass[this.maxClassInd].subData.length > 0) {
        minClassRst.categorySubName = this.courseClass[
          this.maxClassInd
        ].subData[this.minClassInd].categorySubName;
        minClassRst.categorySubId = this.courseClass[this.maxClassInd].subData[
          this.minClassInd
        ].categorySubId;
      }

      if (minClassRst.categorySubId) {
        this.$emit("stepsChange", 2, [maxClassRst, minClassRst]);
      } else {
        //  alert('请选择完整分类！');
        this.$message({
          showClose: true,
          message: "请选择完整分类！",
          type: "warning",
          offset: 78
        });
      }
    }
  },
  beforeCreate() {
    axpGet("http://hc.6636fu.com/BusinessAfter/AddCurriculumCategory", {
      //获取课程分类
      token: getToken(),
      isMine: 0
    })
      .then(res => {
        this.courseClass = res.data;
        this.backupsCourseClass = [...res.data];
      })
      .catch(err => {
        console.log(err);
      });
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  },
  watch: {
    categoryNameVal(val, oldval) {
      let sleCourse = this.courseClass.filter(
        item => item.categoryBigName.indexOf(val) != -1
      );
      this.courseClass = sleCourse;
      if (!val) {
        this.courseClass = this.backupsCourseClass;
      }
      // let _index = this.courseClass.findIndex(
      //   item => item.categoryBigName === val
      // );
      // if (_index != -1) {
      //   // this.maxClassInd = _index;
      //   this.sele_max_class(_index);

      // }
    }
  }
};
</script>

<style  lang="scss" scoped>
.el-message {
  top: 76px !important;
  
}
.selectClass {
  .lnquire_box {
    padding: 12px 0;
    width: 265px;
    input {
      width: 265px;
      padding: 0 12px;
      font-size: 14px;
      border: 1px solid #bac8d9;
      border-radius: 3px;
      height: 35px;
      line-height: 35px;
      outline: none;
    }
  }
  .etp_item {
    .scroll_box {
      height: 320px;

      border: 1px solid #bac8d9;
      overflow-y: scroll;
      border-radius: 5px;
      padding: 2px;
      ul {
        padding: 0;
        margin: 6px 0;
        li {
          cursor: pointer;
          list-style: none;
          padding: 14px 12px;
          font-size: 12px;
          color: #728092;
          display: flex;
          justify-content: space-between;
          span {
            font-size: 10px;
          }
          &:hover {
            background-color: #f5f7fb;
            color: #1985fd !important;
          }
        }
      }
    }
    .active_color {
      background-color: #f5f7fb;
      color: #1985fd !important;
    }
    .active_min_class_color {
      background-color: #1985fd;
      color: #ffff !important;
    }
    .sele_min_class {
      border: 1px solid #bac8d9;
      border-radius: 3px;
      height: 320px;
      display: flex;
      justify-content: left;
      flex-wrap: wrap;
      .min_class_null {
        font-size: 18px;
        width: 100%;
        text-align: center;
        line-height: 320px;
        color: #728092;
      }
      .smic_item {
        width: 20%;
        height: 35px;
        margin: 35px 0;
        .smic_item_tit {
          cursor: pointer;
          margin: 0 auto;
          font-size: 12px;
          color: #728092;
          width: 110px;
          text-align: center;
          line-height: 35px;
          border-radius: 2px;
          &:hover {
            background-color: #1985fd;
            color: #ffff !important;
          }
        }
      }
    }
  }
  .this_sele_class {
    background-color: #f0f0f0;
    margin-top: 22px;
    padding: 12px;
    border-radius: 3px;
    font-size: 12px;
    span {
      color: #728092;
    }
    label {
      font-size: #212c3d;
      font-weight: bold;
    }
  }
  .sele_next {
    cursor: pointer;
    font-size: 14px;
    color: #fff;
    background-color: #1985fd;
    width: 180px;
    margin: 20px auto;
    border-radius: 5px;
    line-height: 45px;
    text-align: center;
  }
}
</style>


