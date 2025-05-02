<script setup lang="ts">
import {inject, defineProps, computed, type Ref} from "vue";
import {type TopicNode} from "../App.vue";

interface ExpandedNodesAPI {
  expanded: { value: Set<string> };
  toggle: (path: string) => void;
  selectedId: Ref<string | null>;
}

const {expanded, toggle, selectedId} = inject('expandedNodes') as ExpandedNodesAPI;

const {parentPath, nodes} = defineProps<{
  nodes: TopicNode[];
  parentPath?: string;
}>();


const emit = defineEmits<{
  (e: 'select', id: string): void
}>();

const getNodePath = (node: TopicNode) => {
  return parentPath ? `${parentPath}/${node.title}` : node.title;
};

const handleToggle = (node: TopicNode, path: string) => {
  if (node.children) {
    toggle(path);
  }
};

const isExpanded = (path: string) => {
  return expanded.value.has(path);
};

const level = computed(() => {
  return parentPath ? parentPath.split('/').length : 0;
});



const handleSelect = (id: string) => {
  emit('select', id);
};

</script>

<template>
  <ul>
    <li v-for="node in nodes" :key="node.title">
      <div
          class="node"
          @click="handleSelect(node.id!)"
          :class="{
          'clickable': node.id || node.children,
          'expanded': isExpanded(getNodePath(node)),
          'has-children': node.children,
          'selected': node.id === selectedId,
        }"
      >
        <h3 :style="{ fontSize: `${1.2 - 0.2 * level}rem`}">
          {{ node.title }}
        </h3>

        <button
            v-if="node.children"
            @click.stop="handleToggle(node, getNodePath(node)) "
            class="toggle"
            :class="{
              opened: isExpanded(getNodePath(node))
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
      </div>
      <div v-if="node.children && isExpanded(getNodePath(node))" class="children">
        <Topics
            :nodes="node.children"
            :parent-path="getNodePath(node)"
            @select="emit('select', $event)"
        />
      </div>
    </li>
  </ul>
</template>

<style scoped>
.node {
  cursor: pointer;
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

.node.selected {
  background-color: rgba(0, 0, 0, .05);
  color: #6565d5;
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
</style>