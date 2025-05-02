<script setup lang="ts">
import {computed} from "vue";
import {useSidebar} from "../stores/sidebar.ts";
import Topics from "./Topics.vue";
import {useTopics} from "../stores/topics.ts";


const sidebar = useSidebar();
const topicsStore = useTopics();

const topicsData = computed(() => topicsStore.topics);
</script>

<template>
  <aside
      class="aside"
      :class="{'open': sidebar.isOpen}">
    <button class="aside__close" @click="sidebar.handleToggle()">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <path fill="currentColor"
              d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z"></path>
      </svg>
    </button>
    <div class="aside__header">
      <button class="aside__btn" @click="topicsStore.expandAllNodes">
        Раскрыть всё
      </button>
      <button class="aside__btn" @click="topicsStore.collapseAllNodes">
        Свернуть всё
      </button>
    </div>
    <Topics :nodes="topicsData" :parent-path="''"/>
  </aside>
</template>

<style scoped>
.aside {
  width: 350px;
  flex-shrink: 0;
  padding: 1rem;
  border-right: 2px solid black;
  overflow-y: auto;
}

.aside__header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 5px;
}

.aside__btn {
  width: calc(50% - 10px);
  padding: 4px;
  background-color: whitesmoke;
  border-radius: 5px;
}

.aside__close {
  display: none;
}

@media (max-width: 1024px) {
  .aside__close {
    width: 24px;
    height: 24px;
    margin-left: auto;
    display: block;
    position: absolute;
    top: 10px;
    right: 32px;
    color: black;
  }

  .aside {
    position: fixed;
    top: 0;
    left: 0;
    background-color: white;
    height: 100dvh;
    transform: translateX(-100vw);
    transition: all .3s linear;
    padding-top: 3rem;
  }

  .aside.open {
    transform: translateX(0);
  }
}
</style>