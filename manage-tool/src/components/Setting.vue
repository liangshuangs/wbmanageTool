<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-20 15:30:06
 * @LastEditTime: 2022-09-28 10:46:28
 * @FilePath: /wbmanageTool/manage-tool/src/components/Setting.vue
-->
<template>
  <el-dialog
    :visible="dialogFormVisible"
    custom-class="setting-dialog"
    @close="handleClose"
    width="50%"
  >
    <div slot="title" class="dialog-title">
      <el-button @click="showPointSetting = false" plain>用户设置</el-button>
      <el-button @click="showPointSetting = true" plain>结点设置</el-button>
    </div>
    <div class="setting-wrapper">
      <div class="setting-contnet">
        <div v-if="showPointSetting">
          <el-button @click="handleAdd" size="small" type="primary"
            >添加</el-button
          >
          <el-table :data="pointData">
            <el-table-column
              property="id"
              label="编号"
              width="150"
            ></el-table-column>
            <el-table-column property="name" label="名称">
              <template slot-scope="scope">
                <span v-show="!scope.row.edit">{{ scope.row.name }}</span>
                <el-input
                  v-show="scope.row.edit"
                  v-model="scope.row.name"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
              <template slot-scope="scope">
                <el-button
                  @click="handleDelPoint(scope.$index, scope.row)"
                  type="text"
                  size="small"
                  >删除</el-button
                >
                <el-button
                  v-show="!scope.row.edit"
                  @click="handleEdit(scope.$index, scope.row)"
                  type="text"
                  size="small"
                  >修改</el-button
                >
                <el-button
                  v-show="scope.row.edit"
                  @click="handleSave(scope.$index, scope.row)"
                  type="text"
                  size="small"
                  >保存</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form :model="form2" :rules="rules" ref="form2" v-else>
          <el-form-item
            label="原始密码"
            type="password"
            :label-width="formLabelWidth"
            prop="secret"
          >
            <el-input
              placeholder="请输入原始密码"
              type="password"
              v-model="form2.secret"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="新密码"
            :label-width="formLabelWidth"
            prop="pwd"
          >
            <el-input
              placeholder="请输入新密码"
              show-password
              v-model="form2.pwd"
            ></el-input>
          </el-form-item>
          <el-form-item class="submit-wrapper">
            <el-button type="primary" @click="submitForm('form2')"
              >提交</el-button
            >
            <el-button @click="resetForm('form2')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { fetchService } from "../fetch";
import { API } from "../api";
import { getRandomString, encryptByDES, getKey } from '../util';
export default {
  name: "SettingCom",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pwd: "",
      dialogFormVisible: false,
      formLabelWidth: "120px",
      showPointSetting: false,
      form2: {
        secret: "",
        pwd: "",
      },
      rules: {
        secret: [
          { required: true, message: "请输入原始密码", trigger: "blur" },
        ],
        pwd: [
          { required: true, message: "请输入新密码", trigger: "blur" },
        ],
      },
      pointData: [],
    };
  },
  mounted() {
    this.getPoints();
  },
  watch: {
    visible(val) {
      if (val) {
        this.dialogFormVisible = true;
      } else {
        this.dialogFormVisible = false;
      }
    },
  },
  methods: {
    handleClose() {
      this.dialogFormVisible = false;
      this.$emit("closeModal");
    },
    submitForm(formName) {
      let url = "/web/pwd";
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let randomString = getRandomString(32);
          let text = getKey(randomString, 32); // 随机字符串
          let secret = getKey(this.form2.secret, 24); // 旧密码
          
          const params = {
            url,
            method: 'PUT',
            params: {
              text: randomString,
              secret: encryptByDES(text, secret), // 旧密码
              pwd: encryptByDES(this.form2.pwd, secret) // 新密码
            },
          };
          console.log(params, 'params');
          fetchService(params)
            .then((res) => {
              this.$message.success(res.msg || "修改密码成功");
            })
            .catch((err) => {
              this.$message.error(err.msg || "修改密码失败");
            });
        } else {
          return false;
        }
      });
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 删除节点 TODO 删除不成功
    handleDelPoint(index, row) {
      const params = {
        url: `${API.addArea}/${row.id}`,
        method: "DELETE",
        params: {},
      };
      fetchService(params).then((res) => {
        this.$message.success(res.msg || "删除结点成功");
        this.getPoints(); // 更新列表数据
      }).catch(err => {
        this.$message.error(err.msg || '失败')
      });
    },
    // 获取结点数据
    getPoints() {
      const params = {
        url: API.areaList,
      };
      fetchService(params).then((res) => {
        this.pointData = res.list || [];
        this.pwd = res.list[0] && res.list[0].pwd;
      });
    },
    // 编辑节点
    handleEdit(index, row) {
      this.pointData.map((item) => {
        if (item.id === row.id) {
          this.$set(item, "edit", true);
        } else {
          this.$set(item, "edit", false);
        }
      });
    },
    // 新增 or 修改 结点
    handleSave(index, row) {
      let params = {
        url: API.addArea,
        method: "post",
        params: {
          pwd: this.pwd,
          name: row.name,
        },
      };
      if (row.id) {
        params = {
          url: `${API.addArea}/${row.id}`,
          method: "put",
          params: {
            pwd: this.pwd,
            name: row.name,
          },
        };
      }
      fetchService(params)
        .then((res) => {
          this.$message.success(res.msg || "成功");
          row.edit = false;
          this.getPoints(); // 更新列表数据
        })
        .catch((err) => {
          this.$message.error(err.msg || "失败");
        });
    },
    // 添加节点
    handleAdd() {
      const row = { id: "", name: "", edit: true };
      this.pointData.push(row);
    },
  },
};
</script>
<style scoped>
.setting-wrapper {
  display: flex;
}
.setting-type {
  width: 80px;
}
.setting-contnet {
  flex: 1;
}
</style>
<style>
.setting-dialog {
  min-height: 350px;
}
.setting-dialog .el-dialog__body {
  padding-bottom: 0;
  padding-top: 0;
}
.submit-wrapper {
  text-align: center;
}
</style>