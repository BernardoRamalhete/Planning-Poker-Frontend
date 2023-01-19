<template>
    <div id="body">
        <TheSidebarRoom/>
        <main>
            <TheHeaderRoom/>
            <div id="content">
                <slot/>
            </div>
        </main>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
    #body {
        display: flex;
        main {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
            overflow: auto;
            background-image: linear-gradient(180deg, $secondary_light_green 0%, $medium_green 100%);
            #content {
                flex-grow: 1;
            }
        }
    }
</style>