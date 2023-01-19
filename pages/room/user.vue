<template>
    <div id="user">
        <h1 v-if="enteringRoom" class="loading">Entering room <span>{{roomId}}</span></h1>
        <h1 v-else>Creating room</h1>
        <label for="username">Room Id</label>
        <div class="input__wrapper">
            <input type="text" v-model="roomId" id="roomId" role="presentation" autocomplete="off" aria-autocomplete="none" placeholder="Your name here...">
        </div>
        <label for="username">Type your name</label>
        <div class="input__wrapper">
            <input type="text" v-model="username" id="username" role="presentation" autocomplete="off" aria-autocomplete="none" placeholder="Your name here...">
            <AppIcon iconName="fluent:arrow-enter-20-filled" @click="sendForm"/>
        </div>
        <small class="error_feedback" v-if="usernameError">
            <AppIcon iconName="fluent:warning-12-filled"/> Please, enter an username
        </small>
    </div>
</template>

<script setup>
    import { useAuthStore } from '@/stores/auth' 
    import { useRoomStore } from '@/stores/room'

    onMounted(() => {
        const roomIdInput = document.getElementById('roomId')
        if(roomIdInput) {
            roomIdInput.focus()
        } else {
            document.getElementById('username').focus()
        }
        document.addEventListener('keydown', sendDataOnEnterPress)
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

    const route = useRoute()

    const enteringRoom = ref(false)
    const roomId = ref(null)
    const roomIdError = ref(false)
    const showRoomIdInput = ref(false)

    if(!!route.query.id) {
        enteringRoom.value = true
        if(route.query.id === 'find') {
            showRoomIdInput.value = true
        } else {
            roomId.value = route.query.id
        }
    }

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

    async function sendForm() {
        const validForm = await validateForm()
        if(validForm) {
            await authStore.upsert(username.value)
            if(authStore.$authenticated) {
                if(enteringRoom.value) {
                    navigateTo('/room/' + roomId.value)
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
        h1{
            margin-bottom: 40px;
            text-align: center;
            span{
                color: $medium_green;
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
            margin-bottom: 20px;
            svg{
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