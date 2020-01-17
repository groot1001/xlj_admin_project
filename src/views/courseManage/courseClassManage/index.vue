<template>
  <div class="app-container courose_class_manage">
    <el-card style="min-height: 550px;">
      <div slot="header">
        <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>管理课程分类
      </div>
      <div>
        <el-table  :data="tableData" header-row-class-name="biaotou" style="width: 100%">
          <el-table-column prop="categoryBigName" label="产品大系列名称"></el-table-column>

          <el-table-column prop="subData" label="拥有的小系列数量">
            <template
              slot-scope="scope_categoryBigName"
            >{{scope_categoryBigName.row.subData.length}}</template>
          </el-table-column>
          <el-table-column prop="sort" label="在商铺上显示的顺序"></el-table-column>
          <!-- <el-table-column prop label="产品小系列相关操作">
            <label for>查看</label>
          </el-table-column>-->
          <el-table-column prop label="相关操作">
            <template slot-scope="scope_cz">
              <!-- <label @click="see_Fn">查看</label> -->
              <label for @click="updataFn(scope_cz.$index)">修改</label>
              <label @click="delectTabelFn(scope_cz.$index)">删除</label>
            </template>
          </el-table-column>
        </el-table>

        <el-dialog
          :title="dialog"
          height="450px"
          center
          top="22vh"
          :visible.sync="dialogFormVisible"
          width="30%"
        >
          <div ref="sbox" class="form_box">
            <el-form :model="form">
              <el-form-item label="大系列名称:" :label-width="formLabelWidth">
                <el-input style="width:240px" v-model="form.maxNameVal" placeholder="请输入内容"></el-input>
              </el-form-item>
              <div class="dialog_tips">
                <p>请您在下面的文本框填写属于此课程大系列的小系列</p>
                <p>名称，如果没有小系列，则不填</p>
              </div>
              <div class="input_box">
                <el-form-item label="排序：" :label-width="formLabelWidth">
                  <el-input style="width:80px" v-model="form.rankVal" placeholder></el-input>
                </el-form-item>
                <el-form-item
                  v-for="(m,index) in form.minValArr"
                  :key="index"
                  label="小系列名称："
                  :label-width="formLabelWidth"
                >
                  <el-input style="width:240px" v-model="m.categorySubName" placeholder="请输入内容"></el-input>
                  <label class="add_input" @click="addMinClassFn" v-if="index==2">添加</label>
                  <label class="del_input" @click="delectClassFn(index)" v-if="index>2">删除</label>
                </el-form-item>
              </div>
            </el-form>
          </div>

          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="dialogFormVisible = false">取 消</el-button> -->
            <el-button style="width:180px" type="primary" @click="saveInfo()">保存信息</el-button>
          </div>
        </el-dialog>
        <div style="height:61px;"></div>
        <div class="pagination">
          <el-pagination
            background
            layout="prev, pager, next"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :total="totalCount"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { axpGet } from "@/utils/axiosPme";
