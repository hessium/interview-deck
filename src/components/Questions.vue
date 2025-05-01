<script setup lang="ts">
import {onMounted, ref, watch} from "vue";
import MarkdownRenderer from "./MarkdownRenderer.vue";

const { description} = defineProps<{
  description?: string;
}>();


const htmlContent = ref<string | (() => Promise<string>)>("");

function loadContent() {
  if (!description) return;

  return fetch(description)
     .then(res => res.text())
     .then(md => {
       htmlContent.value = md
     })
     .catch(error => console.error('Ошибка загрузки:', error))
}

onMounted(() => {
  loadContent()
})

watch(() => description, loadContent);
</script>

<template>
  <div class="questions-container">
    <MarkdownRenderer v-if="htmlContent" :content="htmlContent"/>
  </div>
</template>

<style>
.questions-container {
  max-width: 800px;
  margin: 0 auto;
}

</style>