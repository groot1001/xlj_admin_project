<template>
  <div class="writeInfo">
    <div class="w_course_info_box">
      <el-card>
        <div slot="header">
          <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>课程基本信息
        </div>
        <div class="course_info_form">
          <div class="cif_top">
            <div class="cif_label">
              <label>*</label>
              <span>分类：</span>
            </div>
            <div class="cif_rig_input">
              <span>{{seleClassRstmodel[0].categoryBigName}} > {{seleClassRstmodel[1].categorySubName}}</span>
              <label @click="updaClass" for>&nbsp; &nbsp;修改课程分类</label>
            </div>
          </div>
          <div class="cif_header">
            <div class="cif_label">
              <label>*</label>
              <span>关键词：</span>
            </div>
            <div class="cifh_rig_input">
              <input type="text" v-model="currKeyword[0]" placeholder="商品关键词1" />
              <input type="text" v-model="currKeyword[1]" placeholder="商品关键词2" />
              <input type="text" v-model="currKeyword[2]" placeholder="商品关键词3" />
              <input type="text" v-model="currKeyword[3]" placeholder="商品关键词4" />
              <input type="text" v-model="currKeyword[4]" placeholder="商品关键词5" />
              <div style="margin-left:12px;color:#adb7c2;">
                商品关键词用于商品匹配，并影响到搜索排名。关键词建议填写商品专业名称、别称、习惯叫法等，切勿填写与商品无关的词汇。最多可填写5个关键词，每个文本框一个关键词，每个关键词不可超
                过12个字符
                <p>，无需添加标点符号。</p>
              </div>
            </div>
          </div>
          <div class="cif_footer">
            <div class="cif_label">
              <label>*</label>
              <span>信息标题：</span>
            </div>
            <div class="ciff_input">
              <input type="text" v-model="infoTitVal" />
              <p>
                勿使用联系人、联系方式、疑问词句，特殊字符及堆砌关键词。建议包含：品牌+型号+商品关键词。
                <label>标题规范必读</label>
              </p>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="w_course_info_box">
      <el-card>
        <div slot="header">
          <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>课程参数和价格
        </div>
        <div class="course_info_form">
          <div class="cif2_01">
            <div class="cif_label">
              <label>*</label>
              <span>课程价格：</span>
            </div>
            <div class="cif2_01-input">
              <input
                type="text"
                :disabled="currPrice_checkbox"
                v-model="currPrice"
                placeholder="请输入价格"
              />
              <label>元</label>
              <el-checkbox v-model="currPrice_checkbox" label="电话咨询"></el-checkbox>
            </div>
          </div>
          <div class="cif2_01">
            <div class="cif_label">
              <label>*</label>
              <span>原格：</span>
            </div>
            <div class="cif2_01-input">
              <input
                type="text"
                :disabled="currPrice_checkbox"
                v-model="currMarkprice"
                placeholder="请输入"
              />
            </div>
          </div>
          <div class="cif2_02">
            <div class="cif_label">
              <span>上课班期：</span>
            </div>
            <div class="cif2_02-input">
              <el-radio-group v-model="scheduleRadio">
                <el-radio v-for="s in schedule" :key="s.id" :label="s.id">{{s.name}}</el-radio>
              </el-radio-group>
            </div>
          </div>
          <div class="cif2_02">
            <div class="cif_label">
              <span>课程周期：</span>
            </div>
            <div class="cif2_02-input">
              <el-select v-model="courseDataValue" placeholder="请选择">
                <el-option
                  v-for="(item,index) in cycle"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="cif2_02">
            <div class="cif_label">
              <span>课程类型：</span>
            </div>
            <div class="cif2_02-input">
              <el-select v-model="courseTypeValue" placeholder="请选择">
                <el-option
                  v-for="item in courseType"
                  :key="item.cid"
                  :label="item.cname"
                  :value="item.cid"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="cif2_02">
            <div class="cif_label">
              <span>上课地点：</span>
            </div>
            <div class="cif2_02-input">
              <!-- <el-cascader
                size="large"
                :options="addressoptions"
                v-model="adderssValue"
                @change="addressChange"
              ></el-cascader>-->
              <el-select v-model="schoolsValue" placeholder="学联校区">
                <el-option
                  v-for="item in schools"
                  :key="item.schoolId"
                  :label="item.schoolName"
                  :value="item.schoolId"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="cif2_02">
            <div class="cif_label">
              <span>所属教师：</span>
            </div>
            <div class="cif2_02-input">
              <el-select v-model="courseTeacher" placeholder="请选择">
                <el-option
                  v-for="item in courseTeacherArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="cif2_01">
            <div class="cif_label">
              <label>*</label>
              <span>适合人群：</span>
            </div>
            <div class="cif2_01-input">
              <input type="text" v-model="FitValue" placeholder="请输入" />
            </div>
          </div>
          <div class="cif2_01">
            <div class="cif_label">
              <label>*</label>
              <span>课时：</span>
            </div>
            <div class="cif2_01-input">
              <input type="text" v-model="classHour" placeholder="请输入" />
            </div>
          </div>
          <div class="cif2_01">
            <div class="cif_label">
              <label>*</label>
              <span>排序：</span>
            </div>
            <div class="cif2_01-input">
              <input type="text" v-model="sort" placeholder="请输入排序号" />
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="w_course_info_box">
      <el-card>
        <div slot="header">
          <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>图片和详情说明
        </div>
        <div class="course_info_form">
          <!-- 首图 -->
          <div class="cif2_02" style="align-items: end;">
            <div class="cif_label">
              <label for>*</label>
              <span>课程首图：</span>
            </div>
            <div class="cif2_02-input">
              <el-upload
                class="avatar-uploader cindex"
                :action="doUpl"
                :name="fileName"
                :show-file-list="false"
                :data="fileData"
                :auto-upload="true"
                :on-success="(res, file)=>{return handleAvatarSuccess(res, file,'index0')}"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePreview"
                objectBind="index0"
              >
                <img v-show="imageUrl" :src="imageUrl" class="avatar" />
                <i v-show="imageUrl ==''">
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
                :on-success="(res, file)=>{return handleAvatarSuccess(res, file,'index0')}"
                :data="fileData"
                :auto-upload="true"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePreview"
              >
                <div class="local_upload">本地方上传</div>
              </el-upload>

              <!-- <div @click="company_upload" class="company_upload">公司相册</div> -->
            </div>
          </div>
          <p class="upload_indicate">请尽量使用小图片，图片过大在某些网站发布会无法通过。建议尺寸：250*150</p>

          <!-- 详情图 -->
          <div class="cif2_02" style="align-items: end;">
            <div class="cif_label">
              <label for>*</label>
              <span>详情图：</span>
            </div>
            <div class="cif2_02-input">
              <el-upload
                class="avatar-uploader"
                :action="doUpl"
                :name="fileName"
                :show-file-list="false"
                :data="fileData2"
                :auto-upload="true"
                :on-success="(res, file)=>{return handleAvatarSuccess(res, file,'index1')}"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePreview"
                objectBind="index1"
              >
                <img v-show="imageUrl01" :src="imageUrl01" class="avatar0" />
                <i v-show="!imageUrl01">
                  <div class="upload_icon">
                    <div>
                      <span class="iconfont iconshangchuan"></span>
                      <p>点击上传课程详情图</p>
                    </div>
                  </div>
                </i>
              </el-upload>

              <el-upload
                accept
                :name="fileName"
                class
                :action="doUpl"
                :show-file-list="false"
                :on-success="(res, file)=>{return handleAvatarSuccess(res, file,'index1')}"
                :data="fileData"
                :auto-upload="true"
                :before-upload="beforeAvatarUpload"
                :on-preview="handlePreview"
              >
                <div class="local_upload">本地方上传</div>
              </el-upload>

              <!-- <div @click="company_upload" class="company_upload">公司相册</div> -->
            </div>
          </div>
          <p class="upload_indicate">请尽量使用小图片，图片过大在某些网站发布会无法通过。建议尺寸：500*300</p>
          <!-- <div class="cif2_02" style="align-items: end;margin-top:30px;">
            <div class="cif_label">
              <label for>*</label>
              <span>课程特色：</span>
            </div>
            <div class="cif2_02-input">
              <div class="course_feature">
                <p>建议您从产品性能、用途以及产品细节介绍等方面来描述。信息内容请不要带网址，不要重复内容，否则会删除、</p>
                <span>产品介绍一定不能堆砌大量关键字，否则会直接删除，严重者直接删除账号，永不再开。请慎重发布信息。《关于用户后台发布功能升级通知》</span>
                <div class="course_feature_textarea">
                  <el-input
                    type="textarea"
                    maxlength="800"
                    :rows="8"
                    placeholder="请输入内容"
                    v-model="textarea"
                    :show-word-limit="true"
                  ></el-input>
                </div>
                <div class="course_feature_hint">
                  <p>1、不同的课程，内容不能雷同，尤其注意内容的开始和结尾部分不能相同，否则会被删除。</p>
                  <p>2、内容的开始部分，至少出现完整的关键字一到两次，同时避免罗列。</p>
                  <p>3、内容里不能出现联系方式，手机号，微信，二维码等。</p>
                  <p>4、内容长度请在8000字以内，不能少于80字。</p>
                </div>
              </div>
            </div>
          </div>-->

          <div class="cif2_02" style="align-items: end;margin-top:30px;">
            <div class="cif_label">
              <label for>*</label>
              <span>课程介绍：</span>
            </div>
            <div class="cif2_02-input">
              <div class="course_feature">
                <!-- <p>建议您从机构简介等方面来描述，信息内容不要带网址，不要重复内容，否则会删除。</p> -->
                <div class="course_feature_textarea">
                  <!-- <el-input
                    type="textarea"
                    maxlength="800"
                    :rows="8"
                    placeholder="请输入内容"
                    v-model="textarea2"
                    :show-word-limit="true"
                  ></el-input>-->

                  <vue-neditor-wrap
                    v-if="neditor"
                    v-model="neditorContent"
                    :config="myConfig"
                    :destroy="false"
                  ></vue-neditor-wrap>
               
                </div>
                <div style="margin-top:14px;">
                  <el-checkbox v-model="ruleChecked">
                    <span style="color:#728092">同意</span>
                    <label style="color:#1985fd">
                      <a>《惠财网往信息发布规则》</a>
                    </label>
                  </el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <div class="bottom_btn">
        <div @click="stepsChangeone(1)">上一步</div>
        <div @click="stepsChangeone(3)">{{cid?'修改发布':'立即发布'}}</div>
      </div>
    </div>
  </div>
