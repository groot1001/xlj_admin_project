<template>
  <div class="campusManage app-container">
    <el-card style="min-height: 550px;position: relative;">
      <div slot="header">
        <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>校区列表
      </div>
      <div style="padding:14px 22px;">
        <el-button type="text" @click="addCampus">
          <el-button type="primary">新增校区</el-button>
        </el-button>
      </div>
      <el-table :data="campusData" header-row-class-name="biaotou" style="width: 100%">
        <el-table-column prop="schoolImg" label="校区照片" width="100">
          <template slot-scope="scope_simg">
            <img
              :src="'http://hc.6636fu.com'+scope_simg.row.schoolImg"
              alt
              style="width: 50px;height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="schoolName" label="校区名称" width="160"></el-table-column>
        <el-table-column prop="schoolArea" label="区域" width="200"></el-table-column>
        <el-table-column prop="schoolAddress" label="地址"></el-table-column>
        <el-table-column prop="schoolPhone" label="电话" width="160"></el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope_cz">
            <div class="operation">
              <span class="cursor_pointer" @click="campusEditTabel(scope_cz.row.id)">编辑</span>
              <!-- <span @click="delCampusTabel(scope_cz.$index)">删除</span> -->
              <span class="cursor_pointer" @click="delCampusTabel(scope_cz.row.id)">删除</span>
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
        width="50%"
      >
        <div class="form_box">
          <el-form :model="form">
            <el-form-item label="校区照片:" :label-width="formLabelWidth">
              <div class="upload_box">
                <!-- <el-upload
                  class="upload-demo"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  list-type="picture"
                  multiple
                  :on-success="handleAvatarSuccess"
                  :limit="10"
                >
                  <div class="upload_btn">
                    <el-button size="small" type="primary">上传照片</el-button>
                    <span slot="tip" class="upload_box_tips">*每次最多上传10张，按住Ctrl可多选图片</span>
                   
                  </div>
                </el-upload>-->
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
                  <img
                    v-show="form.schoolImg"
                    :src="'http://hc.6636fu.com'+form.schoolImg"
                    class="avatar"
                  />
                  <i v-show="form.schoolImg ==''">
                    <div class="upload_icon">
                      <div>
                        <span class="iconfont iconshangchuan"></span>
                        <p>点击上传课程图片</p>
                      </div>
                    </div>
                  </i>
                  <!-- <el-progress
                  v-show="imgFlag == true"
                  type="circle"
                  :percentage="percent"
                  style="margin-top: 20px"
                  ></el-progress>-->
                </el-upload>

                <el-upload
                  accept
                  :name="fileName"
                  class
                  :action="doUpl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :data="fileData"
                  :auto-upload="true"
                  :before-upload="beforeAvatarUpload"
                  :on-preview="handlePreview"
                >
                  <div class="local_upload">本地方上传</div>
                </el-upload>
                <p style="    margin-left: 12px;
    margin-top: 93px;">建议尺寸：455*292</p>
              </div>
            </el-form-item>
            <div class="input_box">
              <el-form-item label="校区名称:" :label-width="formLabelWidth">
                <el-input v-model="form.schoolName" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="电话:" :label-width="formLabelWidth">
                <el-input v-model="form.schoolPhone" placeholder="请输入内容"></el-input>
              </el-form-item>
              <el-form-item label="区域:" :label-width="formLabelWidth">
                <el-cascader
                  size="large"
                  :options="options"
                  v-model="form.areaCodeValue"
                  @change="addressChange"
                ></el-cascader>
              </el-form-item>
            </div>
            <el-form-item label="详细地址:" :label-width="formLabelWidth">
              <el-input type="text" placeholder="请输入内容" v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="校区介绍:" :label-width="formLabelWidth">
              <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="form.schoolDetails"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
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
          :total="page.totalCount"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { regionData, CodeToText } from "element-china-area-data";
import { getToken } from "@/utils/auth";
import { axpGet,axpPost} from "@/utils/axiosPme";
import { log } from "util";

