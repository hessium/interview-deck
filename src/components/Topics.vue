<script setup lang="ts">
import { inject, defineProps } from "vue";
import { type TopicNode } from "../App.vue";

const props = defineProps<{
  nodes: TopicNode[];
  parentPath?: string;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void
}>();

const { expanded, toggle } = inject('expandedNodes') as {
  expanded: { value: Set<string> };
  toggle: (path: string) => void;
};

const getNodePath = (node: TopicNode) => {
  return props.parentPath ? `${props.parentPath}/${node.title}` : node.title;
};

const handleToggle = (node: TopicNode, path: string) => {
  if (node.children) {
    toggle(path);
  }
};

const isExpanded = (path: string) => {
  return expanded.value.has(path);
};

</script>

<template>
  <ul>
    <li v-for="node in nodes" :key="node.title">
      <div
          class="node"
          :class="{
          clickable: node.id || node.children,
          'has-children': node.children,
          expanded: isExpanded(getNodePath(node))
        }"
          @click="emit('select', node.id!)"
      >
        <h3>{{ node.title }}</h3>
        <button @click.stop="handleToggle(node, getNodePath(node)) " v-if="node.children" class="toggle">
          {{ isExpanded(getNodePath(node)) ? '▼' : '▶' }}
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
ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.node {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.toggle {
  margin-left: auto;
  width: 32px;
  height: 32px;
  display: inline-block;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.children {
  padding-left: 8px;
}

</style>