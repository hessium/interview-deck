import { defineStore } from 'pinia';

interface ThemeState   {
    isDark: boolean;
    body: HTMLBodyElement | null;
}
export const useTheme = defineStore('theme', {
    state: (): ThemeState => {
        const isDark = localStorage.getItem('theme') === 'true';
        const body = document.querySelector('body');

        if (body) {
            body.classList.toggle('dark', isDark);
        }

        return {
            isDark,
            body
        };
    },
    actions: {
        handleToggle() {
            this.isDark = !this.isDark;

            localStorage.setItem('theme', this.isDark.toString());

            if (this.body) {
                this.body.classList.toggle('dark', this.isDark);
            }
        }
    },
})