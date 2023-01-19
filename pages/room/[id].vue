<template>
    <div id="page-id">
        <AppLoading v-if="loading"/>
        <RoomIdUpperContent 
            :users="users"
            :roomStatus="roomStatus"
            @startVoting="startVoting"
            @cardSelected="sendCardSelection"
            @showCards="showPlayersCards"
            @restartRoom="restartRoom"
        />
        <RoomIdLowerContent 
            :roomStatus="roomStatus"
            :users="users"
            :parentFinalDecision="finalDecision"
            @finalDecisionSelected="sendFinalDecisionSelection"
        />
    </div>
</template>

<script setup>
    import moment from 'moment'
    import { useAuthStore } from '@/stores/auth'
    import { useRoomStore } from '@/stores/room'
    import { useRuntimeConfig } from '#imports'

    definePageMeta({
        middleware: ["get-room", "auth"],
        layout: "room"
    })

    const route = useRoute()
    const roomId = ref(route.params.id)
    const authStore = useAuthStore()

    const loading = ref(true)

    const runtimeConfig = useRuntimeConfig();
    const SOCKET_URL = runtimeConfig.public.SOCKET_URL
    const socket = ref(null)
    onMounted(() => {
        socket.value = new WebSocket(SOCKET_URL)

        socket.value.onmessage = processSocketMessage

        window.addEventListener('beforeunload', () => sendSocketMessage({
            command: 'bye bye',
            data: {
                roomId: roomId.value
            }
        }))
    })
    onBeforeUnmount(() => {
        sendSocketMessage({
            command: 'bye bye',
            data: {
                roomId: roomId.value
            }
        })
        socket.value.close()
    })
    function processSocketMessage(e) {
        const data = JSON.parse(e.data)
        if(data.command) {
            switch(data.command) {
                case 'connected': 
                    sendInitialData()
                    break;
                case 'start room':
                    startVoting(false)
                    break;
                case 'upsert user':
                    users[data.data.id] = data.data
                    break;
                case 'sync room': {
                    if(data.data != undefined) {
                        const receivedState = data.data.state
                        const receivedCounter = data.data.counter
                        
                        setRoomStatus(receivedState[receivedState.length - 1])

                        if(roomHasCounter.value && roomStatus['counter']) {
                            let updatedAt = null
                            let now = null
                            let timePassed = 0
                            if(data.data.updated_at != undefined) {
                                updatedAt = moment(new Date(data.data.updated_at))
                                now = moment(new Date())
                                timePassed = now.diff(updatedAt, 'seconds')
                            }
                            
                            let finalTime
                            if(receivedCounter != undefined) {
                                finalTime = receivedCounter - timePassed
                            } else {
                                finalTime = roomStore.$room.timerInSeconds - timePassed
                            }
                            roomStore.setCounter(finalTime)
                            if(counter.value > 0) {
                                roomStore.startCounter()
                            } else {
                                roomStore.setCounter(0)
                            }
                        }
                    }
                    loading.value = false
                }
                break;
                case 'update final decision':
                    finalDecision.value = data.data.card
                    break;
                default: console.log('Unknown command: ', data.command)
            }
        } else {
            console.log('Missing command key: ', data)
        }
    }
    function sendInitialData() {
        loading.value = true
        sendSocketMessage({
            command: 'store user and send room state',
            data: {
                user: {
                    id: authStore.$user.id,
                    username: authStore.$user.username,
                    card: null
                },
                roomId: roomId.value
            }
        })
    }
    function sendSocketMessage(message) {
        socket.value.send(JSON.stringify(message))
    }

    const users = reactive({})

    const roomStore = useRoomStore()
    const counter = computed(() => roomStore.$counter)
    watch(counter, () => {
        if(counter.value != undefined && counter.value === 0 && !roomStatus['report']) {
            setRoomStatus('votingCompleted')
            roomStore.resetCounter()
        }
    })

    const finishedVoting = computed(() => {
        const usersArray = Object.values(users)

        return usersArray.findIndex(user => user.card == undefined) === -1
    })
    const roomHasCounter = ref(roomStore.$room.timerInSeconds != undefined)
    const roomStatus = reactive({
        standBy: true,
        voting: false,
        counter: false,
        votingCompleted: finishedVoting.value,
        report: false
    })
    function updateRoomOnWebsocket() {
            const data = {
                command: 'update room state',
                data: {
                    id: roomId.value,
                    info: {
                        state: Object.keys(roomStatus).filter(status => roomStatus[status]),
                        counter: roomStore.$counter
                    }
                }
            }
            console.log(data)
            sendSocketMessage(data)
    }

    function setRoomStatus(statusToSet) {
        const availableStatus = Object.keys(roomStatus)
        availableStatus.map(status => {
            roomStatus[status] = false
        })
        switch(statusToSet) {
            case 'standBy':
                roomStatus['standBy'] = true
                break;
            case 'counter': 
                roomStatus['counter'] = true
                roomStatus['voting'] = true
                break;
            case 'voting': 
                roomStatus['voting'] = true
                break;
            case 'votingCompleted':
                roomStatus['votingCompleted'] = true
                break;
            case 'report': 
                roomStatus['report'] = true
                break;
            default: console.error("Unknown status: " + statusToSet)
        }
    }
    watch(roomStatus, () => {
        console.log(roomStatus)
    })
    
    function startVoting(sendStartSignalToWebSocket = true) {
        if(roomHasCounter.value) {
            roomStore.startCounter()
            setRoomStatus('counter')
        } else {
            setRoomStatus('voting')
        }
        updateRoomOnWebsocket()
    }

    function showPlayersCards() {
        setRoomStatus('report')
        updateRoomOnWebsocket()
    }

    function restartRoom() {
        setRoomStatus('standBy')
        updateRoomOnWebsocket()
    }

    function sendCardSelection(selectedCard) {
        const data = {
            roomId: roomId.value,
            user: {
                id: authStore.$user.id,
                username: authStore.$user.username,
                card: selectedCard
            }
        }

        sendSocketMessage({
            command: 'send card selection',
            data: data
        })
    }

    function sendFinalDecisionSelection(card) {
        sendSocketMessage({
            command: 'update final decision',
            data: { 
                id: roomId.value, 
                card: card 
            }
        })
    }

    const finalDecision = ref('')
</script>

<style lang="scss" scoped>
    #page-id {
        height: 100%;
        display: flex;
        flex-direction: column;
    }
</style>