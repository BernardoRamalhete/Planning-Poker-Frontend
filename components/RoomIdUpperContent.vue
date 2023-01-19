<template>
    <div id="upper-content">
        <transition name="fade">
            <div v-if="!roomStatus['report']">
                <h1>{{ pageTitle }}</h1>
                <div class="cards__wrapper">
                    <label :for="card" v-for="card in roomCards" :key="card">
                        <input 
                            type="radio" 
                            name="card_selection" 
                            :id="card" 
                            :value="card" 
                            :disabled="roomStatus['standBy']" 
                            v-model="selectedCard"
                        />
                        <AppCard v-if="isIconCard(card)" :icon="getIconCard(card)"/>
                        <AppCard v-else :text="getCardText(card)" :isIconCard="false"/>
                    </label>
                </div>
            </div>
        </transition>
        <p>{{buttonDisabled}}</p>
        <AppButton class="centered" :disabled="buttonDisabled" :class="buttonClass" @click="buttonFunction">
            {{ buttonText }}
        </AppButton>
    </div>
</template>

<script setup>
    import { useRoomStore } from '@/stores/room'

    const props = defineProps({
        users: {
            type: Object,
            required: true
        },
        roomStatus: {
            type: Object,
            required: true
        },
    })
    const roomStatus  = toRef(props, 'roomStatus')
    const users  = toRef(props, 'users')

    watch(roomStatus.value, () => {
        if(roomStatus.value['standBy']) {
            selectedCard.value = null
        }
    })

    const emit = defineEmits(['startVoting', 'cardSelected', 'showCards', 'restartRoom'])

    const pageTitle = computed(() => {
        if(roomStatus['standBy']) {
            return 'Waiting for round to start'
        } else {
            return 'Choose a card'
        }
    })

    const roomStore = useRoomStore()
    const counter = computed(() => roomStore.$counter)

    const buttonDisabled = computed(() => {
        let someUserVotted = false
        Object.values(users.value).map(user => {
            if(user.card) {
                someUserVotted = true
            }
        })
        return buttonText.value === 'Show' && !someUserVotted
    })
    const buttonClass = computed(() => {
        if(roomStatus.value['standBy'] || roomStatus.value['report']) {
            return 'dark'
        }

        if(roomStatus.value['counter']) {
            return 'light'
        }
        
        if(roomStatus.value['votingCompleted'] || !roomStatus.value['counter']) {
            return 'highlighted'
        }
    })

    const buttonText = computed(() => {
        if(roomStatus.value['report']) {
            return 'Restart'
        }

        if(roomStatus.value['standBy']) {
            return 'Start'
        }

        if(roomStatus.value['counter']) {
            return counter.value == undefined ? roomStore.$room.timerInSeconds + 's' : counter.value + 's'
        }

        if(roomStatus.value['votingCompleted'] || !roomStatus.value['counter']) {
            return 'Show'
        }
    })

    const buttonFunction = computed(() => {
        if(roomStatus.value['report']) {
            return restartRoom
        }

        if(roomStatus.value['standBy']) {
            return startVoting
        }

        if(roomStatus.value['counter']) {
            return () => {}
        }

        if(roomStatus.value['votingCompleted'] || !roomStatus.value['counter']) {
            return showCards
        }
    })

    function restartRoom() {
        emit('restartRoom')
    }

    function showCards() {
        if(!buttonDisabled.value) {
            emit('showCards')
        }
    }

    function startVoting() {
        emit('startVoting')
    }
    
    const roomCards = computed(() => roomStore.$room.cards)

    const isIconCard = computed(() => {
        return (card) => {
            return !card.includes('number_')
        }
    })

    const selectedCard = ref(null)
    watch(selectedCard, () => {
        emit('cardSelected', selectedCard.value)
        console.log('emitted cardSelected')
    })

    function getIconCard(card) {
        switch(card) {
            case 'coffe_mug':
                return 'fluent:drink-coffee-16-filled'
                break;
            case 'question_mark':
                return 'fluent:question-16-filled'
                break;
            default: return 'fluent:warning-16-regular'
        }
    }
    function getCardText(card) {
        return card.split('_')[1]
    }
</script>

<style lang="scss" >
    #upper-content {
        display: grid;
        place-items: center;
        position: relative;
        h1 {
            text-align: center;
            color: $dark_green;
            margin-bottom: 8px;
        }
        .cards__wrapper {
            padding: 32px 48px 100px 32px ;
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            width: 100%;
            label {
                input[type="radio"] {
                    display: none;
                    &:checked + div{
                        background-color: $light_green;
                        border-color: $medium_green;
                    }
                    &:disabled + div{
                        opacity: 0.4;
                        cursor: not-allowed;
                    }
                }
            }
        }
        .centered {
            position: absolute;
            bottom: -30px;
        }
    }
</style>