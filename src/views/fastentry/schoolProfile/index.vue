<template>
  <div class="schoolProfile app-container">
    <el-card style="min-height: 550px; position: relative;">
      <div slot="header">
        <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>学校简介
      </div>
      <div class="edit_box">
        <div class="edit_item">
          <div class="edit_let">
            <label for>简介图:</label>
          </div>
          <div class="edit_rig">
            <div class="upload_box">
              <el-upload
                class="avatar-uploader"
                :action="doUpl"
                :name="fileName"
                :show-file-list="false"
                :data="fileData"
                :auto-upload="true"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePreview"
              >
                <img v-show="shopImg" :src="'http://hc.6636fu.com'+shopImg" class="avatar" />
                <i v-show="shopImg ==''">
                  <div class="upload_icon">
                    <div>
                      <span class="iconfont iconshangchuan"></span>
                      <p>点击上传图片</p>
                    </div>
                  </div>
                </i>
              </el-upload>

              <el-upload
                accept
                :name="fileName"
                :action="doUpl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :data="fileData"
                :auto-upload="true"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePreview"
              >
                <div class="local_upload">本地方上传尺寸：741*404</div>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="edit_item">
          <div class="edit_let">
            <label for>学校简介:</label>
          </div>
          <div class="edit_rig">
            <el-input
              type="textarea"
              maxlength="800"
              :rows="8"
              placeholder="请输入内容"
              v-model="introduceTextarea"
              :show-word-limit="true"
            ></el-input>
          </div>
        </div>

        <div class="edit_item" style="margin-top: 20px;">
          <div class="edit_let">
            <label for>学校环境照片:</label>
          </div>
          <div class="edit_rig">
            <el-upload
              class="upload-demo"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="schoolImgData"
              list-type="picture"
              multiple
              :limit="3"
              :data="fileData"
              :auto-upload="true"
              :on-success="handleAvatarSuccessList"
              :before-upload="beforeAvatarUpload"
              :action="doUpl"
              :name="fileName"
              :handleExceed="handleExceed"
            >
              <div class="upload_btn">
                <el-button size="small" type="primary">上传照片</el-button>
                <div slot="tip" class="el-upload__tip tip">*每次最多上传3张，按住Ctrl可多选图片；建议尺寸380*250</div>
              </div>
            </el-upload>
            <div class="showimg" v-if="showimg">
              <img :src="showimg" alt />
              <span @click="showImgClose">关闭</span>
            </div>
          </div>
        </div>
      </div>
      <div style="height:66px;"></div>
      <div class="bottom_save">
        <el-button type="primary" @click="saveSchoolInfo">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { axpGet ,axpPost } from "@/utils/axiosPme";

