<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">
        <el-col :span="13" :xs="24">
          <user-card :user="user" />
        </el-col>
        <el-col :span="6" :xs="24">
          <Mysite :url='user.shop.shopID' />
        </el-col>
        <el-col :span="5" :xs="24">
          <Contact />
        </el-col>
        <el-col :span="24" :xs="24">
           <Statistics/>
        </el-col>


        <!-- <el-col :span="11" :xs="24">
        
         <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="Activity" name="activity">
                <activity />
              </el-tab-pane>
              <el-tab-pane label="Timeline" name="timeline">
                <timeline />
              </el-tab-pane>
              <el-tab-pane label="Account" name="account">
                <account :user="user" />
              </el-tab-pane>
            </el-tabs>
          </el-card> 
        </el-col>-->
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserCard from "./components/UserCard";
import Mysite from "./components/Mysite";
import Contact from "./components/Contact";
import Statistics from "./components/Statistics";

import Activity from "./components/Activity";
import Timeline from "./components/Timeline";
import Account from "./components/Account";

export default {
  name: "Profile",
  components: { UserCard, Activity, Timeline, Account, Mysite, Contact,Statistics },
  data() {
    return {
      user: {},
      activeTab: "activity"
    };
  },
  computed: {
    ...mapGetters(["name", "avatar", "roles", "shop"])
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      console.log('shop----------',this.shop)
      this.user = {
        name: this.name,
        role: this.roles.join(" | "),
        email: "admin@test.com",
        avatar: this.avatar,
        shop: this.shop
      };
    }
  }
};
</script>
