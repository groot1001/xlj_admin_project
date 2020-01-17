<template>
  <div class="app-container InsitituteMsgManage">
    <el-card>
      <div slot="header">
        <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>机构留言
      </div>
      <div class="tab_top">
        <div class="tab_top_let">
          <a
            href="jjavascript:void(0);"
            :class="{'selectOrderClass':selectOrderType==='novisit'}"
            @click="selectOrderTypeFn('novisit')"
          >未回访</a>
          <a
            href="jjavascript:void(0);"
            :class="{'selectOrderClass':selectOrderType==='havevisit'}"
            @click="selectOrderTypeFn('havevisit')"
          >已回访</a>
          <a
            href="jjavascript:void(0);"
            :class="{'selectOrderClass':selectOrderType==='visittest'}"
            @click="selectOrderTypeFn('visittest')"
          >测试</a>
          <a
            href="jjavascript:void(0);"
            :class="{'selectOrderClass':selectOrderType==='sameocupate'}"
            @click="selectOrderTypeFn('sameocupate')"
          >同行</a>
        </div>
        <div class="search-box">
          <div class="flexsearch">
            <div class="search-left">
              <span class="search-left-tit">搜索：</span>
              <el-input v-model="Namekeywords" placeholder="请输入姓名"></el-input>
              <el-button class="publish-btn" type="primary" @click="namesearch">搜索</el-button>
            </div>
            <div class="search-left pickerbox">
              <span class="search-left-tit">按时间:</span>
              <el-date-picker
                value-format="yyyy-MM-dd"
                v-model="datevalue"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                @change="TimeRange"
              ></el-date-picker>
              <el-button class="publish-btn" type="primary" @click="datesearch">确定</el-button>
            </div>
          </div>
        </div>
      </div>
      <el-table :data="tableData" header-row-class-name="biaotou" style="width: 100%">
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="phone" label="电话"></el-table-column>
        <el-table-column  label="留言地址">
          <template slot-scope="ua">
             <a class="Urladdrrss" :href="ua.row.Urladdrrss" target="_blank">{{ua.row.Urladdrrss}}</a>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="ostate" label="网址"></el-table-column> -->
        <el-table-column prop="addTime" label="时间"></el-table-column>
        <el-table-column prop="content" label="备注/留言"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope_cz">
            <div class="operation">
              <span
                v-show="selectOrderType==='novisit'"
                @click="showmodel(scope_cz.row.feedBackId,scope_cz.$index)"
              >回访</span>
              <span @click="delmessage(scope_cz.row.feedBackId,scope_cz.$index)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 弹框 -->
      <el-dialog title="回访" :visible.sync="dialogFormVisible">
        <span class="messagetype">留言类型：</span>
        <el-radio-group v-model="dialogtype">
          <el-radio v-for="item in cate" :key="item.typeId" :label="item.typeId">{{item.typeName}}</el-radio>
        </el-radio-group>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="selectBtn">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        v-show="totalCount>0"
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pagesize"
        layout="prev, pager, next"
        :total="totalCount"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { axpGet, axpPost } from "@/utils/axiosPme";
