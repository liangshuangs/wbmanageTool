<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-22 15:31:38
 * @LastEditTime: 2022-09-22 19:11:05
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
      const text = this.getRandomString();
      const secret = this.getRandomString(this.Form.secret, text);
      const params = {
        url: '/web/login',
        params: {
            text,
            secret
        }
      };
      fetchService(params).then(res => {
        this.$message({
          message: res.msg || "登陆成功",
          type: "success",
        });
        // 跳转到首页
        this.$router.push('/index/index');
      })
    },
    // 重置
    resetForm(ref) {
      console.log(ref, "ddd");
    },
    // 获取随机数
    getRandomString(len = 10) {
      const string = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz@#$%&";
      const maxPos = string.length;
      let randomString = "";
      for (let i = 0; i < len; i++) {
        randomString += string.charAt(Math.floor(Math.random() * maxPos));
      }
      return randomString;
    },
    encryptByDES(message, key) {
      let keyHex = CryptoJS.enc.Utf8.parse(key);
      let encrypted = CryptoJS.DES.encrypt(message, keyHex, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      });
      return encrypted.toString();
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