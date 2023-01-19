<template>
    <header>
        <div class="room__data">
            <div class="room__data__icon">
                <AppIcon iconName="fluent:emoji-smile-slight-24-regular"/>
                <nuxt-link to="/" class="exit__section">
                    <AppIcon iconName="fluent:arrow-left-16-filled"/>
                    <small>
                        Exit
                    </small>
                </nuxt-link>
            </div>
            <div class="room__data__text">
                <h2>
                    {{username}}
                </h2>
                <span class="room__data__text__room">
                    <p>Room <strong>{{roomId}}</strong></p>
                    <AppIcon iconName="fluent:link-16-filled" @click="copyRoomLink"/>
                </span>
            </div>
        </div>
        <AppIcon iconName="fluent:globe-16-regular" v-if="false"/>
    </header>
</template>

<script setup>
    import { useAuthStore } from "@/stores/auth"
    import { useRoomStore } from "@/stores/room"

    const authStore = useAuthStore()
    const roomStore = useRoomStore()

    const username = ref(authStore.$user.username)
    const roomId = ref(roomStore.$room._id)

    const route = useRoute()
    function copyRoomLink() {
        const roomLink = window.location.host + route.fullPath;

        const textArea = document.createElement('textarea')
        textArea.width = "1px"
        textArea.height = "1px"
        textArea.background = "transparent"
        textArea.value = roomLink
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)
    }
</script>

<style lang="scss" scoped>
    header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 44px 32px;
        position: relative;
        z-index: 1;

        .room__data {
            display: flex;
            align-items: center;
            gap: 12px;

            &__icon {
                background-color: $text_dark;
                max-width: fit-content;
                border-radius: 12px;
                padding: 8px;
                position: relative;
                cursor: pointer;
                svg {
                    color: $secondary_light_green;
                }
                .exit__section{
                    position: absolute;
                    background-color: $white;
                    border-radius: 28px;
                    left: 0px;
                    top: 12px;
                    width: 32px;
                    height: 32px;
                    display: grid;
                    place-items: center;
                    box-shadow: 0 8px 20px 0 $box_shadow;
                    opacity: 0;
                    transition: $transition_default;
                    svg{
                        color: $text_dark;
                        width: 24px;
                        height: 24px;
                    }
                    small{
                        background-color: $medium_grey;
                        position: absolute;
                        top: 140%;
                        border-radius: 12px;
                        font-size: 12px;
                        font-weight: 600;
                        padding: 4px 8px;
                        text-align: center;
                        display: grid;
                        place-items: center;
                        color: $text_dark;
                        box-shadow: 0 8px 20px 0 $box_shadow;
                        &:before{
                            content:'';
                            position: absolute;
                            width: 0; 
                            height: 0; 
                            border-left: 4px solid transparent;
                            border-right: 4px solid transparent;
                            top: -4px;
                            
                            border-bottom: 4px solid $medium_grey;
                        }
                    }
                }
                &:hover{
                    .exit__section{
                        opacity: 1;
                        left: -18px;
                    }
                }
            }

            &__text {
                h2 {
                    font-size: 20px;
                    margin-bottom: 0px;
                }

                &__room {
                    display: flex;
                    align-items: center;
                    gap: 8px;

                    p {
                        text-transform: uppercase;
                        font-size: 14px;
                        color: $dark_green;
                        strong{
                            color: $dark_green;
                        }
                    }

                    svg {
                        width: 20px;
                        height: 20px;
                        color: $dark_green;
                    }
                }
            }
        }
    }
</style>