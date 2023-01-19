<template>
    <aside>
        <img src="@/assets/images/PlanningPokerLogoAlt.svg" alt="logo"/>
        <AppIcon iconName="fluent:settings-16-regular" v-if="false"/>
    </aside>
</template>

<script setup>

</script>

<style lang="scss" scoped>
    aside {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        padding: 32px 20px;
        background-color: $white;
        border-right: 1px solid $medium_grey;
        @media(max-width: $br_mobile){
            display: none;
        }
    }
</style>