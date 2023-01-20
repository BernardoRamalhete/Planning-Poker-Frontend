<template>
    <div :class="{bordered__card : hasBorder}">
        <AppIcon :iconName="icon" v-if="isIconCard"/>
        <p v-else>{{text}}</p>
    </div>
</template>

<script setup>
    const props = defineProps({
        icon: {
            type: String,
            default: "fluent:error-circle-12-filled"
        },
        isIconCard: {
            type: Boolean,
            default: true
        },
        text: {
            default: "Missing text prop"
        },
        hasBorder: {
            type: Boolean,
            default: true
        }
    })

    const { icon } = toRefs(props)
</script>

<style lang="scss" scoped>
 div {
    // padding: 96px 60px;
    width: 160px;
    height: 200px;
    border-radius: 12px;
    background-color: $white;
    box-shadow: 0px 12px 20px $box_shadow;
    transition: $transition_default;
    display: grid;
    place-items: center;
    cursor: pointer;
    svg {
        width: 48px;
        height: 48px;
    }
    @media(max-width: $br_mobile){
        width: 80px;
        height: 110px;
        svg {
            width: 32px;
            height: 32px;
        }
    }
    &.bordered__card{
        width: 100px;
        height: 140px;
        background-image: url('@/assets/images/card_border.svg');
        background-repeat: no-repeat;
        background-position: center center;
        background-size: 90%;
        border: 2px solid $medium_grey;
        p {
            font-size: 30px;
            font-weight: 600;
            color: $text_dark;
        }
    
        svg {
            width: 32px;
            height: 32px;
        }
        @media(max-width: $br_mobile){
            width: 80px;
            height: 110px;
        }
    }
    &:hover{
        transform: scale(1.08);
    }


    &.primary {
        background-image: $green_gradient;
        svg {
            color: $white;
        }
    }

    &.secondary {
        svg {
            color: $medium_green;
        }
    }
 }

</style>