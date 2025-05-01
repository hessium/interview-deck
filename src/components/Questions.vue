<script setup lang="ts">

import {onMounted, ref} from "vue";
import {marked} from "marked";

const {title, description} = defineProps<{
  title?: string;
  description?: string;
}>();


const htmlContent = ref<string>("");

onMounted(() => {

  if (!description) return;
  console.log(description)
  fetch(description)
      .then(res => res.text())
      .then(md => {
        htmlContent.value = marked.parse(md, {
          breaks: true,
          gfm: true
        });
      })
      .catch(error => console.error('Ошибка загрузки:', error));
});

</script>

<template>
  <div class="questions-container">
    <h1 v-if="title">{{ title }}</h1>
    <div
        class="content"
        v-if="htmlContent"
        v-html="htmlContent"
    ></div>
  </div>
</template>

<style>
.questions-container {
  max-width: 800px;
  margin: 0 auto;
}

</style>