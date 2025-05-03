import { defineStore } from 'pinia';

interface SidebarState   {
    isOpen: boolean;
    body: HTMLBodyElement | null;
}
export const useSidebar = defineStore('sidebar', {
    state: (): SidebarState => ({
        isOpen: false,
        body : document.querySelector('body')
    }),
    actions: {
        handleToggle() {
            this.isOpen = !this.isOpen

            if (this.body !== null) {
                this.body.classList.toggle('lock-scroll')
            }
        },
        closeSidebar() {
            this.isOpen = false

            if (this.body !== null) {
                this.body.classList.remove('lock-scroll')
            }
        }
    },
})