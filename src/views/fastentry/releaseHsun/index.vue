<template>
  <div class="releaseHsun app-container">
    <el-row :gutter="20" class>
      <el-col :span="24" :xs="24">
        <el-card style="padding:0;">
          <div slot="header">
            <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>发布资讯
          </div>
          <div class="publishcontent font12">
            <p class="el-warning">该功能只能发布与本公司有关的资讯或新闻信息，禁止发布产品信息，一经发现，直接删除。多次发布违规信息，会直接封号。</p>
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="92px"
              class="demo-ruleForm"
            >
              <el-form-item label="资讯类型：" prop="type">
                <!-- <el-checkbox-group v-model="ruleForm.type">
                                    <el-checkbox label="机构动态" name="type"></el-checkbox>
                                    <el-checkbox label="招生信息" name="type"></el-checkbox>
                                    <el-checkbox label="班级信息" name="type"></el-checkbox>
                                    <el-checkbox label="问答板块" name="type"></el-checkbox>
                </el-checkbox-group>-->
                <el-radio-group v-model="ruleForm.type">
                  <el-radio
                    v-for="item in cate"
                    :key="item.typeId"
                    :label="item.typeId"
                  >{{item.typeName}}</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="标题：" prop="name">
                <div style="margin-left: 0px;">
                  <el-input
                    v-model="ruleForm.name"
                    style="width: 200px;height: 34px;margin-right: 15px;"
                  ></el-input>
                  <span class="biaoti-warn">《标题规范必读》</span>
                </div>
              </el-form-item>
              <el-form-item label="资讯首图：" prop="editImg">
                <div class="imagebox">
                  <div class="cif2_02" style="align-items: end;">
                    <div class="cif2_02-input">
                      <el-upload
                        class="avatar-uploader"
                        action="http://hc.6636fu.com/BusinessAfter/UploadImg"
                        :show-file-list="false"
                        name="Filedata"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :data="param"
                        enctype="multipart/form-data"
                      >
                        <img v-if="editImg" :src="editImg" class="avatar" />
                        <i v-else>
                          <div class="upload_icon">
                            <div>
                              <span class="iconfont iconshangchuan"></span>
                              <p>点击上传课程图片</p>
                            </div>
                          </div>
                        </i>
                      </el-upload>
                      <el-upload
                       
                        action="http://hc.6636fu.com/BusinessAfter/UploadImg"
                        :show-file-list="false"
                        name="Filedata"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload"
                        :data="param"
                        enctype="multipart/form-data"
                      ><div  class='company_upload'>本地上传</div></el-upload>

                      <!-- <div @click="company_upload" class="company_upload">本地上传</div> -->
                    </div>
                  </div>
                  <p class="upload_indicate" style="padding-left: 0;">该图片用于微站新闻资讯展示，图片大小220px*130px</p>
                </div>
              </el-form-item>
              <el-form-item label="详细内容：" prop="delivery">
                <div class="detail-content">
                  <div class="offertit">《关于用户后台发布功能升级的通知》</div>
                  <!-- <textarea v-model="ruleForm.delivery" id="update-offer"></textarea> -->
                    <vue-neditor-wrap  v-model="ruleForm.delivery" :config="myConfig" :destroy="false"></vue-neditor-wrap>
                  <div class="detail-demand">
                    <p>
                      1、请不要直接从word中拷贝粘贴内容到此编辑框中，如需拷贝word内容，请通过编辑器
                      <br />工具栏中的“粘贴为无格式文本”工具将从word中复制的内容粘贴到编辑器框。否则将会导致前台页面出现乱套
                    </p>
                    <p class>2、上传的图片，建议尺寸：宽为874px。</p>
                  </div>
                </div>
              </el-form-item>
              <!-- <el-form-item label="验证码：" prop="desc">
                <div class="identifyCode-right">
                  <div class="testcodebox">
                    <el-input v-model="ruleForm.desc" class="testinput"></el-input>
                    <img src="@/assets/images/QR-Code.png" alt />
                  </div>
                </div>
              </el-form-item> -->
              <!-- <el-form-item prop="agreechecked"> -->
              <div class="agreebox">
                <el-checkbox v-model="agreechecked">
                  同意
                  <span style="color:rgb(25,133,253);">《惠财网往信息发布规则》</span>
                </el-checkbox>
              </div>
              <!-- </el-form-item> -->
            </el-form>
            <el-button class="publish-btn" type="primary" @click="submitForm('ruleForm')">立即发布</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { axpGet,axpPost } from "@/utils/axiosPme";
