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
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}

.markdown-content h1 {
    margin: 1.5rem 0;
    font-size: 2rem;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
}

.markdown-content h2 {
    margin: 1.3rem 0;
    font-size: 1.5rem;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
}

.markdown-content h3 {
    margin: 1.1rem 0;
    font-size: 1.25rem;
}

.markdown-content p,
.markdown-content ul,
.markdown-content ol,
.markdown-content blockquote {
    margin: 0.8rem 0;
}

.markdown-content ul,
.markdown-content ol {
    padding-left: 2rem;
}

.markdown-content li {
    margin: 0.3rem 0;
}

.markdown-content pre {
    background: #f6f8fa;
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
    margin: 1rem 0;
}

.markdown-content code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.9em;
}

.markdown-content pre code {
    background: transparent;
    padding: 0;
    border-radius: 0;
    margin: 0;
    white-space: pre;
}

.markdown-content code:not(pre code) {
    background: rgba(27, 31, 35, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 85%;
}

.markdown-content table {
    border-collapse: collapse;
    width: 100%;
    margin: 1.5rem 0;
    display: block;
    overflow-x: auto;
}

.markdown-content th,
.markdown-content td {
    border: 1px solid #dfe2e5;
    padding: 0.6rem 1rem;
}

.markdown-content th {
    background-color: #f6f8fa;
    font-weight: 600;
}

.markdown-content tr:nth-child(even) {
    background-color: #f6f8fa;
}

.markdown-content blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
    margin: 1rem 0;
}

    .markdown-content blockquote p {
        margin: 0;
    }
</style>