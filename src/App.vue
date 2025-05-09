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

function siHay() {
  const data = { title: 'John',des: 'dsa', price: 30 }
  
  fetch('https://fakestoreapi.com/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
      .then(response => {
        if (!response.ok) {
          throw new Error('Сетевая ошибка');
        }
        return response.json();
      })
      .then(data => console.log(data))
      .catch(error => console.error('Ошибка:', error));

}
siHay()

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