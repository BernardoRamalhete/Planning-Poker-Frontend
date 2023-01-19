<template>
<div id="body">
    <TheHeaderClean/>
    <main>
        <slot/>
    </main>
    <footer>
        <p>Just another amazing project developed by <span>two guys</span></p>
    </footer>
</div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
#body{
    background-image: linear-gradient($light_grey 0%, $medium_grey 100%);
    main {
        //100vh - header width - footer width
        height: calc(100vh - 130px - 56px);
        display: grid;
        place-items: center;
    } 

    footer {
        text-align: center;
        padding-bottom: 38px;
        p {
            font-size: 12px;
             span {
                color: $text_highlight
            }
        }
    }
}
</style>