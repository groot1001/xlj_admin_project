<template>
  <div id="app">
    <topnav v-if="token"/>
    <router-view />
  </div>
</template>

<script>
import Topnav from "./layout/components/Topnav";
import { mapState } from "vuex";
import { getToken } from "@/utils/auth";
export default {
  name: "App",
  data() {
    return {
      // token:getToken()
    };
  },
  components: {
    Topnav
  },
  computed: {
    ...mapState({
      
      // uname: state => state.user.name
      token: state => state.user.token 
    })
  }
};
</script>
