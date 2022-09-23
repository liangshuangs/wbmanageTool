<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-20 15:30:06
 * @LastEditTime: 2022-09-22 19:58:23
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
            label="用户名"
            :label-width="formLabelWidth"
            prop="text"
          >
            <el-input v-model="form2.text"></el-input>
          </el-form-item>
          <el-form-item
            label="原始密码"
            :label-width="formLabelWidth"
            prop="secret"
          >
            <el-input
              placeholder="请输入原始密码"
              show-password
              v-model="form2.secret"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="新密码"
            :label-width="formLabelWidth"
            prop="new_secret"
          >
            <el-input
              placeholder="请输入新密码"
              show-password
              v-model="form2.new_secret"
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
      dialogFormVisible: false,
      formLabelWidth: "120px",
      showPointSetting: false,
      form2: {
        text: "",
        secret: "",
        new_secret: "",
      },
      rules: {
        secret: [
          { required: true, message: "请输入原始密码", trigger: "blur" },
        ],
        new_secret: [
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
          const params = {
            url,
            params: this.form2,
          };
          fetchService(params).then((res) => {
            this.$message({
              message: res.msg || "修改密码成功",
              type: "success",
            });
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
    // 删除节点
    handleDelPoint(index, row) {
      const params = {
        url: "/web/del",
        params: {
          id: row.id,
        },
      };
      fetchService(params).then((res) => {
        this.$message({
          message: res.msg || "删除成功",
          type: "success",
        });
        this.getPoints(); // 更新列表数据
      });
    },
    // 获取结点数据
    getPoints() {
      const params = {
        url: "/web/area_list",
      };
      fetchService(params).then((res) => {
        this.pointData = res.list || [];
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
    // 保存修改结点
    handleSave(index, row) {
      const params = {
        url: "/web/save",
        params: {
          id: row.id,
          name: row.name,
        },
      };
      fetchService(params).then((res) => {
        this.$message({
          message: res.msg || "修改成功",
          type: "success",
        });
        this.getPoints(); // 更新列表数据
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