export default {
  name: "schoolProfile",

  data() {
    return {
      doUpl: "http://hc.6636fu.com/BusinessAfter/UploadImg/",
      fileData: {
        newfile: "campus"
      },
      shopId: "",
      fileName: "Filedata",
      shopImg: "",
      introduceTextarea: "",
      schoolImgData: [], //学校图片展示用
      school_from_img: [], //学校图片提交表单用
      showimg: ""
    };
  },
  methods: {
    handleRemove(file, fileList) {
      let simg = [];
      for (let f of fileList) {
        if (!f.url.startsWith("http")) {
          simg.push(
            f.response.data.returnurl.replace("http://hc.6636fu.com", "")
          );
        } else if (f.url.startsWith("http")) {
          simg.push(f.url.replace("http://hc.6636fu.com", ""));
        }
      }
      console.log(simg);
      this.school_from_img = simg;
      // school_from_img.splice(school_from_img.findIndex(item=>(item.replace(/^.+\/([^\/]+)$/, "$1"))==zsimg),1)
    },
    showImgClose(){
      this.showimg=''
    },
    handlePreview(file) {
      console.log(file);
      // if (file.status === "success") {
      //   // this.imageVisiable = true;
      //   this.$nextTick(() => {
      //     this.$refs.showImage.init(file.url);
      //   });
      // }
      this.showimg = file.url;
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

   
      if (!isLt2M) {
        this.$message.error("图片大小不能超过 2MB!");
      }
      return  isLt2M;
    },

    handleAvatarSuccess(res, file) {
      // this.shopImg = URL.createObjectURL(file.raw);
      if (res.code === "00000") {
        this.$message({
          message: res.message,
          type: "success"
        });
        this.shopImg = res.data.returnurl;
        console.log(res.data);
      }

      console.log(res);
    },
    // handleChange(file, fileList) {:on-change="handleChange"
    //   // this.fileList = fileList.slice(-3);
    //   console.log(file, "---------------file");
    // },
    handleAvatarSuccessList(res, file) {
      // this.shopImg = URL.createObjectURL(file.raw);
      if (res.code === "00000") {
        this.$message({
          message: res.message,
          type: "success"
        });
        let tepurl = this.school_from_img;
        // tepurl.push({
        //   name: file.name,
        //   url: res.data.returnurl
        // });
        tepurl.push(res.data.returnurl);
        this.school_from_img = tepurl;
        console.log(tepurl, "-------------a");
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `最多选择 10 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    saveSchoolInfo() {
      //保存信息
      let data = {
        token: getToken(),
        details: this.introduceTextarea,
        shopEvlImg: this.school_from_img.join(","),
        shopImg: this.shopImg
      };
      axpPost("http://hc.6636fu.com/BusinessAfter/UpdateSchoolDetails", data)
        .then(res => {
          console.log(res);
          this.$message({
            message: res.message,
            type: "success"
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  created() {
    let pame = {
      token: getToken()
    };
    axpGet("http://hc.6636fu.com/BusinessAfter/GetSchoolDetails", pame)
      .then(res => {
        console.log(res.data);
        this.shopImg = res.data.shopImg; //简介图
        // let slimg = res.data.schoolImgData;
        let slimg = res.data.shopEvlImgData;
        this.introduceTextarea = res.data.shopDetails;
        this.shopId = res.data.shopId;
        if (slimg) {
          let schoolimg = slimg.map(item => {
            return {
              name: item.shopEvlImg.replace(/^.+\/([^\/]+)$/, "$1"),
              url: "http://hc.6636fu.com" + item.shopEvlImg
            };
          });
          this.schoolImgData = schoolimg;
          // this.school_from_img = schoolimg;
          this.school_from_img = slimg.map(item => item.shopEvlImg);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  }
};
</script>

<style scoped lang="scss">
.edit_box {
  width: 100%;

  .edit_item {
    display: flex;
    width: 100%;
    .edit_let {
      width: 8%;
      text-align: center;
      line-height: 35px;
      font-size: 12px;
    }
    .edit_rig {
      height: 100%;
      position: relative;
      width: 92%;
      .showimg {
        position: fixed;
        top:0px;
        left: 0px;
        z-index: 999999;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        img {
          width: 380px;
          height:250px;
          
        }
        span{
          position: absolute;
          bottom: 140px;
          color: #fff;
          cursor: pointer;
          display: block;
          padding:6px 22px;
          border-radius: 40px;
          background-color: rgba(255, 255 , 255, 0.4)
        }
      }
    }
  }
  .upload_btn {
    display: flex;
    .tip {
      margin-left: 12px;
    }
  }
}
.bottom_save {
  width: 100%;
  position: absolute;
  bottom: 20px;
  display: flex;
  justify-content: center;
  padding-top: 20px;
  button {
    width: 180px;
  }
}
.upload_box {
  // display: flex;
  margin-bottom: 20px;
  .avatar-uploader {
    width: 430px;
    border: 1px dotted #bababa;
    border-radius: 5px;
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
      margin: 0;
      font-style: normal;
      font-size: 14px;
      margin-top: 12px;
    }
  }
  .avatar {
    width: 420px;
    height: 215px;
    display: block;
  }
  .local_upload {
    background-color: #1985fd;
    color: #fff;
    font-size: 12px;
    width: 200px;
    height: 35px;
    border-radius: 5px;
    line-height: 35px;
    text-align: center;
    margin-left: 12px;
    margin-top: 20px;
  }
}
.upload_box_tips {
  font-size: 12px;
  color: #adb7c2;
  padding-left: 8px;
}
.btn_tips {
  font-size: 14px;
  color: #bac8d9;
}
</style>

