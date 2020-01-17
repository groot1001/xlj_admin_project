<template>
  <div class="accountManage app-container">
    <el-card style="min-height: 550px;">
      <div slot="header">
        <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>账号列表
      </div>
      <div style="padding:14px 22px;">
        <el-button type="text" @click="addAdmin">
          <el-button type="primary">新增账号</el-button>
        </el-button>
      </div>
      <el-table :data="tableData" header-row-class-name="biaotou" style="width: 100%">
        <el-table-column prop="loginName" label="用户名"></el-table-column>
        <el-table-column prop="userName" label="姓名"></el-table-column>
        <el-table-column prop="userPhone" label="手机号"></el-table-column>
        <el-table-column prop="roleStr" label="等级"></el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope_cz">
            <div class="operation">
              <span @click="adminEdit(scope_cz.$index)">编辑</span>
              <span @click="adminDelect(scope_cz.$index)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :title="dialog"
        height="450px"
        center
        top="15vh"
        :visible.sync="dialogFormVisible"
        width="35%"
      >
        <el-form :model="form">
          <el-form-item label="用户名:" :label-width="formLabelWidth">
            <el-input v-model="form.adminName"></el-input>
            <!-- <el-input v-model="form.adminName" autocomplete="off"></el-input> -->
          </el-form-item>

          <div class="input_box">
            <el-form-item label="密码：" :label-width="formLabelWidth">
              <el-input v-model="form.adminPsw" show-password placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="重复密码" :label-width="formLabelWidth" style="position: relative;">
              <el-input v-model="form.adminPsw2" show-password placeholder="请输入内容"></el-input>
              <div v-show="psw_css===1" class="tpis_pwd">!</div>
            </el-form-item>
          </div>
          <div class="input_box">
            <el-form-item label="姓名：" :label-width="formLabelWidth">
              <el-input v-model="form.userName" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="电话" :label-width="formLabelWidth">
              <el-input v-model="form.userTel" placeholder="请输入内容"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="管理权限:" :label-width="formLabelWidth" style="margin-bottom:0;">
            <el-checkbox v-model="powerAll" @change="powerMaxAll">全部权限</el-checkbox>
          </el-form-item>
          <div class="powerSetBox">
            <div class="item">
              <div class="opItem">
                <el-checkbox
                  :indeterminate="isIndeterminate"
                  v-model="indexCheckAll"
                  @change="handleCheckAllChange"
                >首页</el-checkbox>
                <!-- {{rootList[0].menusName}} -->
              </div>
              <el-checkbox-group v-model="checkedIndex" @change="handleCheckedCitiesChange">
                <el-checkbox
                  v-for="(i,index) in indexPower"
                  :key="index"
                  :label="i.menusId"
                >{{i.menusName}}</el-checkbox>
              </el-checkbox-group>
            </div>

            <!-- <div class="item">
              <div class="opItem">
                <el-checkbox
                  :indeterminate="isIndeterminate_shops"
                  v-model="shopsCheckAll"
                  @change="shopsCheckAllChange"
                >{{rootList[1].menusName}}</el-checkbox>
              </div>
              <el-checkbox-group v-model="checkedShops" @change="shopsCheckedCitiesChange">
                <el-checkbox
                  v-for="(i,index) in shopsPower"
                  :key="index"
                  :label="i.menusId"
                >{{i.menusName}}</el-checkbox>
              </el-checkbox-group>
            </div> -->
            <div class="item">
              <div class="opItem">
                <el-checkbox
                  :indeterminate="isIndeterminate_account"
                  v-model="accountCheckAll"
                  @change="accountCheckAllChange"
                >账户信息</el-checkbox>
              </div>
              <el-checkbox-group v-model="checkedAccount" @change="accountCheckedCitiesChange">
                <el-checkbox
                  v-for="(i,index) in accountPower"
                  :key="index"
                  :label="i.menusId"
                >{{i.menusName}}</el-checkbox>
              </el-checkbox-group>
            </div>
            <!-- <div class="item">
              <div class="opItem">
                <el-checkbox
                  :indeterminate="isIndeterminate_template"
                  v-model="templateCheckAll"
                  @change="templateCheckAllChange"
                >{{rootList[3].menusName}}</el-checkbox>
              </div>
            </div> -->
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button style="width:180px" type="primary" @click="saveInfo()">保存信息</el-button>
        </div>
      </el-dialog>

      <div style="height:61px;" v-if="totalCount"></div>
      <div class="pagination" v-if="totalCount">
        <el-pagination
          background
          layout="prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalCount"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
