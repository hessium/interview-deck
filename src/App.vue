<script setup lang="ts">
import {onMounted} from "vue";
import {useTopics} from "./stores/topics.ts";

import TheHeader from "./components/TheHeader.vue";
import Sidebar from "./components/Sidebar.vue";
import Questions from "./components/Questions.vue";

const topicsStore = useTopics();

onMounted(async () => {
  await topicsStore.fetchTopics();

});

</script>

<template>
  <TheHeader/>
  <main class="main">
    <Sidebar/>
    <Questions/>
  </main>
</template>

<style>
</style>