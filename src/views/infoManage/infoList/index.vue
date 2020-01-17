<template>
    <div class="app-container infoList">
        <el-card style="min-height: 550px;">
            <div slot="header">
                <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>资讯列表</div>
            <div class="search-box">
                <div class="search-left">
                    <span class="search-left-tit">资讯标题：</span>
                    <el-input v-model="OrderNum" placeholder="请输入资讯标题"></el-input>
                    <el-select v-model="typeName" placeholder="类型">
                        <el-option v-for="item in cate" :key="item.typeId" :value="item.typeId" :label="item.typeName">
                        </el-option>
                    </el-select>
                    <el-button class="publish-btn" type="primary" @click="search()">查询</el-button>
                </div>
            </div>
            <el-table :data="tableData" header-row-class-name="biaotou" style="width: 100%">
                <!-- <el-table-column type="selection" width="55"></el-table-column> -->
                <el-table-column prop="newsTypeName" label="类型" width="120"></el-table-column>
                <el-table-column prop="newsTitle" label="资讯标题" width="380"></el-table-column>
                <!-- <el-table-column prop="auditStatus" label="审批状态" width="160">
                    <template slot-scope="scope_ostate">
                        <div v-if="scope_ostate.row.auditStatus=='已通过'" class="status_f">已通过</div>
                        <div v-if="scope_ostate.row.auditStatus=='待审批'" class="status_t">待审核</div>
                    </template>
                </el-table-column> -->
                <el-table-column prop="addTime" label="更新日期" width="160"></el-table-column>
                <el-table-column prop="readNum" label="访问热度" width="160"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="queans_scope">
                        <div class="operation">
                            <span @click="queansEdit(queans_scope.row.newsId,queans_scope.$index)">编辑</span>
                            <span @click="deletequeans(queans_scope.row.newsId,queans_scope.$index)">删除</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <!-- <el-pagination background layout="prev, pager, next" :total="1000">
            </el-pagination> -->
            <el-pagination v-show="totalCount>0" background @current-change="handleCurrentChange"
                :current-page="currentPage" :page-size="pagesize" layout="prev, pager, next" :total="totalCount">
            </el-pagination>
            <!-- 弹框编辑 -->
            <el-dialog :title="'编辑'" custom-class="vue-neditor-wrap_height" center top="12vh" :visible.sync="editdataVisible" width="70%">
                <el-form :model="editdata">
                    <el-form-item label="上课班期：" prop="newsTypeId" :label-width="formLabelWidth">
                   
                        <el-radio-group v-model="editdata.newsTypeId">
                            <el-radio v-for="item in cate" :key="item.typeId" :label="item.typeId">{{item.typeName}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="标题：" prop="newsTitle" :label-width="formLabelWidth">
                        <div style="margin-left: 0px;">
                            <el-input v-model="editdata.newsTitle"
                                style="width: 200px;height: 34px;margin-right: 15px;">
                            </el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="图片：" :label-width="formLabelWidth">
                        <div class="upload_box">
                            <el-upload class="avatar-uploader" action="http://hc.6636fu.com/BusinessAfter/UploadImg"
                                :show-file-list="false" name="Filedata" :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload" :data="param" :on-progress="uploadProcess"
                                enctype="multipart/form-data">
                                <img v-show="editImg" :src="editImg" class="avatar" />
                                <i v-show="editImg =='' && imgFlag == false">
                                    <div class="upload_icon">
                                        <div>
                                            <span class="iconfont iconshangchuan"></span>
                                            <p>点击上传</p>
                                        </div>
                                    </div>
                                </i>
                                <!-- <el-progress v-show="imgFlag == true" type="circle" :percentage="percent"
                                    style="margin-top: 20px"></el-progress> -->
                            </el-upload>
                            <el-upload class action="http://hc.6636fu.com/BusinessAfter/UploadImg"
                                :show-file-list="false" name="Filedata" :on-success="handleAvatarSuccess"
                                :before-upload="beforeAvatarUpload" :data="param" :on-progress="uploadProcess"
                                enctype="multipart/form-data">
                                <div class="local_upload">本地方上传</div>
                            </el-upload>
                        </div>
                    </el-form-item>
                    <p class="upload_box_tips">该图片用于微站新闻资讯展示，图片大小640px*320px</p>

                    <el-form-item label="详细内容:" :label-width="formLabelWidth">
                        <!-- <el-input type="textarea" :rows="4" placeholder="请输入详细内容" v-model="editdata.newsContent">
                        </el-input> -->
                    </el-form-item>
                     <vue-neditor-wrap  v-model="editdata.newsContent" :config="myConfig" :destroy="false"></vue-neditor-wrap>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button style="width:180px" type="primary" @click="saveInfo()">保存信息</el-button>
                </div>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
import { axpGet } from "@/utils/axiosPme";
import { getToken } from "@/utils/auth";
import { watchs } from "fs";
import VueNeditorWrap from "vue-neditor-wrap";
export default {
    name: "",
    data () {
        return {
            radio: 1,
            typeName: "", //新闻类型id
            tableData1: [],
            seleTime: "",
            OrderNum: "",
            selectOrderType: "all",
            tableData: [],
            totalCount: 0,//总页数
            currentPage: 1, //初始页
            pagesize: 6,    //每页的数据
            cate: [],
            editdata: {
                // newsTypeName: "",
                // newsTitle: "",
                // auditStatus: "",
                // newsContent: "11",
                // newsImg: "",
                // type: []
            },
            param: {
                newfile: "news"
            },
            editImg: '',
            editdataVisible: false,
            imgFlag: false,
            formLabelWidth: "82px",
            percent: 0,
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
        };
    },
    created () {
        //   页面首次加载页面问答数据
        this.pageData();
    },
    components: { VueNeditorWrap }, //富文本
    computed: {
        theme () {
            return this.$store.state.settings.theme;
        }
    },
    methods: {
        // 页面列表数据
        pageData () {
            let pageno = this.currentPage,
                OrderNum = this.OrderNum,
                typeName = this.typeName;
            axpGet("http://hc.6636fu.com/BusinessAfter/NewsList", {
                pageNo: pageno,
                pageSize: 6,
                keyword: OrderNum,
                newsTypeId: typeName,
                token: getToken()
            })
                .then(res => {
                    console.log('资讯列表', res);
                    this.tableData = res.data;
                    this.totalCount = res.page.totalCount;
                    console.log('总条数：', this.totalCount);
                })
                .catch(err => { });
            axpGet("http://hc.6636fu.com/BusinessAfter/NewsTypeList", {
                token: getToken()
            })
                .then(res => {
                    this.cate = res.data;
                })
                .catch(err => { });
        },
        // 分页功能
        // 初始页currentPage、初始每页数据data
        handleCurrentChange: function (currentPage) {
            this.currentPage = currentPage;
            this.pageData();
        },
        // 搜索问答文章
        search () {
            this.currentPage = 1;
            this.pageData();
        },
        // 删除问答文章
        deletequeans (typeid, ind) {
            this.$confirm("此操作将永久删除该数据，是否继续？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                axpGet("http://hc.6636fu.com/BusinessAfter/DeleteNews", {
                    newsId: typeid,
                    token: getToken()
                })
                    .then(res => {
                        this.tableData.splice(ind, 1);
                        this.pageData();
                        this.$message({
                            type: "success",
                            message: "删除" + res.message
                        });
                    })
                    .catch(err => { });
            });
        },
        // 编辑功能
        queansEdit (typeid) {
            this.editImg = "";
            axpGet("http://hc.6636fu.com/BusinessAfter/GetNewsModel", {
                newsId: typeid,
                token: getToken()
            })
                .then(res => {
                    this.editdataVisible = true;
                    this.editdata = res.data;
                    this.editImg = 'http://hc.6636fu.com/' + res.data.newsImg;
                    console.log(res);
                })
                .catch(err => { });
        },
        // 图片上传功能
        handleAvatarSuccess (res, file) {
            this.imgFlag = false;
            this.percent = 0;
            this.editImg = URL.createObjectURL(file.raw);
            console.log(this.editdata.newsImg);
            if (res.code === "00000") {
                this.editdata.newsImg = res.data.returnurl;
                this.$message({
                    type: 'success',
                    message: '上传成功!'
                })
            } else {
                this.$message({
                    type: 'error',
                    message: res.message
                })
            }
        },
        beforeAvatarUpload (file) {
            let _this = this;
            const is2M = file.size / 1024 / 1024 < 2; // 限制小于2M
            if (!is2M) {
                _this.$message.error("图片尺寸限制为640 x 320，大小不可超过2MB-0");
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
            //         this.$message.error("上传的图片尺寸限制为640 x 320，大小不可超过2MB-1");
            //         setTimeout(
            //             "alert('传的图片尺寸限制为640 x 320，大小不可超过2MB-3')",
            //             1000
            //         );
            //         return Promise.reject("err");
            //     }
            // );
        },
        uploadProcess (event, file, fileList) {
            this.imgFlag = true;
            console.log(event.percent);
            this.percent = Math.floor(event.percent);
        },
        // 保存编辑信息
        saveInfo () {
            axpGet("http://hc.6636fu.com/BusinessAfter/UpdateNews", {
                newsId: this.editdata.newsId,
                newsTypeId: this.editdata.newsTypeId,
                newsTitle: this.editdata.newsTitle,
                newsImg: this.editdata.newsImg,
                newsContent: this.editdata.newsContent,
                token: getToken()
            })
                .then(res => {
                    console.log(res);
                    this.editdataVisible = false;
                    this.editImg = "";
                    this.pageData();//重新调用列表数据更新页面
                })
                .catch(err => { });
        }
    }
};
</script>

