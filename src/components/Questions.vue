<script setup lang="ts">
import {computed} from "vue";
import {useTopics} from "../stores/topics.ts";
import MarkdownRenderer from "../shared/UI/markdown-renderer/MarkdownRenderer.vue";

const topicsStore = useTopics();
const content = computed(() => topicsStore.selectedContent);

</script>

<template>
  <section class="section">
    <MarkdownRenderer :content="content"/>
    <div v-if="topicsStore.isLoading" class="loading">Loading...</div>
    <div v-if="topicsStore.error" class="error">{{ topicsStore.error }}</div>
  </section>
</template>

<style scoped>
.section {
  width: calc(100% - 350px);
  padding: 2rem;
}

@media (max-width: 1024px) {
  .section {
    width: 100%;
    padding: 1rem;
  }
}
</style>