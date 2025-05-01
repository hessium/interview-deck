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
const selectedTopic = ref<TopicNode | null>(null);
const expandedNodes = ref(new Set<string>());

provide('expandedNodes', {
  expanded: expandedNodes,
  toggle: (path: string) => {
    const newSet = new Set(expandedNodes.value);
    newSet.has(path) ? newSet.delete(path) : newSet.add(path);
    expandedNodes.value = newSet;
  }
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
  selectedTopic.value = findTopicById(data.value.toc, id);
};

onMounted(() => {
  fetch('/data.json')
      .then(res => res.json())
      .then(json => data.value = json)
      .catch(error => console.error('Ошибка загрузки:', error));
});
</script>

<template>
  <div class="wrapper">
    <aside class="aside">
      <Topics
          :nodes="data?.toc || []"
          @select="handleTopicSelect"
          parentPath=""
      />
    </aside>
    <Transition>
      <main class="main">
        <Questions
            v-if="selectedTopic?.content"
            :description="selectedTopic.content"
        />
        <h1 v-else>Вопросы для подоготовки в собеседованию</h1>
      </main>
    </Transition>
  </div>
</template>
<style scoped>
.aside {
  width: 350px;
  flex-shrink: 0;
  padding: 1rem;
  border-right: 1px solid black;
}

.wrapper {
  display: flex;
  flex-wrap: wrap;
  min-height: 100vh;
}

.main {
  flex: 1;
  padding: 2rem;
  max-width: 800px;
}

</style>