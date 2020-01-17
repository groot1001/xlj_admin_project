<template>
  <div class="company_info app-container">
    <el-row :gutter="20" class>
      <el-col :span="24" :xs="24">
        <el-card style=" ">
          <div slot="header">
            <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>公司信息
          </div>

          <div class="course_info_form">
            <div class="cif2_01">
              <div class="cif_label">
                <label>*</label>
                <span>公司名称：</span>
              </div>
              <div class="cif2_01-input">
                <span>{{companyName}}</span>
                <!-- <span class="update_com_name cursor_pointer">&nbsp; &nbsp;申请修改</span> -->
              </div>
            </div>

            <div class="cif2_02">
              <div class="cif_label">
                <span>公司简称：</span>
              </div>
              <div class="cif2_02-input">
                <input type="text" v-model="companyInfo.shopAbbreviation" placeholder="请输入" />
              </div>
            </div>

            <div class="cif2_02">
              <div class="cif_label">
                <span>联系电话：</span>
              </div>
              <div class="cif2_02-input">
                <input type="text" v-model="companyInfo.phone" placeholder="请输入号码" />
              </div>
            </div>

            <div class="cif2_02">
              <div class="cif_label">
                <span>公司地址：</span>
              </div>
              <div class="cif2_02-input">
                <el-cascader
                  size="large"
                  :options="addressoptions"
                  v-model="companyInfo.adderssValue"
                  @change="addressChange"
                ></el-cascader>
                <input
                  type="text"
                  class="ml12"
                  v-model="companyInfo.shopAddress"
                  style="width:300px"
                  placeholder="详细地址"
                />
                <!-- <span class="ml12 fc_1985fd cursor_pointer">设置地址位置标注</span> -->
              </div>
            </div>
            <div class="cif2_02">
              <div class="cif_label">
                <span>主营课程：</span>
              </div>
              <div class="cif2_02-input">
                <input type="text" v-model="categoryNameVal" placeholder="请输入您要找的分类名" />
              </div>
            </div>
          </div>
          <div class="mt22">
            <el-tabs type="border-card">
              <el-tab-pane label="选择分类">
                <div class="etp_item">
                  <el-col :span="5" :xs="24">
                    <div class="scroll_box" ref="scroll_box2">
                      <ul class="infinite-list">
                        <li
                          v-for="(i,index) in courseClass"
                          :key="index"
                          class="infinite-list-item"
                          @click="sele_max_class(index)"
                          :class="{active_color:maxClassInd==index}"
                        >
                          <label for>{{ i.categoryBigName }}</label>
                          <span for class="iconfont iconfanhuizuojiantouxiangzuoshangyibuxianxing"></span>
                        </li>
                      </ul>
                    </div>
                  </el-col>
                  <el-col :span="19" :xs="24">
                    <div class="sele_min_class">
                      <div
                        class="smic_item"
                        v-for="(c,ind) in courseClass[maxClassInd].subData"
                        :key="ind"
                      >
                        <div
                          class="smic_item_tit"
                          :class="{active_min_class_color:ind==minClassInd}"
                          @click="sele_min_class(ind)"
                        >{{c.categorySubName}}</div>
                      </div>
                      <div
                        v-if="courseClass[maxClassInd].subData.length==0"
                        class="min_class_null"
                      >暂无数据~</div>
                    </div>
                  </el-col>
                </div>
              </el-tab-pane>
              <!-- <el-tab-pane disabled label="从主营行业中进行选择">从主营行业中进行选择</el-tab-pane> -->
            </el-tabs>
            <div class="select_res">
              <div class="operation_box">
                <div
                  class="oper_add oper_btn cursor_pointer"
                  v-if="courseClass[maxClassInd].subData.length>0"
                  @click="addClass(courseClass[maxClassInd].categoryBigName,courseClass[maxClassInd].subData[minClassInd].categorySubName||'')"
                >添加</div>
                <div
                  class="oper_add oper_btn cursor_pointer"
                  v-else
                  @click="addClass(courseClass[maxClassInd].categoryBigName,null)"
                >添加</div>

                <div
                  class="oper_btn cursor_pointer ml12"
                  @click="delClass()"
                  :class="checkList.length==0?'oper_del_01':'oper_del_02'"
                >删除</div>
              </div>
              <div class="selected_res_box mt22">
                <el-checkbox-group v-model="checkList">
                  <el-checkbox
                    v-for="(item, index) in selected_res_data"
                    :key="index"
                    :label="item"
                  ></el-checkbox>
                </el-checkbox-group>
                <p style="color: #999;" v-show="selected_res_data.length==0">您还未添加数据~</p>
              </div>
            </div>
          </div>
          <div class="cif2_02 mt22">
            <div class="cif_label">
              <span>店铺关键字：</span>
            </div>
            <div class="cif2_02-input">
              <el-tag
                :key="tag"
                v-for="tag in shopsKeyArr"
                closable
                :disable-transitions="false"
                @close="shopsKeyHandleClose(tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="shopsKeyVisible"
                v-model="shopsKeyVal"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="shopsKeyHandleInputConfirm"
                @blur="shopsKeyHandleInputConfirm"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="shopsKeyShowInput">+ 添加</el-button>
            </div>
          </div>
          <!-- <div class="cif2_02 mt22">
            <div class="cif_label">
              <span>课程关键字：</span>
            </div>
            <div class="cif2_02-input">
              <input type="text" style="width:600px" placeholder="请输入您要搜索的课程关键词" />
            </div>
          </div>
          <p class="upload_indicate">字数在3到25字，多个关键词用短”-“隔开。展示在商铺Title上，不要频繁修改，也可为空。</p>-->
          <!-- <div class="cif2_02 mt22">
            <div class="cif_label">
              <span>主要品牌：</span>
            </div>
            <div class="cif2_02-input">
              <el-tag
                :key="tag"
                v-for="tag in brandArr"
                closable
                :disable-transitions="false"
                @close="brandHandleClose(tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="brandVisible"
                v-model="brandVal"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="brandHandleInputConfirm"
                @blur="brandHandleInputConfirm"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="brandShowInput">+ 添加</el-button>
            </div>
          </div>-->
          <!-- <div class="cif2_02 mt22">
            <div class="cif_label">
              <span>注册商标：</span>
            </div>
            <div class="cif2_02-input">
              <el-tag
                :key="tag"
                v-for="tag in trademarkArr"
                closable
                :disable-transitions="false"
                @close="trademarkHandleClose(tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="trademarkVisible"
                v-model="trademarkVal"
                ref="savetrademark"
                size="small"
                @keyup.enter.native="trademarkHandleInputConfirm"
                @blur="trademarkHandleInputConfirm"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="trademarkShowInput">+ 添加</el-button>
            </div>
          </div>-->
          <!-- <div class="cif2_02 mt22">
            <div class="cif_label">
              <label>*</label>
              <span>主营业务：</span>
            </div>
            <div class="cif2_02-input">
              <input type="text" style="width:400px" />
            </div>
          </div>-->
          <div class="cif2_02 mt22">
            <div class="cif_label">
              <label>*</label>
              <span>机构简介：</span>
            </div>
            <div class="cif2_02-input">
              <el-input
                type="textarea"
                maxlength="400"
                :rows="4"
                style=" width:600px"
                placeholder="请输入内容"
                v-model="companyInfo.shopDetails"
                :show-word-limit="true"
              ></el-input>
            </div>
          </div>
          <div class="cif2_02" style="align-items: end;">
            <div class="cif_label">
              <label for>*</label>
              <span>公司logo：</span>
            </div>
            <div class="cif2_02-input">
              <div class="upload_box cursor_pointer">
                <el-upload
                  class="avatar-uploader"
                  accept
                  :name="fileName"
                  :action="doUpl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :data="fileData"
                  :auto-upload="true"
                  :before-upload="beforeAvatarUpload"
                >
                  <img
                    v-show="companyInfo.shopLogo"
                    :src="'http://hc.6636fu.com'+companyInfo.shopLogo"
                    class="avatar"
                  />
                  <i v-show="!companyInfo.shopLogo">
                    <div class="upload_icon">
                      <div>
                        <span class="iconfont iconshangchuan"></span>
                        <p>点击上传</p>
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
                >
                  <div class="local_upload">本地方上传</div>
                </el-upload>
              </div>
            </div>
          </div>
          <p class="upload_indicate">只支持 jpg/gif 图片格式，请尽量使用小图片，图片过大在某些网站发布会无法通过。</p>
          <div class="cif2_02" style="align-items: end;">
            <div class="cif_label">
              <label for>*</label>
              <span>公司照片：</span>
            </div>
            <div class="cif2_02-input">
              <div class="upload_box cursor_pointer">
                <el-upload
                  class="avatar-uploader"
                  accept
                  :name="fileName"
                  :action="doUpl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess2"
                  :data="fileData"
                  :auto-upload="true"
                  :before-upload="beforeAvatarUpload"
                >
                  <img
                    v-show="companyInfo.shopImg"
                    :src="'http://hc.6636fu.com'+companyInfo.shopImg"
                    class="avatar"
                  />
                  <i v-show="!companyInfo.shopImg">
                    <div class="upload_icon">
                      <div>
                        <span class="iconfont iconshangchuan"></span>
                        <p>点击上传</p>
                      </div>
                    </div>
                  </i>
                </el-upload>
                <el-upload
                  accept
                  :name="fileName"
                  :action="doUpl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess2"
                  :data="fileData"
                  :auto-upload="true"
                  :before-upload="beforeAvatarUpload"
                >
                  <div class="local_upload">本地方上传</div>
                </el-upload>
              </div>
            </div>
          </div>
          <p class="upload_indicate">只支持 jpg/gif 图片格式，请尽量使用小图片，图片过大在某些网站发布会无法通过。</p>
          <div class="bottom_btn_box">
            <div class="resetAll_btn cursor_pointer">重置所有</div>
            <div class="saveAll_btn cursor_pointer" @click="saveInfo">保存</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { regionData, CodeToText } from "element-china-area-data";