import { getToken } from "@/utils/auth";
import { watchs } from "fs";
import VueNeditorWrap from "vue-neditor-wrap";
export default {
  name: "releaseHsun",
  data() {
    return {
      ruleForm: {
        name: "",
        delivery: "",
        type: 1,
        resource: "",
        desc: "",
        imageUrl: ""
      },
      rules: {
        name: [{ required: true, message: "请输入标题", trigger: "blur" }],
        delivery: [
          { required: true, message: "请填写详细内容", trigger: "blur" }
        ],
        desc: [{ required: true, message: "请填写验证码", trigger: "blur" }],
        agreechecked: [{ required: true, message: "请勾选同意发布规则", trigger: "blur" }],
        // imageUrl: [{ required: true, message: "请上传图片", trigger: "blur" }]
      },
      param: {
        newfile: "news"
      },
      editImg: "",
      cate: [], //类型id
      agreechecked: false, //同意复选框
       myConfig: {
        // 富文本配置
        serverUrl:
          "http://hc.6636fu.com/BusinessAfter/UploadImg/?newfile=richtext",
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: "/mechanism/NEditor/",
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 280,
        // 初始容器宽度
        initialFrameWidth: "93%",
        // 关闭自动保存
        enableAutoSave: false
      },
      neditorContent: "", //富文本内容
    };
  },
  created() {
    this.getNewsType();
  },
   components: { VueNeditorWrap }, //富文本
  methods: {
    getNewsType() {
      axpGet("http://hc.6636fu.com/BusinessAfter/NewsTypeList", {
        token: getToken()
      })
        .then(res => {
          this.cate = res.data;
        })
        .catch(err => {});
    },
    handleAvatarSuccess(res, file) {
      this.editImg = URL.createObjectURL(file.raw);
      console.log("editimg", this.editImg, "res", res);
      if (res.code === "00000") {
        this.ruleForm.imageUrl = res.data.returnurl;
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
    },
    beforeAvatarUpload(file) {
      let _this = this;
      const is2M = file.size / 1024 / 1024 < 2; // 限制小于2M
      if (!is2M) {
        _this.$message.error("图片尺寸限制为640 x 320，大小不可超过2MB");
        return false;
      }
      // return new Promise(function (resolve, reject) {
      //     let width = 640;
      //     let height = 320;
      //     let _resolve = resolve;
      //     let _reject = reject;
      //     let _URL = window.URL || window.webkitURL;
      //     let img = new Image();
      //     img.onload = function () {
      //         let valid = img.width == width && img.height == height;
      //         valid ? _resolve(img) : _reject("err");
      //     };
      //     img.src = _URL.createObjectURL(file);
      // }).then(
      //     () => {
      //         return file;
      //     },
      //     () => {
      //         this.$message.error("上传的图片尺寸限制为640 x 320，大小不可超过2MB");
      //         setTimeout(
      //             "alert('传的图片尺寸限制为640 x 320，大小不可超过2MB')",
      //             1000
      //         );
      //         return Promise.reject("err");
      //     }
      // );
    },
    company_upload() {
      alert("暂未开发~");
    },
    submitForm(formName) {
      if(!this.agreechecked){
     this.$message.error('请同意相关协议')
     return false;
      }
     
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm.delivery,'this.ruleForm.delivery')
          axpPost("http://hc.6636fu.com/BusinessAfter/AddNewsType", {
            typeId: this.ruleForm.type,
            newsTitle: this.ruleForm.name,
            newsImg: this.ruleForm.imageUrl,
            newsContent: this.ruleForm.delivery,
            token: getToken()
          })
            .then(res => {
              this.ruleForm.name = "";
              this.ruleForm.delivery = "";
              this.ruleForm.type = 1;
              this.ruleForm.resource = "";
              this.ruleForm.desc = "";
              this.ruleForm.imageUrl = "";
              this.agreechecked = false;
              this.imageUrl = "";
              this.$message({
                type: "success",
                message: "发布成功"
              });
              this.$router.push({
                path: "/infoManage/infoList" //跳转的路径
              });
            })
            .catch(err => {});
        } else {
          console.log("请填写完整!!");
          return false;
        }
      });
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
.releaseHsun {
  .font12 {
    font-size: 12px;
  }
  .publishnews {
    padding-bottom: 12px;
    border-bottom: 1px solid rgb(238, 238, 238);
  }
  .publishcontent {
    padding-left: 17px;
  }
  .el-warning {
    font-size: 12px;
    color: rgb(255, 98, 98);
    padding: 10px 0 0 8px;
  }
  .coursetime {
    display: flex;
    color: rgb(33, 44, 61);
    align-items: center;
  }
  .coursetime span {
    padding-right: 13px;
  }
  .el-checkbox__label {
    color: rgb(114, 128, 146) !important;
  }
  .el-checkbox {
    margin-right: 13px !important;
  }
  .biaoti {
    margin-top: 20px;
  }
  .biaoti input {
    width: 200px;
    height: 34px;
    border: 1px solid rgb(186, 200, 217);
    margin-right: 15px;
  }
  .biaoti-tit,
  .detail-tit,
  .testcode-tit {
    color: rgb(33, 44, 61);
    margin-right: 13px;
    label {
      color: #ff6262;
      padding-right: 3px;
    }
  }
  .biaoti-warn {
    color: rgb(255, 98, 98);
  }

  .cif2_02 {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 14px;
    .cif2_02-input {
      width: 95%;
      display: flex;
      margin-left: 12px;
      font-size: 12px;
      align-items: center;
      margin-left: 0;
    }
  }
  .upload_icon {
    width: 130px;
    height: 130px;
    color: #bac8d9;
    display: flex;
    align-items: center;
    justify-content: center;
    span {
      font-size: 40px;
    }
    p {
      font-style: normal;
      margin: 0;
    }
  }
  .upload_indicate {
    color: #adb7c2;
    font-size: 12px;
    padding-left: 85px;
    margin: 0;
    line-height: 24px;
  }
  .local_upload,
  .company_upload {
    background-color: #1985fd;
    color: #fff;
    font-size: 12px;
    width: 120px;
    height: 35px;
    border-radius: 2px;
    line-height: 35px;
    text-align: center;
    margin-left: 12px;
    margin-top: 82px;
  }
  .cif_label {
    //   text-align: right;
    font-size: 12px;
    width: 51px;
    span {
      color: #212c3d;
    }
    label {
      color: #ff6262;
    }
  }
  #update-offer {
    resize: none;
    width: 100%;
    height: 130px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .detailtext {
    display: flex;
    margin-top: 21px;
  }
  .offertit {
    color: rgb(255, 98, 98);
    margin-bottom: 10px;
  }
  .detail-demand {
    padding: 14px 0 15px 16px;
    background-color: rgb(240, 240, 240);
    font-size: 12px;
    margin-top: 6px;
    line-height: 20px !important;
    width: 100%;
  }
  .detail-demand p {
    padding: 0;
    margin: 0;
  }
  .detail-demand p:nth-child(1) {
    color: rgb(114, 128, 146);
  }
  .detail-demand p:nth-child(2) {
    color: rgb(255, 98, 98);
    margin-top: 5px;
  }
  .identifyCode {
    margin-top: 20px;
    display: flex;
  }
  .agreebox {
    margin: 8px 0 0 20px;
    padding-top: 3px;
  }
  .testinput {
    // border: 1px solid rgb(186, 200, 217);
    width: 90px;
    height: 34px;
  }
  .testcode-tit {
    padding-top: 13px;
  }
  .testcodebox {
    display: flex;
  }
  .testcodebox img {
    width: 80px;
    height: 34px;
    margin-left: 10px;
  }
  .publish-btn {
    font-size: 14px;
    width: 180px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgb(25, 133, 253);
    color: #fff;
    border-radius: 4px;
    margin: 0 auto;
    margin-top: 18px;
  }
  .el-card__body {
    padding-top: 0px;
  }
  .el-form-item {
    margin-bottom: 16px;
  }
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 130px;
  height: 130px;
  line-height: 130px;
  text-align: center;
}
.avatar {
  width: 130px;
  height: 130px;
  display: block;
}
</style>