export default {
  name: "campusManage",
  data() {
    return {
      pame: {
        //请求参数
        token: getToken(),
        pageNo: 1,
        pageSize: 10
      },
      doUpl: "http://hc.6636fu.com/BusinessAfter/UploadImg/",
      fileData: {
        newfile: "campus"
      },
      fileName: "Filedata",
      options: regionData,
      fileList: [],
      percent: 0,
      imgFlag: false,
      dialog: "新增",
      dialogFormVisible: false,
      page: {},
      form: {
        token: getToken(),
        schoolName: "", //校区名称
        schoolImg: "", //logo
        schoolPhone: "", //电话
        address: "", //详细地址
        proviceCode: "", //省码
        cityCode: "", //市码
        areaCode: "", //区码
        schoolDetails: "", //校区介绍
        lng: "", //经度
        lat: "", //纬度,
        areaCodeValue: [this.proviceCode, this.proviceCode, this.areaCode]
      },
      formLabelWidth: "80px",
      campusData: [],
      schoolId:''
 
    };
  },
  created() {
    let self = this;
    self.loadData(self.pame, self); //获取校区列表
  },
  methods: {
    addressChange(arr) {
      //选择地区操作函数
      // console.log(arr);
      // console.log(CodeToText[arr[0]], CodeToText[arr[1]], CodeToText[arr[2]]);
      this.form.proviceCode = arr[0];
      this.form.cityCode = arr[1];
      this.form.areaCode = arr[2];
      this.form.address =
        CodeToText[arr[0]] + CodeToText[arr[1]] + CodeToText[arr[2]];
    },

    addCampus() {
      //点击添加按钮
       this.del_pame(this);
      this.dialog = "新增校区";
      let form = this.form;
      // if (form.schoolName) {

      // }
      this.dialogFormVisible = true;
    },

    campusEditTabel(sid) {
      this.del_pame(this);
      //点击列表的修改
      this.getSchoolItem(sid);
      this.dialogFormVisible = !this.dialogFormVisible;
      this.dialog = "编辑校区";
      
    },

    //获取校区信息函数
    getSchoolItem(schoolId) {
      let self = this;
      this.schoolId=schoolId;
      axpGet("http://hc.6636fu.com/BusinessAfter/GetSchoolModel", {
        schoolId,
        token: getToken()
      })
        .then(res => {
          console.log(res);
          self.form = {
            token: getToken(),
            schoolName: res.data.schoolName, //校区名称
            schoolImg: res.data.schoolImg, //logo
            schoolPhone: res.data.schoolPhone, //电话
            address: res.data.address, //详细地址
            proviceCode: res.data.proviceCode, //省码
            cityCode: res.data.cityCode, //市码
            areaCode: res.data.areaCode, //区码
            schoolDetails: res.data.schoolDetails, //校区介绍
            lng: res.data.lng, //经度
            lat: res.data.lat, //纬度
            areaCodeValue: [
              res.data.proviceCode,
              res.data.cityCode,
              res.data.areaCode,
              
            ]
          };
        })
        .catch(err => {
          console.log(err);
        });
    },

    delCampusTabel(schoolId) {
      let self = this;
      this.$confirm("您确定要删除次数据吗？", "提示信息", {
        distinguishCancelAndClose: true,
        confirmButtonText: "确认",
        cancelButtonText: "放弃删除"
      })
        .then(() => {
          //删除
          axpGet("http://hc.6636fu.com/BusinessAfter/DeleteSchool", {
            schoolId,
            token: getToken()
          })
            .then(res => {
              console.log(res);
              if (res.code === "00000") {
                self.$message.success("删除成功！！！");
                self.loadData(self.pame, self); //更新一下
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
    del_pame(self) {
      console.log('---------------------------------------------')
      //清空表单缓存函数
      self.form.schoolName = ""; //校区名称
      self.form.schoolImg = ""; //logo
      self.form.schoolPhone = ""; //电话
      self.form.address = ""; //详细地址
      self.form.proviceCode = ""; //省码
      self.form.cityCode = ""; //市码
      self.form.areaCode = ""; //区码
      self.form.schoolDetails = ""; //校区介绍
      self.form.lng = ""; //经度
      self.form.lat = ""; //纬度
      self.form.areaCodeValue = [];
      
    },
    saveInfo() {
      //保存校区
      if(!this.form.schoolImg){
        this.$message.error("请上传图片！！！");
       return false;
      }
      
      if(!this.form.schoolName){
        this.$message.error("请上请输入校区名称！！！");
       return false;
      }
      if(!this.form.proviceCode){
        this.$message.error("请上选择城市！！！");
       return false;
      }
  
      if (this.dialog === "新增校区") {
        this.coordinate("http://hc.6636fu.com/BusinessAfter/AddSchool");
      } else if (this.dialog === "编辑校区") {
        //修改校区操作
        this.coordinate("http://hc.6636fu.com/BusinessAfter/UpdateSchool");
      }
    },
    //坐标转换
    coordinate(url) {


      let self = this;
      let address = self.form.address;
      let geocoder = null;
      geocoder = new qq.maps.Geocoder();

      geocoder.getLocation(address);
      //设置服务请求成功的回调函数
      geocoder.setComplete(function(result) {
        //转换坐标
        self.form.lng = result.detail.location.lng;
        self.form.lat = result.detail.location.lat;
        self.operateSchool(url, self.form, self);
      });
      //若服务请求失败，则运行以下函数
      geocoder.setError(function() {
        
        self.$message.error("出错了，请输入正确的地址！！！");
      });
    },
    operateSchool(url, pame, self) {
      //校区内容操作函数
          console.log('--------------------url',url)
          if(this.schoolId){
            pame.schoolId=this.schoolId
          }
      axpPost(url, pame)
        .then(res => {
          console.log(res)
          if (res.code === "00000") {
            self.$message({
              message: "操作成功",
              type: "success"
            });
            self.dialogFormVisible = !self.dialogFormVisible; //关闭弹框
            self.del_pame(self); //添加完成之后，立即清空表单缓存
            self.loadData(self.pame, self); //添加完成之后，刷新一下
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    loadData(pame, self) {
      //更新函数
      axpGet("http://hc.6636fu.com/BusinessAfter/SchoolList", pame)
        .then(res => {
          console.log(res);
            self.campusData = res.data;
       
          self.page = res.page;
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
        this.form.schoolImg = res.data.returnurl;
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

    // beforeAvatarUpload(file) {
    //   // const isJPG = file.type === "image/jpeg";
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   // console.log(file,'----------------')
    //   // if (!isJPG) {
    //   //   this.$message.error("上传头像图片只能是 JPG 格式!");
    //   // }
    //   if (!isLt2M) {
    //     this.$message.error("上传头像图片大小不能超过 2MB!");
    //   }
    //   // return isJPG && isLt2M;
    //   return isLt2M;
    // },
    //分页修改处理
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      let pame = this.pame;
      pame.pageNo = val;
      this.loadData(this.pame, this);
    },
    handleCurrentChange(val) {
      let pame = this.pame;
      pame.pageNo = val;
      this.loadData(this.pame, this);
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
.campusManage {
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
      // border: 1px solid #bababa;
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
    padding-left: 8px;
  }

  .form_box::-webkit-scrollbar {
    display: none;
  }
  .form_box {
    height: 443px;
    overflow-y: auto;
    transition: all 0.3s;
  }
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
.cursor_pointer {
  cursor: pointer;
}
</style>

