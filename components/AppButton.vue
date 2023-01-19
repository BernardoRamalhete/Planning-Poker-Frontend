<template>
    <button>
        <slot/>
    </button>
</template>

<script setup>

</script>

<style lang="scss" scoped>
    button {
        border: 2px solid #E8F1F2;
        border-radius: 24px;
        font-weight: 600;
        font-size: 20px;
        color: $white;
        min-width: 120px;
        min-height: 60px;
        padding: 12px 20px;
        box-shadow: 0px 8px 20px rgba(0, 26, 35, 0.1);
        cursor: pointer;
        transition: $transition_default;

        &.primary {
            background-color: $medium_green;
            &:hover{
                background-color: darken($medium_green, 12%);
                border-color: $medium_green;
            }
        }
        &.cancel {
            background-color: $text_light;
            &:hover{
                background-color: darken($text_light, 12%);
                border-color: $text_light;
            }
        }
        &.dark {
            background-color: $text_dark;
            &:hover{
                background-color: $white;
                border-color: $medium_green;
                color: $medium_green;
            }
        }
        &.light {
            background-color: $white;
            color: $text_dark;
            &:hover{
                background-color: $text_dark;
                color: $white;
            }
        }
        &.highlighted {
            background-color: $white;
            color: $medium_green;
            &:hover{
                border-color: $medium_green;
            }
            &:disabled{
                color: darken($medium_grey, 10%);
                &:hover{
                    border-color:$medium_grey;
                    cursor: not-allowed;
                }
            }
        }
    }
</style>