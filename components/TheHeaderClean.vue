<template>
    <header>
        <nuxt-link to="/">
            <img src="@/assets/images/PlanningPokerLogo.svg" alt="logo">
        </nuxt-link>
        <AppIcon iconName="fluent:globe-16-regular" v-if="false"/>
    </header>
</template>

<script setup>

</script>

<style lang="scss" scoped>
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 32px;
    }
</style>