<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { marked } from 'marked';
import { markedHighlight } from "marked-highlight";
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import 'highlight.js/styles/github.css';


marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
}));

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
.markdown-content pre code.hljs {
  padding: 1em;
  border-radius: 5px;
}

.markdown-content {
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    line-height: 1.6;

    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
    word-wrap: break-word;
}

/* Заголовки */
.markdown-content h1 {
    margin: 1.5rem 0;
    font-size: 2rem;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
    font-weight: 600;
}

.markdown-content h2 {
    margin: 1.3rem 0;
    font-size: 1.5rem;
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
    font-weight: 600;
}

.markdown-content h3 {
    margin: 1.1rem 0;
    font-size: 1.25rem;
    font-weight: 600;
}

/* Текст и списки */
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

/* Блоки кода (подсветка синтаксиса как в GitHub) */
.markdown-content pre {
    background: #bdc5d5;
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
    margin: 1rem 0;
    line-height: 1.45;
    position: relative;
}

.markdown-content pre code {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 0.9em;
    background: transparent;
    padding: 0;
    border-radius: 0;
    margin: 0;
    white-space: pre;
    color: #24292e;
    display: block;
    overflow: visible;
}

/* Inline код */
.markdown-content code:not(pre code) {
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    background: rgba(27, 31, 35, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-size: 85%;
    color: #e01e5a;
}

/* Таблицы */
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
    padding: 6px 13px;
}

.markdown-content th {
    background-color: #f6f8fa;
    font-weight: 600;
}

.markdown-content tr {
    background-color: #fff;
    border-top: 1px solid #c6cbd1;
}

    .markdown-content tr:nth-child(even) {
        background-color: #f6f8fa;
    }

/* Цитаты */
.markdown-content blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
    margin: 1rem 0;
}

    .markdown-content blockquote p {
        margin: 0;
    }

/* Специфические цвета для подсветки SQL (как в GitHub) */
.markdown-content .token.keyword {
    color: #d73a49;
}

.markdown-content .token.string {
    color: #032f62;
}

.markdown-content .token.function {
    color: #6f42c1;
}

.markdown-content .token.comment {
    color: #6a737d;
}

.markdown-content .token.number {
    color: #005cc5;
}

.markdown-content .token.operator {
    color: #d73a49;
}

/* Дополнительные стили для лучшего UX */
.markdown-content a {
    color: #0366d6;
    text-decoration: none;
}

    .markdown-content a:hover {
        text-decoration: underline;
    }

.markdown-content strong {
    font-weight: 600;
}

.markdown-content em {
    font-style: italic;
}
</style>