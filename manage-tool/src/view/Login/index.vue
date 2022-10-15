<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-22 15:31:38
 * @LastEditTime: 2022-10-15 18:25:56
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
              >登录</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchService } from "../../fetch";
import {setCookie, getRandomString, encryptByDES, getKey} from '../../util';
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
      let randomString = getRandomString(32);
      let text = getKey(randomString, 32);
      let pwd = getKey(this.Form.secret, 24);
      const secret = encryptByDES(text, pwd);
      const params = {
        url: "/web/login",
        method: "post",
        params: {
          text: randomString,
          secret,
        },
      };
      fetchService(params).then((res) => {
        setCookie('TOKEN', res.token);
        // 跳转到首页
        this.$router.push('/');
      }).catch(err => {
        this.$message.error(err.message || '登陆失败');
      });
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