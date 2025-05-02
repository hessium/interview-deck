<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const { content } = defineProps<{
  content: string | null;
}>();

const htmlContent = ref('');

const renderMarkdown = async (md: string) => {
  const rawHtml = await marked.parse(md);
  return DOMPurify.sanitize(rawHtml);
};

const loadContent = async () => {
  try {
    if (!content) {
      return;
    }

    htmlContent.value = await renderMarkdown(content);
  } catch (error) {
    console.error('Ошибка загрузки контента:', error);
  }
};

onMounted(loadContent);
watch(() => content, loadContent, { deep: true });
</script>

<template>
  <div class="markdown-content" v-html="htmlContent"></div>
</template>

<style>
.markdown-content {
  width: 100%;
}
.markdown-content pre code {
  display: block;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 4px;
  margin: 1rem 0;
}

.markdown-content h1 {
  margin-bottom: 1rem;
}

.markdown-content * {
  margin-bottom: .8rem;
}

.markdown-content code:not(pre code) {
  background: #f0f0f0;
  padding: 0.1em 0.6em;
  border-radius: 3px;
  font-size: 16px;
  font-weight: 700;
  line-height: 1;
}
</style>