<script setup lang="ts">
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import { ref, watch } from 'vue';

marked.setOptions({
  highlight: (code:string) => {
    return hljs.highlightAuto(code).value;
  }
});

const props = defineProps<{
  content: string;
}>();

const htmlContent = ref('');

const renderMarkdown = (md: string) => {
  const rawHtml = marked.parse(md);
  const cleanHtml = DOMPurify.sanitize(rawHtml);
  return cleanHtml;
};

watch(() => props.content, (newVal) => {
  htmlContent.value = renderMarkdown(newVal);
}, { immediate: true });
</script>

<template>
  <div class="markdown-content" v-html="htmlContent"></div>
</template>

<style>
.markdown-content {
  line-height: 1.6;
  padding: 1rem;
}

.markdown-content h1 {
  font-size: 2em;
  margin: 1em 0 0.5em;
}

.markdown-content pre code {
  display: block;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
  margin: 1rem 0;
}

.markdown-content code:not(pre code) {
  background: #f0f0f0;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}
</style>