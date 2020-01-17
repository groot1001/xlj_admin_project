<template>
  <div id="notice">
    <h2>消息通知</h2>
    <el-card style="min-height:500px">
      <div class="noticeList" v-for="(item,index) in notice" :key="index">
        <div class="noticeListTtem">
          <div class="tit">
            {{item.name}}
            <span>{{item.addTime}}</span>
          </div>
          <div class="content">{{item.content}}</div>
        </div>
      </div>
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
  data() {
    return {
      pame: {
        pageNo: 1,
        pageSize: 10
      },
      totalCount: 0,
      notice: []
    };
  },
  watch: {},
  computed: {},
  methods: {
    //分页修改处理
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      let pame = this.pame;
      pame.pageNo = val;
      this.getNoutice();
    },
    handleCurrentChange(val) {
      let pame = this.pame;
      pame.pageNo = val;
      this.getNoutice();
    },
    getNoutice() {
      let pame = this.pame;
      axpGet("http://hc.6636fu.com/Platform/GetNoticeList", pame)
        .then(res => {
          console.log(res.data, "GetNoticeList");
          this.notice = res.data;
          this.totalCount = res.page.totalCount;
        })
        .catch(err => {});
    }
  },
  created() {
    this.getNoutice();
  },

  mounted() {}
};
</script>
<style lang="scss" scoped>
#notice {
  .pagination {
    width: 100%;
    padding: 14px 0;
    display: flex;
    justify-content: center;
    // border-top: 1px solid #eee;
    position: absolute;
    bottom: 0px;
  }
  height: 100%;
  background: #f2f6fe;
  padding: 0 30px;

  .noticeListTtem {
    border-bottom: 1px solid #f2f2f2f2;
    padding: 12px 0;
    .tit {
      position: relative;
      font-size: 18px;
      span {
        font-size: 14px;
        color: #9a9a9a;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    .content {
      font-size: 16px;
      color: #9a9a9a;
      padding-left: 6px;
      padding-top: 12px;
    }
  }
  h2 {
    margin: 0;
    padding: 32px 0;
    color: #333;
    font-size: 28px;
  }
}
</style>