export default {
  name: "courose_class_manage",
  data() {
    return {
      table_ind: 0,
      formLabelWidth: "100px",
      dialogFormVisible: false,
      dialog: "",
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      form: {
        maxNameVal: "",
        rankVal: "",
        minValArr: [
          {
            categorySubName: ""
          },
          {
            categorySubName: ""
          },
          {
            categorySubName: ""
          }
        ]
      }
    };
  },
  methods: {
    saveInfo() {
      this.dialogFormVisible = false;
      let min = this.form;
      console.log(min);

      let rst = min.minValArr.filter(m => m.categorySubName);
      this.tableData[this.table_ind].subData = rst;
       this.getCourseClass() 
      // console.log(this.tableData[this.table_ind].subData);
    },
    // see_Fn() {
    //   this.dialog = "分类信息查看";
    //   this.dialogFormVisible = true;
    // },

    delectTabelFn(ind) {
      //删除
      let table = this.tableData;
      let self = this;
      this.$confirm("您确定要删除次数据吗？", "提示信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "放弃删除"
      })
        .then(() => {
          //删除
          axpGet("http://hc.6636fu.com/BusinessAfter/DeleteCurrCategory", {
            categoryId: table[ind].categoryBigId,
            token: getToken()
          })
            .then(res => {
              console.log(res);
              if (res.code === "00000") {
                self.$message.success("删除成功！！！");

                table.splice(ind, 1);
              } else {
                self.$message.error("删除失败！！！");
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(action => {});
    },
    updataFn(ind) {
      let table = this.tableData,
        fdata = this.form;
      this.table_ind = ind;
      fdata.maxNameVal = table[ind].categoryBigName;
      fdata.rankVal = table[ind].sort;
      fdata.minValArr = [
        { categorySubName: "" },
        { categorySubName: "" },
        { categorySubName: "" }
      ]; //重置一下

      if (table[ind].subData.length >= 3) {
        fdata.minValArr = table[ind].subData;
      } else {
        if (table[ind].subData.length != 0) {
          // console.log(ss);
          for (let c in table[ind].subData) {
            fdata.minValArr[c].categorySubName =
              table[ind].subData[c].categorySubName;
          }
        }
      }
      this.dialog = "分类信息修改";
      this.dialogFormVisible = true;
      this.scrollTopFn();
    },
    addMinClassFn() {
      let min = this.form.minValArr;
      min.push({
        categorySubName: null
      });
      this.scrollTopFn();
    },
    scrollTopFn() {
      // var container=this.$refs.sbox;
      // container.scrollTop = container.scrollHeight;

      this.$nextTick(() => {
        var container = this.$el.querySelector(".form_box");
        container.scrollTop = container.scrollHeight;
      });
    },

    delectClassFn(ind) {
      // let min = this.form.minValArr;
      // min.splice(ind, 1);
      this. getCourseClass() 
    },
    getCourseClass() {

      axpGet("http://hc.6636fu.com/BusinessAfter/CurrCategoryList", {
        //获取课程分类
        token: getToken(),
        pageSize: this.pageSize,
        pageNo: this.pageNo
      })
        .then(res => {
          this.tableData = res.data;
          this.totalCount = res.page.totalCount;
    
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
     //分页修改处理
    handleSizeChange(val) {
      this.pageNo = val;
      this.getCourseClass();
    },
    handleCurrentChange(val) {
      
      this.pageNo = val;
      this.getCourseClass();
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  },
  created() {
    this.getCourseClass();
  },

  mounted() {}

  // watch: {
  //   processData: "scrollToBottom"
  // },
};
</script>

<style lang="scss">
.courose_class_manage {
  position: relative;

  .el-card__body {
    padding: 0;
  }
  .el-table .cell {
    padding-left: 20px;
    padding-right: 20px;
    .status_t {
      font-size: 12px;
      bsort: 1px solid #adb7c2;
      color: #adb7c2;
      height: 25px;
      width: 50px;
      text-align: center;
      line-height: 25px;
      bsort-radius: 3px;
    }
    .status_f {
      height: 25px;
      width: 50px;
      font-size: 12px;
      bsort: 1px solid #1985fd;
      color: #1985fd;
      height: 25px;
      width: 50px;
      text-align: center;
      line-height: 25px;
      bsort-radius: 3px;
    }
    .operation {
      display: flex;
      justify-content: space-around;
      color: #1985fd;
    }
  }
  .biaotou {
    th {
      background-color: #eeeeee;
    }
  }
  .el-table__body {
    label {
      color: #1985fd;
      font-size: 12px;
      padding-right: 24px;
    }
  }
  .pagination {
    width: 100%;
    padding: 14px 0;
    display: flex;
    justify-content: center;
    bsort-top: 1px solid #eee;
    position: absolute;
    bottom: 20px;
  }
  .el-dialog {
    bsort-radius: 5px;
    // overflow-y: scroll;
    // .input_box {
    //   display: flex;
    // }
    .el-form {
    }
    // .form_box::-webkit-scrollbar {
    //   display: none;
    // }

    .form_box::-webkit-scrollbar {
      width: 4px;
      height: 4px;
      background-color: #f5f5f5;
    }

    /*定义滚动条轨道 内阴影+圆角*/
    .form_box::-webkit-scrollbar-track {
      // -webkit-box-shadow: inset 0 0 6px rgba(89,166,254,0.3);
      bsort-radius: 10px;
      background-color: #f5f5f5;
    }

    /*定义滑块 内阴影+圆角*/
    .form_box::-webkit-scrollbar-thumb {
      -webkit-box-shadow: inset 0 0 6px rgba(89, 166, 254, 0.3);
      bsort-radius: 10px;
      // -webkit-box-shadow: inset 0 0 6px rgba(6,6,6,.3);
      // background-color: #666;
    }
    .form_box {
      height: 340px;
      overflow-y: auto;
      transition: all 0.3s;
    }
    .el-dialog__body {
      padding-bottom: 0px;
    }
    .dialog_tips {
      font-size: 12px;
      color: #adb7c2;
      padding-left: 100px;
    }
  }
  .el-dialog__header {
    background-color: #1985fd;
    span {
      color: #fff;
    }
    i {
      color: #fff;
      &:hover {
        color: #fff;
      }
    }
  }
}
</style>

