<template>
    <div id="user">
        <h1 v-if="enteringRoom" class="loading">Entering room <span>{{roomId}}</span></h1>
        <h1 v-else>Creating room</h1>
        <label for="username">Room Id</label>
        <div class="input__wrapper">
            <input type="text" v-model="roomId" id="roomId" role="presentation" autocomplete="off" aria-autocomplete="none" placeholder="Type the room id...">
            <small class="error_feedback" v-if="roomNotFound">
                <AppIcon iconName="fluent:warning-12-filled"/> Room not found! Please try again.
            </small>
        </div>
        <label for="username">Type your name</label>
        <div class="input__wrapper">
            <input type="text" v-model="username" id="username" role="presentation" autocomplete="off" aria-autocomplete="none" placeholder="Your name here...">
            <AppIcon class="icon-button" iconName="fluent:arrow-enter-20-filled" @click="sendForm"/>
        </div>
        <small class="error_feedback" v-if="usernameError">
            <AppIcon iconName="fluent:warning-12-filled"/> Please, enter an username
        </small>
        <nuxt-link class="back-link" to="/">
            <AppIcon class="back-button" iconName="lucide:arrow-left" /> Back to Homepage
        </nuxt-link>
    </div>
</template>

<script setup>
    import { useAuthStore } from '@/stores/auth' 
    import { useRoomStore } from '@/stores/room'

    const route = useRoute()

    const enteringRoom = ref(false)
    const roomId = ref(null)
    const roomIdError = ref(false)
    const showRoomIdInput = ref(false)

    onMounted(() => {
        nextTick(() => {
            const roomIdInput = document.querySelector('#roomId')
            if(roomIdInput) {
                roomIdInput.focus()
            } else {
                document.querySelector('#username').focus()
            }
        })
        document.addEventListener('keydown', sendDataOnEnterPress)

        if(!!route.query.id) {
            enteringRoom.value = true
            if(route.query.id === 'find') {
                showRoomIdInput.value = true
            } else {
                roomId.value = route.query.id
            }
        }
    })
    onBeforeUnmount(() => {
        document.removeEventListener('keydown', sendDataOnEnterPress)
    })

    function sendDataOnEnterPress(e) {
        if(e.key === 'Enter') {
            sendForm()
        }
    }

    definePageMeta({
        middleware: ["processed-if-logged"]
    })

    const username = ref('')
    const usernameError = ref(false)

    const authStore = useAuthStore()
    const roomStore = useRoomStore()

    async function validateForm() {
        roomIdError.value = showRoomIdInput.value && roomId.value == ''
        await roomStore.getRoomById(roomId.value)
        if(!roomStore.$room == undefined) {
            roomIdError.value = true
        }

        usernameError.value = username.value == ''

        return !usernameError.value && !roomIdError.value
    }

    const roomNotFound = ref(false)
    async function sendForm() {
        console.log('send form')
        const validForm = await validateForm()
        if(validForm) {
            await authStore.upsert(username.value)
            if(authStore.$authenticated) {
                const code = await roomStore.getRoomById(roomId.value)
                if(enteringRoom.value) {
                    if(code !== 200) {
                        roomNotFound.value = true
                    } else {
                        roomNotFound.value = false
                        navigateTo('/room/' + roomId.value)
                    }
                } else {
                    navigateTo('/room/create')
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    #user{
        width: 100%;
        max-width: 412px;
        padding: 0 32px;
        .back-link{
            padding: 20px 0;
            color: $text_light;
            text-decoration: none;
            text-transform: uppercase;
            margin: auto;
            display: flex;
            align-items: center;
            &:hover{
                color: $text_dark;
                .back-button{
                    color: $text_dark;
                }
            }
            .back-button{
                width: 24px;
                color: $text_light;
                margin-right: 8px;
            }
        }
        h1{
            margin-bottom: 40px;
            text-align: center;
            span{
                color: $medium_green;
                word-break:break-all;
            }
        }
        label{
            font-weight: 800;
            color: $text_light;
            font-size: 16px;
            display: block;
            padding: 8px 0;
        }
        .input__wrapper{
            position: relative;
            margin-bottom: 12px;
            .icon-button{
                position: absolute;
                right: 0;
                top: 0;
                background-color: $medium_green;
                padding: 8px;
                border-radius:28px;
                color: $white;
                margin: 8px;
                cursor: pointer;
                transition: $transition_default;
                &:hover{
                   background-color: darken($medium_green, 12%)
                }
            }
        }
    }
</style>