import { getToken } from "@/utils/auth";
import { axpGet,axpPost } from "@/utils/axiosPme";
import { log } from "util";
export default {
  name: "company_info",
  data() {
    return {
      categoryNameVal: "", //搜索分类
      companyName: "", //公司名称
      companyInfo: {},
      // percent: 0, //logo进度条
      // percent2: 0, //照片进度条
      // imgFlag: false, //logo展示状态
      // imgFlag2: false, //照片展示状态
      // logoUrl: "", //logo路径
      // comUrl: "", //l照片路径
      shopsKeyArr: [],
      shopsKeyVal: "",
      shopsKeyVisible: false,
      // brandArr: ["品牌一", "品牌二", "品牌三"],
      // brandVisible: false,
      // brandVal: "",
      // trademarkArr: ["商标一", "商标二", "商标三"],
      // trademarkVisible: false,
      // trademarkVal: "",
      selected_res_data: [],
      checkList: [], //选择操作的分类集合
      // adderssValue: [],
      maxClassInd: 0,
      minClassInd: 0,
      // maxClassTit: "",
      // minClassTit: "",
      backupsCourseClass:[],
      courseClass: [{ subData: [] }],
      addressoptions: regionData,
      doUpl: "http://hc.6636fu.com/BusinessAfter/UploadImg/",
      fileData: {
        newfile: "shops_info"
      },
      fileName: "Filedata"
    };
  },
  methods: {
    //保存信息
    saveInfo() {
      let compame = this.companyInfo;

      if (this.shopsKeyArr.length > 0) {
        compame.shopKeyword = this.shopsKeyArr.join(",");
      }
      if (this.selected_res_data.length > 0) {
        compame.mineCurriculum = this.selected_res_data.join(",");
      }
      compame.token = getToken();
      compame.shopProvice = compame.adderssValue[0];
      compame.shopCity = compame.adderssValue[1];
      compame.shopArea = compame.adderssValue[2];
      axpPost("http://hc.6636fu.com/BusinessAfter/UpdateBusiness", compame)
        .then(res => {
            if (res.code === "00000") {
        this.$message({
          message: '修改成功~',
          type: "success"
        });
      
      }else{
        this.$message.error(res.message);
      }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //地址
    addressChange(arr) {
      this.companyInfo.shopAddress = ""; //选择区域清空详情
      console.log(CodeToText[arr[0]], CodeToText[arr[1]], CodeToText[arr[2]]);
    },
    //选择大分类
    sele_max_class(ind) {
      this.maxClassInd = ind;
      let distance = 41 * ind;
      this.$refs.scroll_box2.scrollTop = distance;
    },
    //选择小分类
    sele_min_class(ind) {
      this.minClassInd = ind;
    },
    // 添加分类
    addClass(maxClass, minClass) {
      if (minClass == null) {

        this.$message.warning('请选择完整类目~');
        return false;
      }
      let selected_res_data = this.selected_res_data;
      let str = maxClass + ">" + minClass;
      let res = selected_res_data.some(val => val == str);
      if (res) {
        this.$message.warning('您已经选过了~');
      } else {
        selected_res_data.push(str);
        this.selected_res_data = selected_res_data;
      }
    },
    // 删除选择分类
    delClass() {
      let checkList = this.checkList;
      let selected_res_data = this.selected_res_data;
      for (let c of checkList) {
        //循环选中的数组进行findIndex比较，最后删除
        selected_res_data.splice(
          selected_res_data.findIndex(val => val === c),
          1
        );
      }
      this.checkList = [];
    },
    //关键字删除
    shopsKeyHandleClose(tag) {
      this.shopsKeyArr.splice(this.shopsKeyArr.indexOf(tag), 1);
    },
    //关键字展示
    shopsKeyShowInput() {
      this.shopsKeyVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //关键字添加
    shopsKeyHandleInputConfirm() {
      let shopsKeyVal = this.shopsKeyVal;
      if (shopsKeyVal) {
        this.shopsKeyArr.push(shopsKeyVal);
      }
      this.shopsKeyVisible = false;
      this.shopsKeyVal = "";
    },
    // //品牌删除
    // brandHandleClose(tag) {
    //   this.brandArr.splice(this.brandArr.indexOf(tag), 1);
    // },
    // //品牌展示
    // brandShowInput() {
    //   this.brandVisible = true;
    //   this.$nextTick(_ => {
    //     this.$refs.saveTagInput.$refs.input.focus();
    //   });
    // },
    // //品牌添加
    // brandHandleInputConfirm() {
    //   let brandVal = this.brandVal;
    //   if (brandVal) {
    //     this.brandArr.push(brandVal);
    //   }
    //   this.brandVisible = false;
    //   this.brandVal = "";
    // },
    // //商标删除
    // trademarkHandleClose(tag) {
    //   this.trademarkArr.splice(this.trademarkArr.indexOf(tag), 1);
    // },
    // //商标显示
    // trademarkShowInput() {
    //   this.trademarkVisible = true;
    //   this.$nextTick(_ => {
    //     this.$refs.savetrademark.$refs.input.focus();
    //   });
    // },
    // //商标添加
    // trademarkHandleInputConfirm() {
    //   let trademarkVal = this.trademarkVal;
    //   if (trademarkVal) {
    //     this.trademarkArr.push(trademarkVal);
    //   }
    //   this.trademarkVisible = false;
    //   this.trademarkVal = "";
    // },
    //公司logo
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.code === "00000") {
        this.$message({
          message: res.message,
          type: "success"
        });
        this.companyInfo.shopLogo = res.data.returnurl;
      }

      console.log(res);
    },
    handleAvatarSuccess2(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      if (res.code === "00000") {
        this.$message({
          message: res.message,
          type: "success"
        });
        this.companyInfo.shopImg = res.data.returnurl;
      }

      console.log(res);
    },
    // handlePreview(file) {
    //   console.log(file);
    //   if (file.status === "success") {
    //     // this.imageVisiable = true;
    //     this.$nextTick(() => {
    //       this.$refs.showImage.init(file.url);
    //     });
    //   }
    // },

    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      // console.log(file,'----------------')
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    }
  },
  created() {
    axpGet("http://hc.6636fu.com/BusinessAfter/AddCurriculumCategory", {
      //获取课程分类
      token: getToken(),
       isMine:0
    })
      .then(res => {
        this.courseClass = res.data;
        this.backupsCourseClass=[...res.data]
      })
      .catch(err => {
        console.log(err);
      });

    axpGet("http://hc.6636fu.com/BusinessAfter/GetBusinessModel", {
      //获取机构信息
      token: getToken()
    })
      .then(res => {
        console.log(res.data);
        this.companyName = res.data.shopName;
        this.companyInfo = res.data;
        this.companyInfo.adderssValue = [
          res.data.shopProvice,
          res.data.shopCity,
          res.data.shopArea
        ];
        if (res.data.mineCurriculum) {
          this.selected_res_data = res.data.mineCurriculum.split(",");
        }
        if (res.data.shopKeyword) {
          this.shopsKeyArr = res.data.shopKeyword.split(",");
        }
      })
      .catch(err => {
        console.log(err);
      });
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
    }
  },
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  }
};
</script>
<style lang="scss" scoped>
.company_info {
  .el-tabs--border-card {
    box-shadow: none;
    border-bottom: 0;
  }
  .mt22 {
    margin-top: 22px !important;
  }

  .cursor_pointer {
    cursor: pointer;
  }
  .fc_1985fd {
    color: #1985fd;
  }
  .ml12 {
    margin-left: 12px;
  }
  .upload_indicate {
    color: #adb7c2;
    font-size: 12px;
    padding-left: 95px;
  }
  .cif_label {
    width: 80px;
    text-align: right;
    font-size: 12px;
    span {
      color: #212c3d;
    }
    label {
      color: #ff6262;
    }
  }
  .cif2_01 {
    display: flex;
    .cif_label {
      line-height: 40px;
    }
    .cif2_01-input {
      span {
        line-height: 40px;
      }
      .update_com_name {
        font-size: 14px;
        color: #1985fd;
      }
      font-size: 12px;
      margin-left: 12px;
      label {
        padding-right: 22px;
        color: #adb7c2;
      }
      input {
        width: 200px;
      }
    }
  }
  .cif2_02 {
    width: 100%;
    display: flex;
    align-items: center;
    margin-top: 14px;
    .cif2_02-input {
      .el-input {
        border: 1px solid #bac8d9 !important;
      }
      width: 95%;
      display: flex;
      margin-left: 12px;
      font-size: 12px;
      align-items: center;
      input {
        width: 200px;
        border-radius: 5px;
        outline: none;
        border: 1px solid #bac8d9;
        height: 40px;
        padding: 0 12px;
      }
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
  .select_res {
    padding: 10px 12px 22px 22px;
    border: 1px solid #dcdfe6;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    border-top: none;
    .operation_box {
      display: flex;
      .oper_btn {
        width: 120px;
        height: 35px;
        border-radius: 5px;
        line-height: 35px;
        color: #fff;
        text-align: center;
      }
      .oper_add {
        background-color: #1985fd;
      }
      .oper_del_02 {
        background-color: #ff6262;
      }
      .oper_del_01 {
        background-color: #999;
        cursor: not-allowed;
      }
    }
    .selected_res_box {
      padding: 20px;
      width: 100%;
      height: 120px;
      border: 1px solid #dcdfe6;
    }
  }
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
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
    }
  }
  .upload_indicate {
    color: #adb7c2;
    font-size: 12px;
    padding-left: 85px;
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
  .local_upload,
  .company_upload {
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
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  /* .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
} */
  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }
  .bottom_btn_box {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 40px;
    div {
      height: 45px;
      line-height: 45px;
      text-align: center;
      border-radius: 5px;
      width: 180px;
      font-size: 14px;
      margin: 0 22px;
    }
    .resetAll_btn {
      color: #728092;
      border: 1px solid #728092;
    }
    .saveAll_btn {
      color: #fff;
      background-color: #1985fd;
    }
  }
}
</style>