<style lang="scss">
.infoList {
    .vue-neditor-wrap_height{
        height: 640px!important;
        .el-dialog__body{
            height: 520px!important;
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
        span {
            padding-right: 12px;
            cursor: pointer;
        }
    }
    .el-card__body {
        padding-left: 0;
        padding-right: 0;
        padding-top: 0 !important;
        position: relative;
        min-height: 472px;
        .el-pagination {
            display: flex;
            justify-content: center;
            // margin-top: 60px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
    }
    .el-table .cell {
        padding-left: 20px;
        padding-right: 20px;
        // display: -webkit-box;
        // overflow: hidden;
        // -webkit-box-orient: vertical;
        // -webkit-line-clamp: 1;
        // height: 25px;
    }
    .biaotou {
        th {
            background-color: #eeeeee;
        }
    }
    .el-dropdown {
        border: 1px solid rgb(186, 200, 217);
        width: 100px;
        height: 36px;
        line-height: 36px;
        border-radius: 2px;
    }
    .el-dropdown-link {
        cursor: pointer;
        color: rgb(114, 128, 146);
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        border-radius: 2px;
    }
    .el-icon-arrow-down {
        font-size: 12px;
    }
    .search-box {
        padding: 11px 0 11px 15px;
    }
    .search-left {
        display: flex;
        align-items: center;
        .el-input {
            width: 150px;
            height: 36px;
            margin-right: 10px;
            font-size: 12px;
            .el-input__inner {
                border: 1px solid rgb(186, 200, 217);
                width: 150px;
                height: 36px;
                padding-right: 10px;
                border-radius: 2px;
            }
        }
        .el-select {
            width: 100px;
            height: 36px;
            margin-right: 10px;
            .el-input {
                width: 100%;
            }
            .el-input__inner {
                border: 1px solid rgb(186, 200, 217);
                width: 100%;
                padding-right: 10px;
                border-radius: 2px;
            }
        }
    }
    .search-left-tit {
        padding-right: 13px;
        color: rgb(33, 44, 61);
        font-size: 12px;
    }
    .el-dialog {
        border-radius: 5px;
        overflow: hidden;
        .input_box {
            display: flex;
        }
        .el-dialog__body {
            padding-bottom: 0px;
            height: 400px;
            overflow-y: scroll;
        }
        /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
        ::-webkit-scrollbar {
            width: 5px;
            height: 5px;
            // background-color: #98abc2;
        }

        /*定义滚动条轨道 内阴影+圆角*/
        ::-webkit-scrollbar-track {
            -webkit-box-shadow: inset 0 0 6px rgba(185, 181, 181, 0.3);
            border-radius: 5px;
            background-color: #f5f5f5;
        }

        /*定义滑块 内阴影+圆角*/
        ::-webkit-scrollbar-thumb {
            border-radius: 5px;
            // -webkit-box-shadow: inset 0 0 6px #98abc2;
            background-color: #98abc2;
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

