<template>
    <MyIcon />
</template>

<script setup>
    import { Icon } from '#components'
    import { toRefs, h } from 'vue'

    const props = defineProps({
        iconName: {
            type: String,
            required: true
        },
    })

    const { iconName } = toRefs(props)

    const MyIcon = h(Icon, {name : iconName.value})
</script>

<style lang="scss" scoped>

</style>