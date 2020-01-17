 <template>
  <div class="app-container courose_info_manage">
    <el-card style="min-height: 550px;">
      <div slot="header">
        <label for :style="{'color':theme}">●&nbsp; &nbsp;</label>课程信息
      </div>
      <el-table
        :data="tableData"
        style="width: 100%;padding-top:0;"
        header-row-class-name="biaotou"
      >
        <el-table-column label="课程图片" width="100" prop="currImg">
          <template slot-scope="scope_img">
            <img
              :src="'http://hc.6636fu.com/'+scope_img.row.currImg"
              alt
              style="width: 50px;height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="currName" label="标题" width="300"></el-table-column>
        <el-table-column prop="currCategory" label="课程分类"></el-table-column>
        <el-table-column prop="auditStatus" label="审批状态">
          <template slot-scope="scope_status">
            <div class="status_t" v-if="scope_status.row.auditStatus=='已通过'">已通过</div>
            <div class="status_f" v-if="scope_status.row.auditStatus=='待审批'">待审批</div>
            <div v-if="scope_status.row.auditStatus=='审核失败'">
              <el-popover
                class="status_w"
                placement="top-start"
                title="未通过原因"
                width="300"
                trigger="hover"
                :content="scope_status.row.rejectReason"
              >
                <el-button slot="reference">未通过</el-button>
              </el-popover>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="currPrice" label="价格"></el-table-column>
        <el-table-column prop="currWeek" label="课程周期"></el-table-column>
        <el-table-column prop="teacherMethod" label="授课类型"></el-table-column>
        <el-table-column prop="isSell" property="auditStatus" width="200" label="操作">
          <template slot-scope="scope_status">
            <div class="operation">
              <label for @click="toUpldata(scope_status.row.currId)">编辑</label>
              <label>
                <el-button
                  style="padding:0"
                  type="text"
                  @click="deleteCoures(scope_status.row.currId)"
                >删除</el-button>
              </label>
              <el-checkbox
                :disabled="scope_status.row.auditStatus=='已通过'?false:true"
                v-model="scope_status.row.isSell"
                @change="shelf(scope_status.row.currId)"
                true-label="1"
                false-label="0"
              >上架</el-checkbox>
              <!-- v-model="scope_status.row.isSell" 
               :checked="scope_status.row.isSell" 
              -->
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
          :total="pages.totalCount"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { axpGet, axpPost } from "@/utils/axiosPme";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      checked: false,
      pame: {
        token: getToken(),
        pageNo: 1,
        pageSize: 10,
        keyword: "",
        currCategory: "",
        auditStatus: "",
        isSell: ""
      },
      tableData: [],
      pages: {}
    };
  },
  beforeCreate() {},
  created() {
    this.getTablData();
  },
  methods: {
    toUpldata(id) {
      this.$router.push({
        //核心语句
        path: "/courseManage/releaseConrseInfo", //跳转的路径
        query: {
          //路由传参时push和query搭配使用 ，作用时传递参数
          cid: id,
          steps: 2
        }
      });
    },
    getTablData() {
      //列表数据
      let pame = this.pame,
        self = this;
      axpGet("http://hc.6636fu.com/BusinessAfter/CurriculumList", pame)
        .then(res => {
          let intitdata = res.data;
          console.log(res.data);
          for (let f of intitdata) {
            if (f.isSell == 1) {
              f.isSell = true;
            } else if (f.isSell == 0) {
              f.isSell = false;
            }
          }
          console.log(intitdata);
          self.tableData = intitdata;
          self.pages = res.page || self.pages;
          console.log(self.pages);
        })
        .catch(err => {
          console.log(err);
        });
    },
    //分页修改处理
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      let pame = this.pame;
      pame.pageNo = val;
      this.getTablData();
    },
    handleCurrentChange(val) {
      console.log(` ${val} 条`);
      let pame = this.pame;
      pame.pageNo = val;
      this.getTablData();
    },
    shelf(eve) {
      //上下架
      let tableData = this.tableData;
      let pame = {
          curriculumId: eve,
          token: getToken()
        },
        self = this;
      axpGet("http://hc.6636fu.com/BusinessAfter/CurriculumUp", pame)
        .then(res => {
          for (let t of tableData) {
            if (t.currId == eve) {
              t.isSell = res.data.result == 1 ? true : false;
              self.tableData = tableData;
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteCoures(id) {
      let tableData = this.tableData;
      //课程删除
      let pame = {
          currId: id,
          token: getToken()
        },
        self = this;
      this.$confirm("删除改课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axpGet("http://hc.6636fu.com/BusinessAfter/DeleteCurriculum", pame)
            .then(res => {
              console.log(res);
              if (res.code == "00000") {
                this.$message({
                  type: "success",
                  message: res.message
                });
                tableData.splice(tableData.findIndex(t => t.currId == id), 1);
                self.tableData = tableData;
              }
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
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
.courose_info_manage {
  position: relative;
  .el-card__body {
    padding: 0;
  }
  .el-table .cell {
    padding-left: 20px;
    padding-right: 20px;
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

    .status_w {
      font-size: 12px;
      // border: 1px solid #ca0c16;
      color: #ca0c16;
      height: 25px;
      width: 50px;
      text-align: center;
      line-height: 25px;
      border-radius: 3px;
      .el-button--medium {
        color: #ca0c16;
        border: 1px solid #ca0c16;
        padding: 5px;
        font-size: 12px;
      }
      &::before{
        content: '?';
        width: 14px;
        height: 14px;
        border-radius: 100%;
        font-size: 11px;
        background-color: #adb7c2;
        color: #fff;
        position: absolute;
        left:72px;
        top: 30px;
        text-align: center;
        line-height: 14px;
      }
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
    .operation {
      display: flex;
      justify-content: space-around;
      color: #1985fd;
    }
  }
  .biaotou {
    th {
      background-color: #eeeeee;
    }
  }
}
.pagination {
  width: 100%;
  padding: 14px 0;
  display: flex;
  justify-content: center;
  border-top: 1px solid #eee;
  position: absolute;
  bottom: 20px;
}
</style>
