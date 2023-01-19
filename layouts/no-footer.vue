<template>
<div id="body">
    <TheHeaderClean/>
    <main>
        <slot/>
    </main>
</div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
#body{
    display: flex;
    flex-direction: column;
    background-image: linear-gradient($light_grey 0%, $medium_grey 100%);
    main {
        //100vh - header width
        //height: calc(100vh - 130px);
        display: grid;
        place-items: center;
        flex-grow: 1;
        overflow: auto;
    } 
}
</style>