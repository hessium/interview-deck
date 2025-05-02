<script setup lang="ts">
import {computed, defineProps,} from "vue";
import {type TopicNode, useTopics} from "../stores/topics.ts";
import {useSidebar} from "../stores/sidebar.ts";

const sidebarStore = useSidebar();
const topicsStore = useTopics();

const {parentPath, nodes} = defineProps<{
  nodes: TopicNode[];
  parentPath?: string;
}>();

const getNodePath = (node: TopicNode) => {
  return parentPath ? `${parentPath}/${node.title}` : node.title;
};

const handleToggle = (node: TopicNode, path: string) => {
  if (node.children) {
    topicsStore.toggleNodeExpansion(path);
  }
};

const handleSelected = (node: TopicNode) => {
  topicsStore.selectTopic(node.id!)

  if ( node.children) return null;

  sidebarStore.closeSidebar()
}

const level = computed(() => {
  return parentPath ? parentPath.split('/').length : 0;
});

</script>

<template>
  <ul class="node-list"  tabindex="0">
    <li class="node-list__item" v-for="node in nodes" :key="node.title">
      <button
          class="node"
          @click="handleSelected(node!)"
          :class="{
          'clickable': node.id || node.children,
          'expanded': topicsStore.isExpanded(getNodePath(node)),
          'has-children': node.children,
          'selected': node.id === topicsStore.selectedId,
        }"
      >
        <span class="node__title" :style="{ fontSize: `${1.2 - 0.2 * level}rem`}">
          {{ node.title }}
        </span>

        <button
            v-if="node.children"
            @click.stop="handleToggle(node, getNodePath(node)) "
            class="toggle"
            :class="{
              opened: topicsStore.isExpanded(getNodePath(node))
            }"
        >
          <svg
              class="toggle-icon"
              viewBox="0 0 284.929 284.929">
            <g>
              <path d="M282.082,76.511l-14.274-14.273c-1.902-1.906-4.093-2.856-6.57-2.856c-2.471,0-4.661,0.95-6.563,2.856L142.466,174.441
		                L30.262,62.241c-1.903-1.906-4.093-2.856-6.567-2.856c-2.475,0-4.665,0.95-6.567,2.856L2.856,76.515C0.95,78.417,0,80.607,0,83.082
		                c0,2.473,0.953,4.663,2.856,6.565l133.043,133.046c1.902,1.903,4.093,2.854,6.567,2.854s4.661-0.951,6.562-2.854L282.082,89.647
		                c1.902-1.903,2.847-4.093,2.847-6.565C284.929,80.607,283.984,78.417,282.082,76.511z"/>
            </g>
          </svg>
        </button>
      </button>
      <div v-if="node.children && topicsStore.isExpanded(getNodePath(node))" class="children">
        <Topics
            :nodes="node.children"
            :parent-path="getNodePath(node)"
            @click="handleSelected(node)"
        />
      </div>
    </li>
  </ul>
</template>

<style scoped>
.node {
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 2px 0;
  padding: 8px 12px;
  border-radius: 5px;
  background-color: transparent;
  transition: background-color .3s ease-out;
}

.node__title {
  font-weight: 600;
  text-align: left;
}

.toggle {
  width: 24px;
  height: 24px;
  transition: all .1s linear;
  padding: 4px;
  rotate: -90deg;
}

.toggle.opened {
  rotate: 0deg;
}

.toggle-icon {
  width: 100%;
  height: 100%;
}

.children {
  padding-left: 8px;
}

.node.selected {
  background-color: rgba(0, 0, 0, .05);
  color: #6565d5;
}
</style>