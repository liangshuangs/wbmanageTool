<!--
 * @Anthor: liangshuang15
 * @Description: 
 * @Date: 2022-09-19 11:46:59
 * @LastEditTime: 2022-09-19 15:45:01
 * @FilePath: /wbmanageTool/manage-tool/src/components/TuoPu.vue
-->
<template>
  <div>
    <div class="title">
        <Button>网络拓扑控制</Button>
        <Button>节点设置</Button>
        <Button>MESH设置</Button>
        <Button>系统快速启动</Button>
        <Button>系统完全启动</Button>
    </div>
  </div>
</template>
import { Button } from "element-ui";
<script>
export default {
  name: "TuoPuCom",
  components: {
    Button,
  },
};
</script>