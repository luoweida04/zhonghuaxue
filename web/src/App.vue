<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      loginUsername: "admin@admin.is",
      loginPassword: "admin",
      access_token: ""
    };
  },
  methods: {
    getLoginInfo(loginInfo) {
      console.log(loginInfo);
      const { access_token, loginUsername, loginPassword } = loginInfo;
      this.access_token = access_token;
      this.loginUsername = loginUsername;
      this.loginPassword = loginPassword;
    },
  }
};
</script>

<style lang="scss">
#app {
  background-color: #f5f5f5;
}
</style>
