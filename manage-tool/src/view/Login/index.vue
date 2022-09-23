<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-22 15:31:38
 * @LastEditTime: 2022-09-23 15:51:45
 * @FilePath: /wbmanageTool/manage-tool/src/view/Login/index.vue
-->
<template>
  <div class="login-wrapper">
    <div class="login-content">
      <div><img src="../../assets/bg.png" alt="背景图" width="346" /></div>
      <div>
        <el-form
          :model="Form"
          status-icon
          ref="Form"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="密码" prop="pass" label-width="120px">
            <el-input
              type="password"
              v-model="Form.secret"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('Form')"
              >登陆</el-button
            >
            <el-button @click="resetForm('Form')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import CryptoJS from "crypto-js";
import { fetchService } from "../../fetch";
import {setCookie} from '../../util';
export default {
  name: "LoginCom",
  data() {
    return {
      Form: {
        secret: "",
      },
    };
  },
  mounted() {},
  methods: {
    // 登陆
    submitForm() {
      let randomString = this.getRandomString(32);
      let text = this.getKey(randomString, 32);
      let pwd = this.getKey(this.Form.secret, 24);
      console.log("pwd1:",pwd);
      console.log("text:", text);
      const secret =this.encryptByDES(text, pwd);
      console.log('secret:',secret)
      const params = {
        url: "/web/login",
        method: "post",
        params: {
          text: randomString,
          secret,
        },
      };
      fetchService(params).then((res) => {
        // TODO 保存token
        console.log(res, 'res');
        setCookie('TOKEN', res.token);
        // 跳转到首页
        this.$router.push('/index/index');
      }).catch(err => {
        this.$message.error(err.message || '登陆失败');
      });
    },
    // 3des加密
    encryptByDES(message, key) {
      let keyHex = CryptoJS.enc.Utf8.parse(key);
      let ivHex = message;
      let encrypted = CryptoJS.TripleDES.encrypt(ivHex, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.toString();
    },
    getKey(key = "", len) {
      if (key.length < len) {
        let diffLen = len - key.length;
        for (let i = 0; i < diffLen; i++) {
          key += 0;
        }
      }
      return key;
    },
    // 获取随机数
    getRandomString(len = 24) {
      const string = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz@#$%&";
      const maxPos = string.length;
      let randomString = "";
      for (let i = 0; i < len; i++) {
        randomString += string.charAt(Math.floor(Math.random() * maxPos));
      }
      return randomString;
    },
    // 重置
    resetForm(ref) {
      console.log(ref, "ddd");
    },
  },
};
</script>
<style scoped>
.login-wrapper {
  display: flex;
  height: 100vh;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
}
.login-content {
  display: flex;
  flex-direction: row;
}
</style>