</template>

<script>
// import { regionData, CodeToText } from "element-china-area-data";
import { watchs } from "fs";
import { getToken } from "@/utils/auth";
import { axpGet, axpPost } from "@/utils/axiosPme";
import VueNeditorWrap from "vue-neditor-wrap";
export default {
  name: "writeInfo",
  // props: ["seleClassRst","uplCouresmodel"],
  props: {
    seleClassRst: Array,
    cid: String
  },
  data() {
    return {
      seleClassRstmodel: [],
      doUpl: "http://hc.6636fu.com/BusinessAfter/UploadImg/",
      fileData: {
        newfile: "course"
      },
      fileData2: {
        newfile: "course2"
      },

      fileName: "Filedata",
      // percent: 0,
      // imgFlag: false,
      infoTitVal: "", //信息标题
      ruleChecked: true, //同意规则
      currKeyword: new Array(5),
      currPrice: "", //价格
      currPrice_checkbox: false, //电话咨询
      schedule: [], //接收后台的班期数据
      scheduleRadio: 0, //班期选择结果
      cycle: [],
      courseType: [{ cname: "面授", cid: 1 }, { cname: "线上", cid: 2 }], //授课方式
      courseTeacherArr: [], //所属教师
      schools: [], //校区
      courseDataValue: "", //上课周期
      courseTypeValue: "", //课程类型
      courseTeacher: "", //所属教师
      schoolsValue: "", //学联校区
      // adderssValue: [],
      // addressoptions: regionData,
      imageUrl: "", //临时路径首图临时
      imageUrl01: "", //临时路径详情临时
      courseImg: "", //返回的真实路径，首图
      courseImg01: "", //返回的真实路径,详情图
      FitValue: "", //适合人群
      classHour: "", //课时
      neditorContent: "", //富文本内容
      // neditorContent2:"数据还没来",//备份
      sort: 99, //排序
      currMarkprice: "", //原价
      myConfig: {
        // 富文本配置
        serverUrl:
          "http://hc.6636fu.com/BusinessAfter/UploadImg/?newfile=richtext",
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: "/mechanism/UEditor/",
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 280,
        // 初始容器宽度
        initialFrameWidth: "93%",
        // 关闭自动保存
        enableAutoSave: false
      },
      neditor: false
    };
  },
  components: { VueNeditorWrap }, //富文本
  computed: {
    theme() {
      return this.$store.state.settings.theme;
    }
  },

  created() {
    this.seleClassRstmodel = this.seleClassRst;
    let courseInfo = this.$store.state.user.courseInfo;
    let cid = this.cid;
    console.log(this.cid, "修改数据模型-cid");

    if (cid) {
      console.log(cid, "----");
      let pame = {
        currId: cid,
        token: getToken()
      };
      axpGet("http://hc.6636fu.com/BusinessAfter/GetCurriculumModel", pame)
        .then(res => {
          console.log(res.data, "获取修改数据");
          let uplCouresmodel = res.data;

          this.seleClassRstmodel = [
            //存储分类
            {
              categoryBigName: uplCouresmodel.currBigCateName,
              currBigCateId: uplCouresmodel.currBigCateId
            },
            {
              categorySubName: uplCouresmodel.currSubCateName,
              categorySubId: uplCouresmodel.currSubCateId
            }
          ];

          if (uplCouresmodel.currKeyword) {
            //关键词
            this.currKeyword = uplCouresmodel.currKeyword.split(",");
          }
          this.infoTitVal = uplCouresmodel.currTitle; //标题
          if (uplCouresmodel.currPrice == "电话咨询") {
            this.currPrice_checkbox = true;
          }
          this.currPrice = uplCouresmodel.currPrice; //价格
          this.currMarkprice = uplCouresmodel.currMarkprice; //价格
          this.scheduleRadio = uplCouresmodel.currClassType; //班期
          this.courseDataValue = uplCouresmodel.currWeek; //周期
          this.courseTypeValue = uplCouresmodel.currTeacherMethod; //授课类型
          this.schoolsValue = uplCouresmodel.schoolId; //授课地点
          this.courseTeacher = uplCouresmodel.teacherId; //所属教师
          if (uplCouresmodel.currProfile) {
            //临时使用简介字段
            this.FitValue = uplCouresmodel.currProfile.split(",")[0]; //适合人群
            this.classHour = uplCouresmodel.currProfile.split(",")[1]; //课时
          }
          this.sort = uplCouresmodel.sort; //排序
          this.imageUrl = "http://hc.6636fu.com/" + uplCouresmodel.currImg; //临时路径
          this.imageUrl01 =
            "http://hc.6636fu.com/" + uplCouresmodel.currDetailsImg; //临时路径
          this.courseImg = uplCouresmodel.currImg; //存储图片变量
          this.courseImg01 = uplCouresmodel.currDetailsImg; //存储图片变量
          this.neditorContent = uplCouresmodel.currDetails;
          this.neditor = true;//等数据有了之后再加载富文本编辑器
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      
      if (Object.keys(courseInfo).length != 0) {
        //获取缓存数据

        this.infoTitVal = courseInfo.infoTitVal; // 信息标题
        this.ruleChecked = courseInfo.ruleChecked; // 同意规则
        this.currPrice = courseInfo.currPrice;
        this.currMarkprice = courseInfo.currMarkprice;
        this.currPrice_checkbox = courseInfo.currPrice_checkbox;
        this.scheduleRadio = courseInfo.scheduleRadio;
        this.courseDataValue = courseInfo.courseDataValue;
        this.courseTypeValue = courseInfo.courseTypeValue;
        this.courseTeacher = courseInfo.courseTeacher;
        this.schoolsValue = courseInfo.schoolsValue;
        this.imageUrl01 = "http://hc.6636fu.com/" + courseInfo.courseImg01;
        this.imageUrl = "http://hc.6636fu.com/" + courseInfo.courseImg;
        this.courseImg = courseInfo.courseImg;
        this.courseImg01 = courseInfo.courseImg01;
        this.FitValue = courseInfo.FitValue;
        this.classHour = courseInfo.classHour;
        this.neditorContent = courseInfo.neditorContent;
        this.currKeyword = courseInfo.currKeyword;
        this.sort = courseInfo.sort;
        this.neditor = true;//等数据有了之后再加载富文本编辑器
      }else{
        this.neditor = true;//没有数据直接加载富文本编辑器
      }
    }

    axpGet("http://hc.6636fu.com/BusinessAfter/GetCurrClassType", {
      //获取课程班期
    })
      .then(res => {
        this.schedule = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    axpGet("http://hc.6636fu.com/BusinessAfter/GetCurrWeek", {
      //获取课程周期
    })
      .then(res => {
        this.cycle = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    axpGet("http://hc.6636fu.com/businessafter/getteacher", {
      //获取教师列表
      token: getToken()
    })
      .then(res => {
        this.courseTeacherArr = res.data;
      })
      .catch(err => {
        console.log(err);
      });
    axpGet("http://hc.6636fu.com/BusinessAfter/GetSchool", {
      //获取校区列表
      token: getToken()
    })
      .then(res => {
        this.schools = res.data;
      })
      .catch(err => {
        console.log(err);
      });

    // console.log(this.seleClassRst)
  },
  methods: {
    ready(editorInstance) {},
    updaClass() {
      this.$emit("stepsChange", 1);
      this.$store.state.user.courseInfo = {
        /***存入缓存 */
        infoTitVal: this.infoTitVal, // 信息标题
        ruleChecked: this.ruleChecked, // 同意规则
        currPrice: this.currPrice,
        currMarkprice: this.currMarkprice,
        currPrice_checkbox: this.currPrice_checkbox,
        scheduleRadio: this.scheduleRadio,
        courseDataValue: this.courseDataValue,
        courseTypeValue: this.courseTypeValue,
        courseTeacher: this.courseTeacher,
        schoolsValue: this.schoolsValue,
        courseImg: this.courseImg,
        courseImg01: this.courseImg01,
        FitValue: this.FitValue,
        classHour: this.classHour,
        neditorContent: this.neditorContent,
        currKeyword: this.currKeyword,
        sort: this.sort
      };
    },
    // addressChange(arr) {
    //   console.log(this.adderssValue);
    //   console.log("-------------");
    //   console.log(arr);
    //   console.log(CodeToText[arr[0]], CodeToText[arr[1]], CodeToText[arr[2]]);
    // },
    handleAvatarSuccess(res, file, index) {
      if (res.code === "00000") {
        this.$message({
          message: res.message,
          type: "success"
        });
        if (index == "index0") {
          this.imageUrl = URL.createObjectURL(file.raw);
          this.courseImg = res.data.returnurl;
        } else if (index == "index1") {
          this.courseImg01 = res.data.returnurl;
          this.imageUrl01 = URL.createObjectURL(file.raw);
        }
      }
      console.log(index);
    },
    handlePreview(file) {
      // console.log(file);
      if (file.status === "success") {
        // this.imageVisiable = true;
        this.$nextTick(() => {
          this.$refs.showImage.init(file.url);
        });
      }
    },

    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      // console.log(file,'----------------')
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!");
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },

    //  uploadProcess(event, file, fileList) {
    //   this.imgFlag = true;
    //   console.log(event.percent);
    //   this.percent = Math.floor(event.percent);
    // },
    company_upload() {
      alert("暂未开发~");
    },
    stepsChangeone(e) {
      //切换按钮

      if (e == 1) {
        this.$emit("stepsChange", e);
        this.$store.state.user.courseInfo = {
          /***存入缓存 */

          infoTitVal: this.infoTitVal, // 信息标题
          ruleChecked: this.ruleChecked, // 同意规则
          currPrice: this.currPrice,
          currMarkprice: this.currMarkprice,
          currPrice_checkbox: this.currPrice_checkbox,
          scheduleRadio: this.scheduleRadio,
          courseDataValue: this.courseDataValue,
          courseTypeValue: this.courseTypeValue,
          courseTeacher: this.courseTeacher,
          schoolsValue: this.schoolsValue,
          courseImg: this.courseImg,
          courseImg01: this.courseImg01,
          FitValue: this.FitValue,
          classHour: this.classHour,
          neditorContent: this.neditorContent,
          currKeyword: this.currKeyword,
          sort: this.sort
        };
      } else if (e == 3) {
        let currKeyword = this.currKeyword.filter(item => item);

        if (currKeyword.length == 0) {
          this.$message.error("请任填写一项关键字!");
          return false;
        }
        if (this.infoTitVal == "") {
          this.$message.error("请填写标题!");
          return false;
        }
        if (this.courseImg == "") {
          this.$message.error("请上传图片!");
          return false;
        }
        if (this.currPrice == "") {
          this.$message.error("请输入价格!");
          return false;
        }
        if (this.scheduleRadio == 0) {
          this.$message.error("请填选班期!");
          return false;
        }
        if (this.courseDataValue == "") {
          this.$message.error("请填选课程周期!");
          return false;
        }
        if (this.schoolsValue == "") {
          this.$message.error("请填上课地点!");
          return false;
        }
        if (this.courseTeacher == "") {
          this.$message.error("请填选教师!");
          return false;
        }
        if (this.courseTypeValue == "") {
          this.$message.error("请填选课程类型!");
          return false;
        }
        if (this.FitValue == "") {
          this.$message.error("请填选适合人群!");
          return false;
        }
        if (this.classHour == "") {
          this.$message.error("请填选课时!");
          return false;
        }

        console.log(this.seleClassRstmodel[1].categorySubId, "xc");
        let pame = {
          token: getToken(),
          currBigCateId: this.seleClassRstmodel[0].currBigCateId, //大类
          currSubCateId: this.seleClassRstmodel[1].categorySubId, //小类
          isMine: 0,
          currKeyword: currKeyword.join(","),
          currTitle: this.infoTitVal, // 信息标题
          currImg: this.courseImg,
          currDetailsImg: this.courseImg01,
          currPrice: this.currPrice,
          currMarkprice: this.currMarkprice,
          currClassType: this.scheduleRadio,
          currWeek: this.courseDataValue,
          schoolId: this.schoolsValue,
          currTeacherMethod: this.courseTypeValue,
          teacherId: this.courseTeacher,
          currProfile: this.FitValue + "," + this.classHour,
          // FitValue: this.FitValue,
          // classHour: this.classHour,
          currDetails: this.neditorContent,
          sort: Number(this.sort)
        };
        if (this.cid) {
          console.log();
          pame.currId = this.cid;
        }
        console.log(pame);
        let addApi = "http://hc.6636fu.com/BusinessAfter/AddCurriculum";
        let uplApi = "http://hc.6636fu.com/BusinessAfter/UpdateCurriculum";
        // console.log(this.cid ? uplApi : addApi);
        axpPost(this.cid ? uplApi : addApi, pame)
          .then(res => {
            console.log(res);
            if (res.code == "00000") {
              this.$message.success(res.message);
              this.$emit("stepsChange", e);
            } else {
              this.$message.error(res.message);
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    }
    //  beforeunloadFn (e) {
    //     e = e || window.event;

    //   // 兼容IE8和Firefox 4之前的版本
    //   if (e) {
    //     e.returnValue = "关闭提示";
    //   }

    //   // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
    //   return "关闭提示";
    // }
  },
  mounted() {
    //  window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
  },
  //   beforeDestroy(){
  //     alert('系统肯不会保存您所做的更改！')
  //   },
  watch: {
    currPrice_checkbox(val, oldval) {
      //监听价格操作
      if (val) {
        this.currPrice = "电话咨询";
        this.currMarkprice=''
      } else {
        this.currPrice = "";
        
      }
    }
  }
};
</script>

<style lang="scss">
.w_course_info_box {
  margin-bottom: 22px;
  input,
  select {
    border-radius: 5px;
    outline: none;
    border: 1px solid #bac8d9;
    height: 35px;
    padding: 0 12px;
  }

  .course_info_form {
    .cif_label {
      width: 70px;
      text-align: right;
      font-size: 12px;
      span {
        color: #212c3d;
      }
      label {
        color: #ff6262;
      }
    }
    .cif_top {
      display: flex;

      .cif_rig_input {
        margin-left: 12px;
        font-size: 12px;
        span {
          color: #212c3d;
          font-weight: bold;
        }
        label {
          color: #1985fd;
        }
      }
    }
    .cif_header {
      display: flex;

      .cif_label {
        line-height: 59px;
      }
      .cifh_rig_input {
        font-size: 12px;
        input {
          margin: 12px;

          width: 198px;
        }
      }
    }
  }
  .cif_footer {
    display: flex;
    .cif_label {
      line-height: 35px;
    }
    .ciff_input {
      margin-left: 12px;
      font-size: 12px;
      input {
        width: 620px;
      }
      p {
        color: #adb7c2;
        margin-bottom: 0;
      }
      label {
        color: #ff6262;
      }
    }
  }
  .cif2_01 {
    display: flex;
    .cif_label {
      line-height: 35px;
    }
    .cif2_01-input {
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
      width: 95%;
      display: flex;
      margin-left: 12px;
      font-size: 12px;
      align-items: center;
    }
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
  }
}
.upload_indicate {
  color: #adb7c2;
  font-size: 12px;
  padding-left: 85px;
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
.course_feature {
  width: 100%;
  font-size: 12px;
  p {
    color: #728092;
    margin-top: 0;
  }
  span {
    color: #ff6262;
  }
  .course_feature_textarea {
    width: 100%;
    margin-top: 22px;
    width: 100%;
    textarea {
      width: 100%;
    }
  }
}
.course_feature_hint {
  padding: 12px 12px 1px 12px;

  background-color: #f0f0f0;
  margin-top: 22px;
}
.bottom_btn {
  width: 100%;
  display: flex;
  justify-content: center;
  div {
    text-align: center;
    margin-top: 40px;
    width: 180px;
    height: 45px;
    font-size: 14px;
    border-radius: 5px;
    line-height: 45px;
  }
  div:first-child {
    border: #bac8d9 1px solid;
    color: #bac8d9;
  }
  div:last-child {
    background-color: #1985fd;
    color: #fff;
    margin-left: 22px;
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
/* .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
} */
.avatar {
  width: 250px;
  height: 150px;
  display: block;
}
.avatar0 {
  width: 500px;
  height: 300px;
  display: block;
}
.cif2_01 {
  margin-top: 14px;
}
</style>

