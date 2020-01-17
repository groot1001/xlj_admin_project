<template>
  <div class="techersManage app-container">
    <el-card style="min-height: 550px;">
      <div slot="header">
        <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>师资列表
      </div>
      <div style="padding:14px 22px;">
        <el-button type="text" @click="addTeachers">
          <el-button type="primary">新增教师</el-button>
        </el-button>
      </div>
      <el-table :data="tableData" header-row-class-name="biaotou" style="width: 100%">
        <el-table-column prop="teacherImg" label="照片" width="100">
          <template slot-scope="scope_timg">
            <img
              :src="'http://hc.6636fu.com/'+scope_timg.row.teacherImg"
              alt
              style="width: 50px;height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="teacherName" label="姓名" width="160"></el-table-column>
        <el-table-column prop="teacherTitle" label="职称" width="160">
          <!-- <template slot-scope="scope_cz">{{grades[scope_cz.row.teacherTitle]}}</template> -->
        </el-table-column>
        <el-table-column prop="teacherWork" label="工作经验"></el-table-column>
        <!-- <el-table-column prop="hot" label="关注度" width="160"></el-table-column> -->
        <el-table-column label="操作" width="160">
          <template slot-scope="scope_cz">
            <div class="operation">
              <span @click="teachersEdit(scope_cz.row.id,scope_cz.$index)">编辑</span>
              <span @click="delectTeachers(scope_cz.row.id,scope_cz.$index)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>-->
      <el-dialog
        :title="dialog"
        height="450px"
        center
        top="22vh"
        :visible.sync="dialogFormVisible"
        width="35%"
      >
        <el-form :model="form">
          <el-form-item label="教师照片:" :label-width="formLabelWidth">
            <div class="upload_box">
              <el-upload
                class="avatar-uploader"
                action="http://hc.6636fu.com/BusinessAfter/UploadImg"
                :show-file-list="false"
                name="Filedata"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :data="param"
                :on-progress="uploadProcess"
                enctype="multipart/form-data"
              >
                <img v-show="teaImgOp" :src="teaImgOp" class="avatar" />
                <i v-show="teaImgOp =='' && imgFlag == false">
                  <div class="upload_icon">
                    <div>
                      <span class="iconfont iconshangchuan"></span>
                      <p>点击上传</p>
                    </div>
                  </div>
                </i>
                <el-progress
                  v-show="imgFlag == true"
                  type="circle"
                  :percentage="percent"
                  style="margin-top: 20px"
                ></el-progress>
              </el-upload>
              <el-upload
                class
                action="http://hc.6636fu.com/BusinessAfter/UploadImg"
                :show-file-list="false"
                name="Filedata"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :data="param"
                :on-progress="uploadProcess"
                enctype="multipart/form-data"
              >
                <div class="local_upload">本地方上传</div>
              </el-upload>
            </div>
            <!-- <el-input v-model="form.name" autocomplete="off"></el-input> -->
          </el-form-item>
          <p class="upload_box_tips">举荐尺寸为161*161像素，大小为100K以内.</p>
          <div class="input_box">
            <el-form-item label="姓名：" :label-width="formLabelWidth">
              <el-input v-model="form.tnameVal" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="职称：" :label-width="formLabelWidth">
              <el-select v-model="form.grade" placeholder="请选择">
                <el-option v-for="(item,index) in grades" :key="index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="工作经验:" :label-width="formLabelWidth">
            <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="form.expectVal"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <!-- <el-button @click="dialogFormVisible = false">取 消</el-button> -->
          <el-button style="width:180px" type="primary" @click="saveInfo()">保存信息</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { axpGet, axpPost } from "@/utils/axiosPme";
