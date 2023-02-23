<!-- v0.0.1 2023/01/04 gqd Init version; -->
<!--        2023/01/11 gqd Add highlight styles; -->
<!--        2023/01/17 gqd Add clipboard actions; -->
<template>
  <div>
    <div class="code-preview-topline"><div></div></div>
    <div class="code-preview-icons">
      <span>
        <a-tooltip
          title="复制代码"
        >
          <copy-outlined @click="onCopyClicked" />
        </a-tooltip>
      </span>
      <span>
        <a-tooltip
          :title="isCollapsed ? '显示代码' : '隐藏代码'"
        >
          <code-outlined @click="onShowOrHideCodeIconClicked" />
        </a-tooltip>
      </span>
    </div>
    <div v-if="!isCollapsed" class="code-preview-content">
      <pre class="language-html" v-html="code"></pre>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import Prism from 'prismjs';
import useClipboard from 'vue-clipboard3';

import { message } from 'ant-design-vue';
import {
  CodeOutlined,
  CopyOutlined
} from '@ant-design/icons-vue';

import 'prismjs/themes/prism.css';

export default defineComponent({
	name: 'CodePreview',
  components: {
    CodeOutlined,
    CopyOutlined
  },
  props: {
    sourceCode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isCollapsed: true, // 是否折叠代码，默认折叠
    };
  },
  computed: {
    code() {
      return Prism.highlight(this.sourceCode, Prism.languages.html, 'html');
    },
  },
  methods: {
    onShowOrHideCodeIconClicked() {
      this.isCollapsed = !this.isCollapsed;
    },
    async onCopyClicked() {
      const { toClipboard } = useClipboard()
      try {
        await toClipboard(this.sourceCode)
        message.success('代码复制成功！')
      } catch (e) {
        console.error(e)
        message.error('您的浏览器不支持复制！')
      }
    },
  },
})
</script>
<style lang="less" scoped>
.code-preview-topline {
  width: 100%;
  padding: 20px 0 12px;
}
.code-preview-topline div {
  height: 1px;
  border-top: 1px dashed #888888;
}
.code-preview-icons {
  text-align: center;
  padding: 4px 0;
  color: #888;
  font-size: 16px;
  > span + span {
    margin-left: 8px;
  }
}
.code-preview-content {
  position: relative;
  padding: 20px;
}
</style>
