<template>
  <div class="sub_success">
    <div class="sub_success">
      <div>
        <img src="@/assets/images/sub_success.png" alt srcset />
        <h3>发布成功</h3>
        <p>请您耐心等待审批</p>
        <div class="sub_bottom_btn">
          <div @click="see_course_list()">查看课程信息</div>

          <div @click="again_sub">再次发布课程</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "sub_success",
  methods: {
    again_sub() {
      this.$emit("stepsChange", 1);
    },
    see_course_list() {
      this.$router.push({
        //核心语句
        path: "/courseManage/conrseInfoManage" //跳转的路径
      });
    }
  }
};
</script>

<style <style lang="scss">
.sub_success {
  display: flex;
  text-align: center;
  height: 430px;
  align-items: center;
  justify-content: center;
  h3 {
    color: #1985fd;
  }
  p {
    color: #728092;
  }
  .sub_bottom_btn {
    display: flex;
    justify-content: space-between;
    div {
      height: 45px;
      width: 180px;
      border-radius: 5px;
      text-align: center;
      line-height: 45px;
    }
    div:first-child {
      border: #bac8d9 solid 1px;
      color: #728092;
    }
    div:last-child {
      color: #fff;
      background-color: #1985fd;
      margin-left: 20px;
    }
  }
}
</style>
<style>
</style>
