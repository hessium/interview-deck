import { defineStore } from 'pinia';

export const useSidebar = defineStore('sidebar', {
    state: () => ({
        isOpen: false
    }),
    actions: {
        handleToggle() {
            this.isOpen = !this.isOpen
        }
    },
})