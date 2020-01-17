<template>
  <div class="app-container clientOrder">
    <el-card style="min-height: 550px;position: relative;">
      <div slot="header">
        <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>客户订单
      </div>
      <div class="tab_top">
        <div class="tab_top_let">
          <a
            href="jjavascript:void(0);"
            :class="{'selectOrderClass':selectOrderType==='all'}"
            @click="selectOrderTypeFn('all')"
          >订单信息</a>
          <!-- <a
            href="jjavascript:void(0);"
            :class="{'selectOrderClass':selectOrderType==='refund'}"
            @click="selectOrderTypeFn('refund')"
          >退款订单</a>-->
        </div>
        <div class="tab_top_rig">
          <div class="form_box">
            <div class="input_box">
              <label for>订单号：</label>
              <el-input v-model="orderNum" placeholder="请输入内容"></el-input>
            </div>
          </div>
          <div class="form_box">
            <div class="input_box">
              <label for>下单时间：</label>
              <el-date-picker
                v-model="orderTime"
                value-format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </div>
          </div>
          <div class="select_btn">
            <el-button @click="selOrder" type="primary">查询</el-button>
          </div>
        </div>
      </div>
      <el-table :data="tableData" header-row-class-name="biaotou" style="width: 100%">
        <el-table-column width="300" prop="orderCode" label="订单号"></el-table-column>
        <el-table-column width="360" prop="curriculumName" label="课程名称"></el-table-column>
        <el-table-column width="120" prop="orderPrice" label="金额">
          <template slot-scope="scope_orderPrice">
            <div>￥{{scope_orderPrice.row.orderPrice}}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="ostate" label="审批状态">
          <template slot-scope="scope_ostate">
            <div class="status_f" v-if="scope_ostate.row.ostate==1">进行中</div>
            <div class="status_t" v-if="scope_ostate.row.ostate==0">已完成</div>
            <div class="status_c" v-if="scope_ostate.row.ostate==2">退款中</div>
            <div class="status_t" v-if="scope_ostate.row.ostate==3">已退款</div>
          </template>
        </el-table-column>-->
        <el-table-column prop="addTime" label="下单时间"></el-table-column>
        <el-table-column prop="studySystem" label="学习时间制"></el-table-column>
        <el-table-column label="操作" prop="orderId">
          <template slot-scope="scope_orderId">
            <div class="operation">
              <a href="javascript:(0);" @click="detailsClient(scope_orderId.row.orderId)">详情</a>
              <a
                href="javascript:(0);"
                @click="delClient(scope_orderId.row.orderId,scope_orderId.row.$index)"
                for
              >删除</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
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

      <el-dialog
        :title="dialog"
        height="450px"
        center
        top="22vh"
        :visible.sync="dialogFormVisible"
        width="30%"
      >
      
      <div class="dialogList">
         <div class="dialog_let">学员名称：{{detailsClientDialogList.userName}}</div>
         <div class="dialog_rig">手机号码：{{detailsClientDialogList.userPhone}}</div>
      </div>
      <div class="dialogList">
         <div class="dialog_let">订单号：{{detailsClientDialogList.orderCode}}</div>
         <div class="dialog_rig">课程名称：{{detailsClientDialogList.curriculumName}}</div>
      </div>
      <div class="dialogList">
         <div class="dialog_let">金额：{{detailsClientDialogList.orderPrice}}</div>
         <div class="dialog_rig">学习时间制：{{detailsClientDialogList.studyStystem}}</div>
      </div>
      <div class="dialogList">
        备注：{{detailsClientDialogList.remark}}
      </div>

      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { axpGet } from "@/utils/axiosPme";
export default {
  name: "",
  data() {
    return {
      seleTime: "",
      orderNum: "",
      selectOrderType: "all",
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      orderTime: "",
      tableData: [],
      dialog: "详情",
      dialogFormVisible: false,
      detailsClientDialogList: []
    };
  },

  created() {
    this.getOrderList();
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  },
  methods: {
    detailsClient(id) {
      let pame = {
        orderId: id,
        token: getToken()
      };
      axpGet("http://hc.6636fu.com/BusinessAfter/OrderDetails", pame)
        .then(res => {
          console.log(res);
          this.detailsClientDialogList = res.data;
          this.dialogFormVisible=!this.dialogFormVisible;
        })
        .catch(err => {
          console.log(err);
        });
    },
    delClient(id, ind) {
      //删除
      this.$confirm("此操作将永久删除该数据，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let pame = {
          orderId: id,
          token: getToken()
        };
        axpGet("http://hc.6636fu.com/BusinessAfter/DeleteOrder", pame)
          .then(res => {
            console.log(res);
            this.tableData.splice(ind, 1);
            this.$message.success(res.message + "！！！");
          })
          .catch(err => {
            console.log(err);
          });
      });
    },
    getOrderList() {
      //获取订单列表
      let pame = {
        token: getToken(),
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        orderTime: this.orderTime,
        orderNum: this.orderNum
      };
      axpGet("http://hc.6636fu.com/BusinessAfter/OrderList", pame)
        .then(res => {
          this.tableData = res.data;
          this.totalCount = res.page.totalCount;
          console.log(res);
          // this.$message.success(res.message + "！！！");
        })
        .catch(err => {
          console.log(err);
        });
    },
    selOrder() {
      this.pageNo = 1;
      this.getOrderList();
    },
    //分页修改处理
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);

      this.pageNo = val;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getOrderList();
    }
  }
};
</script>

<style lang="scss" >
.clientOrder {
  .pagination {
    width: 100%;
    padding: 14px 0;
    display: flex;
    justify-content: center;
    // border-top: 1px solid #eee;
    position: absolute;
    bottom: 0px;
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
    left: 22px;
  }
  .tab_top {
    margin-top: 14px;
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
      width: 20%;

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
  .dialogList{
   padding: 12px 0;
   font-size: 16px;
   line-height: 24px
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
    a {
      padding-right: 12px;
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

