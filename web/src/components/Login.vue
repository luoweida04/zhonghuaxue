<template>
  <div class="body">
    <div class="main">
      <img src="../assets/后台logo.png" alt="" class="logo" />
      <div class="input">
        <div class="icon">
          <img src="../assets/accountnumber@3x.png" alt="" />
        </div>
        <input type="text" placeholder="请输入管理员账号" v-model="loginUsername" />
      </div>
      <div class="input">
        <div class="icon">
          <img src="../assets/password@3x.png" alt="" />
        </div>
        <input
          type="password"
          placeholder="请输入管理员密码"
          v-model="loginPassword"
        />
      </div>
    </div>
    <el-button class="login" @click="loginFun" type="primary">登 录</el-button>
  </div>
</template>
<script>
import { login } from "../api/login";
export default {
  name: "Home",
  props: ['getLoginInfo'],
  data() {
    return {
      loginUsername: "",
      loginPassword: ""
    };
  },
  methods: {
    loginFun() {
      if (this.loginUsername === "" || this.loginPassword === "") return;
      login(this.loginUsername, this.loginPassword).then((res) => {
        console.log("login", res);
        let info = {
            loginUsername: this.loginUsername,
            loginPassword: this.loginPassword,
            access_token: res.data.access_token
        }
        this.getLoginInfo(info)
      });
    },
  },
};
</script>
<style lang="scss" scoped>
* {
  padding: 0;
  margin: 0;
}
img {
  height: auto;
}
.body {
  width: 100vw;
  height: 100vh;
  background-image: url("../assets/bg.jpg");
  background-size: cover;
//   background-size: contain;
  background-color: skyblue;
  overflow: hidden;
  .main {
    width: 700px;
    height: 400px;
    background-color: #fff;
    border-radius: 15px;
    margin: auto;
    margin-top: 100px;
    padding: 0;
    .logo {
      width: 500px;
      margin-left: 100px;
      margin-top: 50px;
    }
    .input {
      position: relative;
      display: flex;
      width: 320px;
      height: 60px;
      margin: auto;
      margin-top: 20px;
      .icon {
        position: absolute;
        top: 0;
        left: 10px;
        position: relative;
        width: 55px;
        height: 50px;
        background-color: RGBA(230, 237, 234, 1);
        border-radius: 5px;
        img {
          position: absolute;
          width: 30px;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      input {
        box-sizing: border-box;
        width: 300px;
        height: 50px;
        line-height: 50px;
        background-color: rgba(2, 82, 40, 0.05);
        border: none;
        padding-left: 10px;
        border-radius: 5px;
        text-align: center;
      }
      input:focus {
        outline: none;
      }
    }
  }
  .login {
    position: absolute;
    width: 140px;
    height: 50px;
    text-align: center;
    color: rgba(2, 85, 42, 1);
    font-size: 16px;
    font-weight: bold;
    border-radius: 10px;
    background-color: #fff;
    top: 530px;
    left: 50%;
    transform: translate(-50%);
  }
}
</style>