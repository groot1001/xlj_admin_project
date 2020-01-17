<template>
  <div class="qualifications app-container">
    <el-card style="min-height: 550px;">
      <div slot="header">
        <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>师资列表
      </div>
      <div style="padding:14px 22px;">
        <el-button type="text" @click="addTeachers">
          <el-button type="primary">新增证书</el-button>
        </el-button>
      </div>
      <el-table :data="tableData" header-row-class-name="biaotou" style="width: 100%">
        <el-table-column prop="certificateImg" label="证书照片" width="100">
          <template slot-scope="scope_timg">
            <img
              :src="'http://hc.6636fu.com/'+scope_timg.row.certificateImg"
              alt
              style="width: 50px;height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="certificateName" label="证书名称" width></el-table-column>
        <el-table-column prop="sellOrgan" label="发证机构" width></el-table-column>
        <el-table-column prop="startTime" label="生效日期"></el-table-column>
        <el-table-column prop="endTime" label="截止日期" width></el-table-column>
        <el-table-column label="操作" width>
          <template slot-scope="scope_cz">
            <div class="operation">
              <span @click="teachersEdit(scope_cz.$index)">编辑</span>
              <span @click="delectTeachers(scope_cz.$index)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :title="dialog"
        height="450px"
        center
        top="22vh"
        :visible.sync="dialogFormVisible"
        width="35%"
      >
        <el-form :model="form">
          <el-form-item label="证书照片:" :label-width="formLabelWidth">
            <div class="upload_box">
              <el-upload
                class="avatar-uploader"
                :action="doUpl"
                :data="fileData"
                :name="fileName"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <img
                  v-show="form.imageUrl"
                  :src="'http://hc.6636fu.com/'+form.imageUrl"
                  class="avatar"
                />
                <i v-show="form.imageUrl =='' && imgFlag == false">
                  <div class="upload_icon">
                    <div>
                      <span class="iconfont iconshangchuan"></span>
                      <p>点击上传</p>
                    </div>
                  </div>
                </i>
              </el-upload>
              <el-upload
                class
                :action="doUpl"
                :data="fileData"
                :name="fileName"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
              >
                <div class="local_upload">本地方上传</div>
              </el-upload>
            </div>
            <!-- <el-input v-model="form.name" autocomplete="off"></el-input> -->
          </el-form-item>
          <p class="upload_box_tips">格式为png、gif或jpg图片，尺寸为100*100像素，大小为100K以内.</p>
          <div class="input_box">
            <el-form-item label="证书名称:" :label-width="formLabelWidth">
              <el-input v-model="form.tnameVal" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="发证机构:" :label-width="formLabelWidth">
              <el-input v-model="form.mechanismVal" placeholder="请输入内容"></el-input>
            </el-form-item>
          </div>
          <!-- <div class="input_box"> -->
          <el-form-item label="生效日期:" :label-width="formLabelWidth">
            <el-date-picker
              style="width: 100%;"
              value-format="yyyy-MM-dd"
              v-model="dateval"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="TimeRange"
            ></el-date-picker>
          </el-form-item>
          <!-- <el-form-item label="截止日期:" :label-width="formLabelWidth">
              <el-date-picker
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                v-model="form.endDateVal"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
          </el-form-item>-->
          <!-- </div> -->
        </el-form>

        <div slot="footer" class="dialog-footer">
          <!-- <el-button @click="dialogFormVisible = false">取 消</el-button> -->
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
import { axpGet } from "@/utils/axiosPme";
import { getToken } from "@/utils/auth";
export default {
  name: "qualifications",
  data() {
    return {
      totalCount: "",
      qid: "",
      dateval: [],
      doUpl: "http://hc.6636fu.com/BusinessAfter/UploadImg/",
      fileData: {
        newfile: "qualifications"
      },
      fileName: "Filedata",
      percent: 0,
      imgFlag: false,
      dialog: "新增",
      dialogFormVisible: false,
      form: {
        tnameVal: "",
        mechanismVal: "",
        imageUrl: "",
        startDateVal: "",
        endDateVal: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      pame: {
        token: getToken(),
        pageNo: 1,
        pageSize: 10
      },
      formLabelWidth: "80px",
      tableData: []
    };
  },
  created() {
    this.getQualifications();
  },
  methods: {
    //分页修改处理
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      let pame = this.subAccountPame;
      pame.pageNo = val;
      this.getQualifications();
    },
    handleCurrentChange(val) {
      let pame = this.subAccountPame;
      pame.pageNo = val;
      this.getQualifications();
    },
    //证书列表
    getQualifications() {
      let pame = this.pame;
      axpGet("http://hc.6636fu.com/BusinessAfter/GetCertificateList", pame)
        .then(res => {
          console.log(res, "--------------");
          this.tableData = res.data;
          this.totalCount = res.page.totalCount;
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 新增证书
    addQualifications(formVal, url, id) {
      let pame = {
        token: getToken(),
        certificateImg: formVal.imageUrl,
        certificateName: formVal.tnameVal,
        sellOrgan: formVal.mechanismVal,
        startTime: formVal.startDateVal,
        endTime: formVal.endDateVal
      };
      if (id) {
        pame.id = id;
      }
      axpGet(url, pame)
        .then(res => {
          console.log(res);
          this.getQualifications();
          if (res.code == "00000") {
            this.$message.success("操作成功");
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //修改模型
    getQualificationsModel(id) {
      let pame = { id };
      axpGet("http://hc.6636fu.com/BusinessAfter/GetCertificateModel", pame)
        .then(res => {
          console.log(res.data);
          let {
            certificateImg,
            certificateName,
            sellOrgan,
            startTime,
            endTime
          } = res.data;
          let form = this.form;
          form.imageUrl = certificateImg;
          form.tnameVal = certificateName;
          form.mechanismVal = sellOrgan;
          form.startDateVal = startTime;
          form.endDateVal = endTime;
          this.dateval = [startTime, endTime];
        })
        .catch(err => {
          console.log(err);
        });
    },

    //图片上传处理
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error("图片只能是 JPG 格式!");
      // }
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
      }
      return isLt2M;
    },

    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.code === "00000") {
        this.$message({
          message: res.message,
          type: "success"
        });
        this.form.imageUrl = res.data.returnurl;
        console.log(res.data);
      }

      console.log(res);
    },
    handlePreview(file) {
      console.log(file);
      if (file.status === "success") {
        this.imageVisiable = true;
        this.$nextTick(() => {
          this.$refs.showImage.init(file.url);
        });
      }
    },

    addTeachers() {
      this.dialog = "新增";
      let form = this.form;
      if (form.tnameVal) {
        form.imageUrl = "";
        form.tnameVal = "";
        form.mechanismVal = "";
        form.startDateVal = "";
        form.endDateVal = "";
      }
      this.dialogFormVisible = true;
    },
    TimeRange(e) {
      console.log(e);
      let form = this.form;
      form.startDateVal = e[0];
      form.endDateVal = e[1];
    },
    teachersEdit(ind) {
      console.log(ind);
      let table = this.tableData;
      let form = this.form;
      if (form.tnameVal) {
        form.imageUrl = "";
        form.tnameVal = "";
        form.mechanismVal = "";
        form.startDateVal = "";
        form.endDateVal = "";
      }
      this.getQualificationsModel(table[ind].id);
      this.dialogFormVisible = true;
      this.dialog = "编辑";
      this.qid = table[ind].id;
    },
    delectTeachers(ind) {
      let table = this.tableData;
      let self = this;
      this.$confirm("您确定要删除次数据吗？", "提示信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "放弃删除"
      })
        .then(() => {
          //删除
          axpGet("http://hc.6636fu.com/BusinessAfter/DeleteCertificate", {
            id: table[ind].id,
            token: getToken()
          })
            .then(res => {
              console.log(res);
              if (res.code === "00000") {
                self.$message.success("删除成功！！！");
                self.getQualifications(); //更新一下
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
    //表单弹框
    saveInfo() {
      let form = this.form;
      if (form.tnameVal == "") {
        this.$message.error("请输入证书名称");
        return false;
      }
    
       
        // form.startDateVal = "";
        // form.endDateVal = "";
      if (form.imageUrl == "") {
        this.$message.error("请上传图片");
        return false;
      }
      if (form.mechanismVal == "") {
        this.$message.error("请输入");
        return false;
      }
      if (form.startDateVal == "") {
        this.$message.error("请输入选择日期");
        return false;
      }
      this.dialogFormVisible = false;
      if (this.dialog === "编辑") {
        this.addQualifications(
          form,
          "http://hc.6636fu.com/BusinessAfter/UpdateCertificate",
          this.qid
        );
      } else if (this.dialog == "新增") {
        this.addQualifications(
          form,
          "http://hc.6636fu.com/BusinessAfter/AddCertificateList"
        );
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
.qualifications {
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
      .el-date-editor {
        width: 172px;
      }
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
  .pagination {
    width: 100%;
    padding: 14px 0;
    display: flex;
    justify-content: center;
    // border-top: 1px solid #eee;
    position: absolute;
    bottom: 0px;
  }
}
</style>

