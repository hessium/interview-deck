<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {marked} from 'marked';
import {markedHighlight} from "marked-highlight";
import hljs from 'highlight.js';
import DOMPurify from 'dompurify';
import 'highlight.js/styles/github.css';


marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, {language}).value;
  }
}));

const {content} = defineProps<{
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
watch(() => content, loadContent, {deep: true});
</script>

<template>
  <div class="markdown-content" v-html="htmlContent"></div>
</template>

<style>
.markdown-content pre code.hljs {
  padding: 1em;
  border-radius: 5px;
  transition: background-color .3s linear;
}

.markdown-content * {
  margin: .5rem 0;
}

.markdown-content {
  line-height: 1.6;
  padding: 1rem;
}

.markdown-content pre code {
  display: block;
  padding: 1rem;
  background-color: var(--color-bg-code);
  color: var(--color-text);
  border-radius: 4px;
  margin: 1rem 0;
  transition: background-color .3s linear;
}

.markdown-content code:not(pre code) {
  background-color: var(--color-bg-code);
  padding: 0.2em 0.4em;
  border-radius: 3px;
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
  border: 1px solid var(--color-text);
  padding: 6px 13px;
}

.markdown-content th {
  background-color:  var(--color-bg-table);
  font-weight: 600;
  transition: background-color .3s linear;
}

.markdown-content tr {
  background-color:  var(--color-bg-code);
  border-top: 1px solid var(--color-text);
  transition: background-color .3s linear;
}

.markdown-content tr:nth-child(even) {
  background-color: var(--color-bg-code);
}

/* Цитаты */
.markdown-content blockquote {
  padding: 0 1em;
  color: var(--color-bg-code);
  border-left: 0.25em solid  var(--color-text);
  margin: 1rem 0;
}

.markdown-content blockquote p {
  margin: 0;
}
</style>