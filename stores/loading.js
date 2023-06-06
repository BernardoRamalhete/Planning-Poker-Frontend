import { defineStore } from 'pinia';

export const useLoadingStore = defineStore('loading', {
    state: () => ({
        active: false
    }),
    getters: {
        $active: state => state.active
    },
    actions: {
        setActive(value) {
            this.active = value
        }
    }
});