import { getToken } from "@/utils/auth";
export default {
  name: "techersManage",
  data() {
    return {
      percent: 0,
      imgFlag: false,
      dialog: "新增",
      dialogFormVisible: false,
      grades: ["中级会计师", "高级会计师", "特级会计师"],
      form: {
        tnameVal: "",
        grade: "",
        imageUrl: "",
        expectVal: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      formLabelWidth: "80px",
      tableData: [],
      teacherId: "", //老师id
      dialogImageUrl: "",
      dialogVisible: false,
      param: {
        newfile: "teacher"
      },
      teaImgOp: ""
    };
  },
  created() {
    this.pageData();
  },
  methods: {
    // 页面列表数据
    pageData() {
      axpGet("http://hc.6636fu.com/BusinessAfter/TeacherList", {
        pageNo: 1,
        pageSize: 6,
        token: getToken()
      })
        .then(res => {
          console.log("师资", res);
          this.tableData = res.data;
        })
        .catch(err => {});
    },
    // 图片上传
    handleAvatarSuccess(res, file, fileList) {
      console.log("tupianroute", res);
      this.imgFlag = false;
      this.percent = 0;
      this.teaImgOp = URL.createObjectURL(file.raw);
      if (res.code === "00000") {
        this.form.imageUrl = res.data.returnurl;
        this.$message({
          type: "success",
          message: "上传成功!"
        });
      } else {
        this.$message({
          type: "error",
          message: res.message
        });
      }
      //   let fd = new FormData();
      //   fd.append("file", file);
      //   console.log(fd);
      //   this.$refs.upload.submit();
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    uploadProcess(event, file, fileList) {
      this.imgFlag = true;
      console.log(event.percent);
      this.percent = Math.floor(event.percent);
    },

    addTeachers() {
      this.dialog = "新增";
      let form = this.form;
      if (form.tnameVal) {
        form.imageUrl = "";
        form.tnameVal = "";
        form.grade = "";
        form.expectVal = "";
      }
      this.teaImgOp = "";
      this.dialogFormVisible = true;
    },
    teachersEdit(teaid, ind) {
      this.teacherId = teaid;
      this.dialogFormVisible = !this.dialogFormVisible;
      this.dialog = "编辑";
      let table = this.tableData,
        form = this.form;
      form.imageUrl = table[ind].teacherImg;
      form.tnameVal = table[ind].teacherName;
      form.grade = table[ind].teacherTitle;
      form.expectVal = table[ind].teacherWork;
      this.teaImgOp = "http://hc.6636fu.com/" + table[ind].teacherImg;
    },
    delectTeachers(teaid, ind) {
      this.$confirm("此操作将永久删除该数据，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        axpGet("http://hc.6636fu.com/BusinessAfter/DeleteTeacher", {
          teacherId: teaid,
          token: getToken()
        })
          .then(res => {
            this.tableData.splice(ind, 1);
            this.pageData();
            this.$message({
              type: "success",
              message: res.message
            });
          })
          .catch(err => {});
      });
    },
    saveInfo() {


      console.log("---------------");
      let teacherid = this.teacherId,
        form = this.form;
        if(!form.imageUrl){
           this.$message({
              type: "error",
              message: "请上传图片"
            });
        }
        if(!form.tnameVal){
           this.$message({
              type: "error",
              message: "请请输入姓名"
            });
        }
      if (this.dialog == "编辑") {
        axpPost("http://hc.6636fu.com/BusinessAfter/UpdateTeacher", {
          teacherId: teacherid,
          teacherImg: form.imageUrl,
          teacherName: form.tnameVal,
          teacherTitles: form.grade,
          teacherWorks: form.expectVal,
          schoolId: "",
          token: getToken()
        })
          .then(res => {
            console.log(res);
            this.dialogFormVisible = !this.dialogFormVisible;
            this.pageData();
            this.$message({
              type: "success",
              message: res.message
            });
          })
          .catch(err => {});
      } else {
     
        axpPost("http://hc.6636fu.com/BusinessAfter/AddTeacher", {
          teacherImg: form.imageUrl,
          teacherName: form.tnameVal,
          teacherTitles: form.grade,
          teacherWorks: form.expectVal,
          schoolId: "",
          token: getToken()
        })
          .then(res => {
            this.dialogFormVisible = !this.dialogFormVisible;
            this.pageData();
            this.$message({
              type: "success",
              message: "新增成功"
            });
          })
          .catch(err => {});
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
.techersManage {
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
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    .operation {
      color: #1985fd;
      span {
        padding-right: 12px;
        cursor: pointer;
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
      .el-form .el-form-item {
        margin-bottom: 12px;
      }
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
}
</style>