import { getToken } from "@/utils/auth";
export default {
  name: "",
  data() {
    return {
      datevalue: "",
      Namekeywords: "",
      selectOrderType: "novisit",
      tableData: [],
      dialogFormVisible: false, //弹框
      cate: [
        {
          typeId: 1,
          typeName: "回访"
        },
        {
          typeId: 2,
          typeName: "测试"
        },
        {
          typeId: 3,
          typeName: "同行"
        }
      ],
      dialogtype: 1,
      pickerOptions: {
        //date choice
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      totalCount: 0, //总页数
      currentPage: 1, //初始页
      pagesize: 6, //每页的数据

      param: {
        name: "",
        status: 0,
        type: 2,
        times: "",
        pageNo: 1,
        pageSize: 6,
        token: getToken()
      },
      feedid: "", //存储点击的留言id
      feedind: "" //存储点击的索引值
    };
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  },
  created() {
    this.pageData();
  },
  methods: {
    // 获取平台留言数据
    pageData() {
      let param = this.param;
      axpGet("http://hc.6636fu.com/BusinessAfter/FeedBackList", param).then(
        res => {
          console.log(res);
          let ititdtat = res.data;
          for (let f of ititdtat) {
            if (f.details) {
              f.Urladdrrss = f.details.split(",")[1];
              f.content = f.details.split(",")[0];
            }
          }
          this.tableData = ititdtat;
          this.totalCount = res.page.totalCount;
        }
      );
    },
    // 分页功能
    // 初始页currentPage、初始每页数据data
    handleCurrentChange: function(currentPage) {
      this.param.pageNo = currentPage;
      this.pageData();
    },
    // 切换留言类型
    selectOrderTypeFn(e) {
      this.selectOrderType = e;
      if (e === "havevisit") {
        this.param.status = 1;
        this.pageData();
      } else if (e === "novisit") {
        this.param.status = 0;
        this.pageData();
      } else if (e === "visittest") {
        this.param.status = 2;
        this.pageData();
      } else if (e === "sameocupate") {
        this.param.status = 3;
        this.pageData();
      }
    },
    // 弹框
    showmodel(feedId, index) {
      this.dialogFormVisible = true;
      this.feedid = feedId;
      this.feedind = index;
    },
    // chooce the type of visit
    selectBtn() {
      this.dialogFormVisible = false;
      let that = this;
      let feedidtemp = that.feedid,
        dialogstatus = that.dialogtype,
        tableData = that.tableData;
      axpPost("http://hc.6636fu.com/Platform/SetFeedBackStatus", {
        feedbackId: feedidtemp,
        status: dialogstatus,
        token: getToken()
      }).then(res => {
        console.log(res);
        tableData.splice(feedidtemp, 1);
      });
    },
    // 名字关键词搜索
    namesearch() {
      let namekeywords = this.Namekeywords;
      console.log(this.Namekeywords);
      this.param.name = namekeywords;
      this.tableData = [];
      this.pageData();
    },
    // 日期选择
    TimeRange(tr) {
      console.log(tr);
      if (tr == null) {
        this.daterange = "";
      } else {
        let starttime = tr[0],
          endtime = tr[1];
        this.daterange = starttime + "~" + endtime;
      }
    },
    // 日期区间搜索
    datesearch() {
      // this.pageData();
      let daterange = this.daterange;
      console.log(this.daterange);
      this.param.times = daterange;
      this.pageData();
    },
    // 删除留言
    delmessage(feedId, index) {
      let that = this;
      let tableData = that.tableData;
      that
        .$confirm("此操作将永久删除该留言，是否继续？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          axpGet("http://hc.6636fu.com/Platform/FeedBackDelete", {
            feedbackId: feedId,
            token: getToken()
          })
            .then(res => {
              console.log(res);
              tableData.splice(index, 1);
              that.$message({
                type: "success",
                message: "删除成功"
              });
            })
            .catch(err => {});
        });
    }
  }
};
</script>