// const indexOptions = [
//   "快捷入口",
//   "课程管理",
//   "咨询管理",
//   "客户管理",
//   "师资管理",
//   "用户账号管理"
// ];
// const shopsOptions = [
//   "首页设置",
//   "风格设置",
//   "网站板块",
//   "首页板块",
//   "装修移动页面"
// ];
// const accountOptions = ["账户中心"];
// const templateOptions = ["账户管理"];

import { axpGet } from "@/utils/axiosPme";
import { getToken } from "@/utils/auth";
export default {
  name: "techersManage",
  data() {
    return {
      uid: "",
      psw_css: 1,
      isIndeterminate: false,
      isIndeterminate_template: false,
      isIndeterminate_account: false,
      isIndeterminate_shops: false,
      powerAll: false,
      indexCheckAll: false,
      accountCheckAll: false,
      templateCheckAll: false,
      shopsCheckAll: false,
      rootList: [],
      indexPower: [],
      shopsPower: [],
      accountPower: [],
      templatePower: [],
      checkedIndex: [], //检验首页权限
      checkedTemplate: [], //检验模板权限
      checkedShops: [], //检验店铺权限
      checkedAccount: [], //检验账户权限
      percent: 0,
      imgFlag: false,
      dialog: "新增",
      dialogFormVisible: false,
      form: {
        adminName: "",
        adminPsw: "",
        adminPsw2: "",
        userName: "",
        userTel: "",
        power: {
          index: [],
          shopsManage: [],
          accountInfo: [],
          templateManage: []
        }
      },
      formLabelWidth: "80px",
      subAccountPame: {
        pageNo: 1,
        pageSize: 10,
        token: getToken()
      },
      totalCount: 0,
      tableData: []
    };
  },
  beforeCreate() {},
  created() {
    this.getSubAccount();
    this.getRootLsit();
  },
  watch: {
    "form.power": {
      handler(newVal, oldVal) {
        let power_num =
          newVal.index.length +
          newVal.shopsManage.length +
          newVal.accountInfo.length +
          newVal.templateManage.length;
        console.log(power_num, "root--------------");
        if (power_num ==  this.totalRoorNum) {
          this.powerAll = true;
          this.templateCheckAll = true;
        } else {
          this.powerAll = false;
          this.templateCheckAll = false;
        }
      },
      deep: true,
      immediate: true
    },
    "form.adminPsw2": {
      handler(newVal, oldVal) {
        let adminPsw = this.form.adminPsw;
        if (adminPsw && adminPsw === newVal) {
          this.psw_css = 0;
        } else {
          this.psw_css = 1;
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    //获取权限渲染
    getRootLsit() {
      let self = this;
      let pame = {
        token: getToken()
      };
      axpGet("http://hc.6636fu.com/BusinessAfter/AddMenusList", pame)
        .then(res => {
          this.rootList = res.data;
          console.log(res.data, "----------------");
          this.indexPower = res.data[0].childData;
          this.shopsPower = res.data[1].childData;
          this.accountPower = res.data[2].childData;
          this.totalRoorNum=this.indexPower.length+ this.shopsPower.length+this.accountPower.length;
          // console.log(this.totalRoorNum)
          // indexPower: [],
          // shopsPower: [],
          // accountPower: [],length
          // templatePower: [],
        })
        .catch(err => {
          console.log(err);
        });
    },
    //获取列表
    getSubAccount() {
      let pame = this.subAccountPame;
      axpGet("http://hc.6636fu.com/BusinessAfter/UserList", pame)
        .then(res => {
          this.tableData = res.data;
          console.log(res.data, "----------------");
          this.totalCount = res.page.totalCount;
        })
        .catch(err => {
          console.log(err);
        });
    },
    //新增子账号
    addRootUser() {
      this.addUpdFn("http://hc.6636fu.com/BusinessAfter/AddUsers", null);
    },
    //获取子账号模型
    getRootUserModel(uid) {
      let pame = { userId: uid };
      this.uid = uid;
      axpGet("http://hc.6636fu.com/BusinessAfter/GetUserModel", pame)
        .then(res => {
          let {
            userId,
            userName,
            loginName,
            userPhone,
            menusData,
            userPwd
          } = res.data;
          console.log(res.data, "----------------");

          let form = {
            userId,
            adminName: loginName,
            userName: userName,
            userTel: userPhone,
            adminPsw: userPwd,
            adminPsw2: userPwd,
            power: {
              index: menusData[0].childData
                .filter(item => item.isCheck)
                .map(item => item.menusId),
              shopsManage: menusData[1].childData
                .filter(item => item.isCheck)
                .map(item => item.menusId),
              accountInfo: menusData[2].childData
                .filter(item => item.isCheck)
                .map(item => item.menusId),
              templateManage: []
            }
          };
          //首页
          this.checkedIndex = menusData[0].childData
            .filter(item => item.isCheck)
            .map(item => item.menusId);
          this.checkedShops = menusData[1].childData
            .filter(item => item.isCheck)
            .map(item => item.menusId);
          this.checkedAccount = menusData[2].childData
            .filter(item => item.isCheck)
            .map(item => item.menusId);
          this.handleCheckedCitiesChange(this.checkedIndex);
          this.shopsCheckedCitiesChange(this.checkedShops);
          this.accountCheckedCitiesChange(this.checkedAccount);

          this.form = form;
          console.log(form, "---------------------@");
        })
        .catch(err => {
          console.log(err);
        });
    },
    //修改子账号
    updSubAccount() {
      this.addUpdFn("http://hc.6636fu.com/BusinessAfter/UpdateUser", this.uid);
    },
    addUpdFn(url, keyPanme) {
      console.log(this.form);
      let form = this.form;
      if (!form.adminName.replace(/(^\s*)|(\s*$)/g, "")) {
        this.$message.error("用户名为空，请输入！");
        return false;
      }
      if (!form.adminPsw2.replace(/(^\s*)|(\s*$)/g, "")) {
        this.$message.error("密码为空，请设置！");
        return false;
      }
      if (!form.userName.replace(/(^\s*)|(\s*$)/g, "")) {
        this.$message.error("姓名为空，请输入！");
        return false;
      }
      if (!doUserTel_fb(form.userTel)) {
        this.$message.error("您输入的电话格式不正确，请确认！");
        return false;
      }

      let pame = {
        token: getToken(),
        loginName: form.adminName,
        loginPwd: form.adminPsw2,
        username: form.userName,
        userPhone: form.userTel,
        array: [
          ...form.power.index,
          ...form.power.shopsManage,
          ...form.power.accountInfo
        ].join(",")
      };
      if (keyPanme) {
        pame.userId = keyPanme;
      }
      console.log(pame, "tijiao----------");

      axpGet(url, pame)
        .then(res => {
          console.log(res.code, "----------------");
          if (res.code == "99999") {
            this.$message.error(res.message);
          } else if (res.code == "00000") {
            this.$message.success(res.message);
          }

          this.dialogFormVisible = false;
          // this.subAccountPame.pageNo = 1;
          this.getSubAccount();
        })
        .catch(err => {
          console.log(err);
        });

      //验证联系电话
      function doUserTel_fb(phone) {
        var temp = phone.replace(/(^\s*)|(\s*$)/g, "");
        if (temp.length == 0) {
          return false;
        }
        if (!isMobile(temp)) {
          return false;
        }
        return true;
      }
      function isMobile(s) {
        var p = /^[1][3,4,5,7,8][0-9]{9}$/;
        return p.test(s);
      }
    },
    
    //分页修改处理
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      let pame = this.subAccountPame;
      pame.pageNo = val;
      this.getSubAccount();
    },
    handleCurrentChange(val) {
      let pame = this.subAccountPame;
      pame.pageNo = val;
      this.getSubAccount();
    },
    powerMaxAll(v) {
      //全部权限按钮点击了就把所有的权限设置为真
      console.log(v);
      this.checkedIndex = v ? this.indexPower.map(item => item.menusId) : [];
      this.checkedShops = v ? this.shopsPower.map(item => item.menusId) : [];
      this.checkedAccount = v
        ? this.accountPower.map(item => item.menusId)
        : [];
      // this.checkedTemplate = v ? templateOptions : [];//模板管理
      // console.log(this.checkedAccount,'888888888888')
      this.handleCheckedCitiesChange(this.checkedIndex);
      this.shopsCheckedCitiesChange(this.checkedShops);
      // this.templateCheckedCitiesChange();
      this.accountCheckedCitiesChange(this.checkedAccount);

      this.powerAll = v;
      this.indexCheckAll = v;
      this.accountCheckAll = v;
      this.templateCheckAll = v;
      this.shopsCheckAll = v;
    },

    //首页一次性选择
    handleCheckAllChange(val) {
      // console.log("val------", val);
      this.checkedIndex = val ? this.indexPower.map(item => item.menusId) : [];

      this.isIndeterminate = false;
      // console.log("arr", this.checkedIndex);
      this.form.power.index = this.checkedIndex;
    },
    //首页权限当个选择
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.indexCheckAll = checkedCount === this.indexPower.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.indexPower.length;
      // console.log(value, "----------------------s");
      this.form.power.index = value;
    },

    //店铺装修当个选择
    shopsCheckAllChange(val) {
      // console.log("val", val);
      this.checkedShops = val ? this.shopsPower.map(item => item.menusId) : [];
      this.isIndeterminate_shops = false;
      this.form.power.shopsManage = this.checkedShops;
      // console.log("arr", this.checkedShops);
    },
    //店铺装修一次性选择
    shopsCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.shopsCheckAll = checkedCount === this.shopsPower.length;
      this.isIndeterminate_shops =
        checkedCount > 0 && checkedCount < this.shopsPower.length;
      this.form.power.shopsManage = value;
    },
    //账户中心
    accountCheckAllChange(val) {
      // console.log("val", val);
      this.checkedAccount = val
        ? this.accountPower.map(item => item.menusId)
        : [];
      this.isIndeterminate_account = false;
      // console.log("arr", this.checkedAccount);
      this.form.power.accountInfo = this.checkedAccount;
    },

    accountCheckedCitiesChange(value) {
      // console.log(value);
      let checkedCount = value.length;
      this.accountCheckAll = checkedCount === this.accountPower.length;
      this.isIndeterminate_account =
        checkedCount > 0 && checkedCount < this.accountPower.length;
      this.form.power.accountInfo = value;
    },

    //模板管理
    templateCheckAllChange(val) {
      console.log("val", val);
      // this.checkedTemplate = val ? this.templateOptions : [];
      // this.isIndeterminate_template = false;
      // console.log("arr", this.checkedTemplate);
      // this.form.power.templateManage = this.checkedTemplate;
    },
    templateCheckedCitiesChange(value) {
      // let checkedCount = value.length;
      // this.templateCheckAll = checkedCount === this.templatePower.length;
      // this.isIndeterminate_template =
      //   checkedCount > 0 && checkedCount < this.templatePower.length;
      // this.form.power.templateManage = value;
    },

    addAdmin() {
      this.dialog = "新增";
      this.init();
      this.dialogFormVisible = true;
    },
    init() {
      this.checkedIndex = []; //检验首页权限
      this.checkedTemplate = []; //检验模板权限
      this.checkedShops = []; //检验店铺权限
      this.checkedAccount = []; //检验账户权限
      this.isIndeterminate = false;
      this.isIndeterminate_template = false;
      this.isIndeterminate_account = false;
      this.isIndeterminate_shops = false;
      this.powerAll = false;
      this.indexCheckAll = false;
      this.accountCheckAll = false;
      this.templateCheckAll = false;
      this.shopsCheckAll = false;
      this.form = {
        adminName: "",
        adminPsw: "",
        adminPsw2: "",
        userName: "",
        userTel: "",
        power: {
          index: [],
          shopsManage: [],
          accountInfo: [],
          templateManage: []
        }
      };
    },
    //编辑
    adminEdit(ind) {
      this.init();
      this.dialogFormVisible = !this.dialogFormVisible;
      this.dialog = "编辑";
      this.getRootUserModel(this.tableData[ind].userId);
    },
    //删除
    adminDelect(ind) {
      let self = this;
      this.$confirm("您确定要删除次数据吗？", "提示信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "放弃删除"
      })
        .then(() => {
          let table = self.tableData;
          let pame = {
            userId: table[ind].userId
          };
          axpGet("http://hc.6636fu.com/BusinessAfter/DeleteUser", pame)
            .then(res => {
              if (res.code == "00000") {
                table.splice(ind, 1);
                console.log(res);
                self.$message.success("删除成功！！！");
              }else{
                self.$message.error(res.message);
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(action => {});
    },
    //弹框保存
    saveInfo() {
      if (this.dialog == "新增") {
        this.addRootUser();
        // let table = this.tableData,
        //   form = this.form;
        // table.push({
        //   loginName: form.adminName,
        //   userName: form.userName,
        //   userPhone: form.userTel,
        //   roleStr: "子账号"
        // });
      } else if (this.dialog == "编辑") {
        //保存修改
        this.updSubAccount();
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

<style lang="scss">
.accountManage {
  .pagination {
    width: 100%;
    padding: 14px 0;
    display: flex;
    justify-content: center;
    // border-top: 1px solid #eee;
    position: absolute;
    bottom: 0px;
  }
  .biaotou {
    th {
      background-color: #eeeeee;
    }
  }
  .el-card__body {
    padding: 0;
  }
  .el-table .cell {
    padding-left: 20px;
    padding-right: 20px;

    .operation {
      color: #1985fd;
      span {
        padding-right: 12px;
      }
    }
  }
  .el-dialog {
    border-radius: 5px;
    overflow: hidden;
    .input_box {
      display: flex;
    }
    .el-dialog__body {
      padding-bottom: 0px;
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
  .upload_box {
    display: flex;
    .upload_icon {
      width: 130px;
      height: 130px;
      color: #bac8d9;
      border: 1px solid #bababa;
      display: flex;
      align-items: center;
      justify-content: center;
      span {
        font-size: 40px;
      }
      p {
        margin: 0;
        font-style: normal;
      }
    }
    .avatar {
      width: 130px;
      height: 130px;
      display: block;
    }
    .local_upload {
      background-color: #1985fd;
      color: #fff;
      font-size: 12px;
      width: 120px;
      height: 35px;
      border-radius: 5px;
      line-height: 35px;
      text-align: center;
      margin-left: 12px;
      margin-top: 93px;
    }
  }
  .upload_box_tips {
    font-size: 12px;
    color: #adb7c2;
    padding-left: 80px;
  }
  .powerSetBox {
    display: flex;
    border-radius: 2px;
    border: #adb7c2 solid 1px;
    padding: 14px 0;
  }
  .opItem {
    .el-checkbox {
      position: relative;
      width: 96%;
      .el-checkbox__label {
        margin-left: 0;
        margin-right: 0;
        padding-left: 0;
        font-weight: bold;
      }
      .el-checkbox__input {
        position: absolute;
        right: 10px;
      }
    }
  }
  .item {
    width: 25%;
    border-right: 1px solid #eeeeee;
    padding-left: 10px;
    &:last-child {
      border: none;
    }
    .el-checkbox-group {
      label {
        display: inline-block;
        width: 96%;
        padding-left: 6px;
        margin-left: 0;
        margin-right: 0;
        margin-top: 12px;
        position: relative;
      }
      .el-checkbox__label {
        padding-left: 0;
        font-size: 12px;
      }
      .el-checkbox__input {
        position: absolute;
        right: 10px;
        top: 0;
      }
    }
  }
  .tpis_pwd {
    position: absolute;
    top: -10px;
    width: 14px;
    height: 14px;
    right: -15px;
    background: #ff6262;
    border-radius: 100%;
    font-size: 10px;
    line-height: 14px;
    text-align: center;
    color: #fff;
  }
}
</style>

