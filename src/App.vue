<script setup lang="ts">
import {ref, onMounted, provide} from "vue";
import Topics from "./components/Topics.vue";
import Questions from "./components/Questions.vue";

export interface TopicNode {
  title: string;
  id?: string;
  content?: string;
  children?: TopicNode[];
}

interface JsonData {
  toc: TopicNode[];
}

const data = ref<JsonData | null>(null);
const openSidebar = ref<boolean>(false);
const selectedTopic = ref<TopicNode | null>(null);
const selectedId = ref<string | null>(null);
const expandedNodes = ref(new Set<string>());

provide('expandedNodes', {
  expanded: expandedNodes,
  toggle: (path: string) => {
    const newSet = new Set(expandedNodes.value);
    newSet.has(path) ? newSet.delete(path) : newSet.add(path);
    expandedNodes.value = newSet;
  },
  selectedId:  selectedId
});

const findTopicById = (topics: TopicNode[], id: string): TopicNode | null => {
  for (const topic of topics) {
    if (topic.id === id) return topic;
    if (topic.children) {
      const found = findTopicById(topic.children, id);
      if (found) return found;
    }
  }
  return null;
};

const handleTopicSelect = (id: string) => {
  if (!data.value) return;

  const topic = findTopicById(data.value.toc, id)
  if (topic?.content === undefined) return null;
  selectedTopic.value = topic;
  selectedId.value = id;
};

onMounted(() => {
  fetch('/data.json')
      .then(res => res.json())
      .then(json => data.value = json)
      .catch(error => console.error('Ошибка загрузки:', error));
});
</script>

<template>
  <header class="header">
    <button class="aside__open" @click="openSidebar = true">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2,4A1,1,0,0,1,3,3H21a1,1,0,0,1,0,2H3A1,1,0,0,1,2,4Zm1,9H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Zm0,8H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Z"/></svg>
    </button>

    <h1 class="title">Вопросы к собеседованию</h1>
  </header>
  <div class="wrapper">
    <aside class="aside" :class="{
      'open': openSidebar
    }">
      <button class="aside__close"  @click="openSidebar = false">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z"></path></svg>
      </button>
      <Topics
          :nodes="data?.toc || []"
          @select="handleTopicSelect"
          parentPath=""
      />
    </aside>
    <main class="main">
      <section>
        <Questions
            v-if="selectedTopic?.content"
            :description="selectedTopic.content"
        />
      </section>
    </main>
  </div>
</template>

<style>
.header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 1rem;
  border-bottom: 2px solid;
}

.aside {
  width: 350px;
  flex-shrink: 0;
  padding: 1rem;
  border-right: 2px solid black;
  overflow-y: auto;
}

.aside__open {
  display: none;
}

.aside__close {
  display: none;
}

.wrapper {
  display: flex;
  flex-wrap: wrap;
  min-height: 100vh;
}

.main {
  width: calc(100% - 350px );
  padding: 2rem;
}

button {
  display: block;
  padding: 0;
  background-color: transparent;
  border: none;
  cursor: pointer;
}
ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

@media (max-width: 1024px) {
  h1 {
    font-size: 1.5rem;
  }

  h2 {
    font-size: 1rem;
  }

  h3 {
    font-size: 1rem;
  }

  .header {
    padding: 1rem;
    position: sticky;
    top: 0;
    background-color: white;
  }

  .aside__open {
    width: 24px;
    height: 24px;
    display: block;
  }

  .aside__close {
    width: 24px;
    height: 24px;
    margin-left: auto;
    display: block;
    position: absolute;
    top: 5px;
    right: 10px;
    color: black;
  }

  .aside {
    position: fixed;
    top: 0;
    background-color: white;
    height: 100dvh;
    transform: translateX(-100vw);
    transition: all .3s linear;
    padding-top: 2rem;
  }

  .aside.open {
    transform: translateX(0);
  }

  .main {
    width: 100%;
    padding: 1rem;
  }
}

</style>