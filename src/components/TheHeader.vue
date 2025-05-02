<script setup lang="ts">
import {useSidebar} from "../stores/sidebar.ts";

const sidebar = useSidebar();
</script>

<template>
  <header class="header">
    <button class="burger" @click="sidebar.handleToggle()">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2,4A1,1,0,0,1,3,3H21a1,1,0,0,1,0,2H3A1,1,0,0,1,2,4Zm1,9H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Zm0,8H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Z"/></svg>
    </button>
    <h1 class="title">Вопросы к собеседованию</h1>
  </header>
</template>

<style scoped>

.header {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 1rem;
  border-bottom: 2px solid;
}
.burger {
  display: none;
}

@media (max-width: 1024px) {
  .header {
    padding: 1rem;
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
    height: 70px;
  }

  .burger {
    width: 24px;
    height: 24px;
    display: block;
  }
}
</style>