<style lang="scss">
.InsitituteMsgManage {
  .el-range-editor--medium .el-range-input{
    font-size: 12px;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
  }
  .is-always-shadow {
    min-height: 550px;
    position: relative;
  }
  .Urladdrrss{
    display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 1;
overflow: hidden;
  color: #1985fd;
  }
  .search-box {
    padding: 11px 16px 11px 25px;
    .flexsearch {
      display: flex;
      align-items: center;
      .search-left {
        display: flex;
        align-items: center;
        .search-left-tit {
          padding-right: 13px;
          color: rgb(33, 44, 61);
          font-size: 12px;
        }
        .el-input {
          width: 240px;
          height: 36px;
          margin-right: 10px;
          font-size: 12px;
          .el-input__inner {
            border: 1px solid rgb(186, 200, 217);
            width: 100%;
            height: 34px;
            padding-right: 10px;
            border-radius: 2px;
          }
        }
        .publish-btn {
          width: 60px;
          height: 34px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: rgb(20, 90, 192);
        }
      }
      .pickerbox {
        margin-left: 13px;
        .el-date-editor {
          width: 220px;
          .el-range-input {
            // width: 99%;
          }
          .el-range-separator {
            width: 10%;
          }
        }
        .el-button {
          margin-left: 10px;
        }
      }
      .add-btn {
        width: 80px;
        height: 34px;
        border-radius: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(20, 90, 192);
      }
    }
  }
  .el-dialog__wrapper {
    .el-dialog {
      width: 25%;
    }
    .el-dialog__header {
      background-color: rgb(20, 90, 192);
      text-align: center;
      padding: 14px;
      font-size: 14px;
      .el-dialog__title {
        color: #fff;
      }
      .el-dialog__headerbtn {
        .el-dialog__close {
          color: #fff;
        }
      }
    }
    .el-dialog__body {
      .messagetype {
        margin-right: 10px;
      }
      .el-radio-group {
        .el-radio {
          .el-radio__label {
            color: rgb(114, 128, 146);
            padding-left: 2px;
          }
        }
      }
    }
    .el-dialog__footer {
      display: flex;
      justify-content: center;
      .el-button {
        width: 180px;
        height: 44px;
      }
    }
  }
  .el-pagination {
    position: absolute;
    bottom: 15px;
    left: 0;
    right: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    padding-top: 17px;
    border-top: 1px solid rgb(238, 238, 238);
  }
  .selectOrderClass {
    color: #1f85fb;
    position: relative;
    // display: block;
  }
  .selectOrderClass::before {
    content: "";
    position: absolute;
    border: #1985fd 2px solid;
    width: 24px;
    height: 2px;
    bottom: -10px;
    left: 6px;
  }
  .tab_top {
    height: 36px;
    padding-bottom: 20px;
    width: 98%;
    margin-left: 1%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tab_top_let {
      cursor: pointer;
      color: #728092;
      //    color: #1f85fb;
      font-size: 12px;
      width: 28%;

      a {
        padding-right: 22px;
        padding-left: 6px;
      }
    }
    .tab_top_rig {
      width: 80%;
      display: flex;

      justify-content: flex-end;
    }
  }
  .form_box {
    //   padding: 12px 0px;
    display: flex;
    align-items: center;
    .input_box {
      width: 300px;
      display: flex;
      height: 35px;
      line-height: 35px;
      padding-right: 12px;
      .el-input {
        width: 220px;
      }

      label {
        font-size: 12px;
        width: 80px;
        text-align: right;
        padding-right: 12px;
      }
    }
  }
  .status_t {
    font-size: 12px;
    border: 1px solid #adb7c2;
    color: #adb7c2;
    height: 25px;
    width: 50px;
    text-align: center;
    line-height: 25px;
    border-radius: 3px;
  }
  .status_f {
    height: 25px;
    width: 50px;
    font-size: 12px;
    border: 1px solid #1985fd;
    color: #1985fd;
    height: 25px;
    width: 50px;
    text-align: center;
    line-height: 25px;
    border-radius: 3px;
  }
  .status_c {
    height: 25px;
    width: 50px;
    font-size: 12px;
    border: 1px solid #ffb73d;
    color: #ffb73d;
    height: 25px;
    width: 50px;
    text-align: center;
    line-height: 25px;
    border-radius: 3px;
  }
  .operation {
    color: #1985fd;
    span {
      padding-right: 12px;
      cursor: pointer;
    }
  }
  .el-card__body {
    padding-left: 0;
    padding-right: 0;
  }
  .el-table .cell {
    padding-left: 20px;
    padding-right: 20px;
  }
  .biaotou {
    th {
      background-color: #eeeeee;
    }
  }
}
</style>

