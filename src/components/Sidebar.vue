<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted} from "vue";
import {useSidebar} from "../stores/sidebar.ts";
import Topics from "./Topics.vue";
import {useTopics} from "../stores/topics.ts";


const sidebar = useSidebar();
const topicsStore = useTopics();

const topicsData = computed(() => topicsStore.topics);

const handleKeyDown = (e: KeyboardEvent) => {
  if ( e.key === 'Escape') {
    sidebar.closeSidebar()
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <aside
      class="sidebar"
      :class="{'open': sidebar.isOpen}">
    <div class="sidebar__header">
      <button class="sidebar__btn" @click="topicsStore.expandAllNodes">
        Раскрыть всё
      </button>
      <button class="sidebar__btn" @click="topicsStore.collapseAllNodes">
        Свернуть всё
      </button>
    </div>
    <div class="sidebar__wrapper">
      <nav class="sidebar__navigation">
        <Topics :nodes="topicsData" :parent-path="''"/>
      </nav>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 350px;
  flex-shrink: 0;
  padding: 1rem;
  border-right: 2px solid var(--color-text);
  overflow-y: auto;
}

.sidebar__header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 5px;
}


.sidebar__btn {
  width: calc(50% - 10px);
  padding: 4px;
  border-radius: 5px;
  background-color: var(--color-bg-table);
  transition: background-color .3s linear;
}

@media (max-width: 1024px) {
  .sidebar {
    position: fixed;
    top:  70px;
    left: 0;
    background-color: var(--color-bg);
    height: calc(100dvh - 70px);
    transform: translateX(-100vw);
    transition: all .3s linear;
  }

  .sidebar.open {
    transform: translateX(0);
  }
}
</style>