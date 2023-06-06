<template>
    <NuxtLayout>
        <AppLoading v-if="isLoading"/>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup>
    import { useLoadingStore } from '@/stores/loading';

    const loadingStore = useLoadingStore()
    const isLoading = computed(() => {
        return  loadingStore.$active
    })
    loadingStore.setActive(true)
    
    onMounted(() => {
        loadingStore.setActive(false)
    })
</script>
    
<style lang="scss" scoped>
    .layout-enter-active,
    .layout-leave-active {
        transition: all 0.4s;
    }
    .layout-enter-from,
    .layout-leave-to {
        opacity: 0;
    }
    .page-enter-active,
    .page-leave-active {
        transition: all 0.4s;
    }
    .page-enter-from,
    .page-leave-to {
        opacity: 0;
        filter: blur(1rem);
    }
</style>