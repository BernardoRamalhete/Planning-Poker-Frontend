<template>
    <div id="lower-content" :class="{active : roomStatus['report']}">
        <div class="results" v-if="roomStatus['report']">
            <h2>Results</h2>
            <p>Select the better choice for the Team</p>
            <div class="selected__results">
                <ul class="selected__results__cards">
                    <li v-for="(vottedCard, index) in Array.from(vottedCards.keys())" :key="index">
                        <h3>{{ vottedCards.get(vottedCard) }} vote{{ vottedCards.get(vottedCard) > 1 ? 's' : ''}}</h3>
                        <AppCard v-if="isIconCard(vottedCard)" :icon="getIconCard(vottedCard)"/>
                        <AppCard v-else :text="getCardText(vottedCard)" :isIconCard="false"/>
                    </li>
                </ul>
                <div class="agreement">
                    <h3>
                        Agreement
                    </h3>
                    <div>
                        <strong>
                            {{ agreementPercentage }}%
                        </strong>
                        <div class="agreement__bar">
                            <span :style="`width: ${agreementPercentage}%`" />
                        </div>
                    </div>
                </div>
                <div class="final__decision">
                    <h3>Final decision</h3>
                    <ul class="final__decision__cards">
                        <li v-for="card in roomCards" :key="card">
                            <label :for="card">
                                <input name="final-card" v-model="finalDecision" @click="changeFinalDecision(card)" type="radio" :value="card" :id="card">
                                <span>
                                    <AppIcon v-if="isIconCard(card)" :iconName="getIconCard(card)" />
                                    <p v-else>{{ getCardText(card) }}</p>
                                </span>
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="team__members">
            <h2>Team Members</h2>
            <ul>
                <li v-for="user in users" :key="user.id">
                    <div class="card__placeholder" v-if="showPlaceholderCard(user)"/>
                    <div class="card__ready" v-if="showReadyCard(user)">
                        <AppIcon iconName="fluent:checkmark-12-regular"/>
                    </div>

                    <div v-if="showPlayerCard(user)">
                        <div v-if="isIconCard(user.card)" class="card__revealed">
                            <AppIcon :iconName="getIconCard(user.card)"/>
                        </div>
                        <div v-else class="card__revealed">
                            {{ getCardText(user.card) }}
                        </div>
                    </div>

                    <div class="user__text">
                        <strong>{{user.username}}</strong>
                        <p v-if="roomStatus['standBy']" class="waiting">Waiting</p>
                        <p v-else-if="user.card == undefined && !roomStatus['report']" class="loading">Voting</p>
                        <p v-if="(roomStatus['voting'] && user.card != undefined) || roomStatus['report']" class="ready">Ready!</p>
                    </div>

                </li>
            </ul>
        </div>
        
    </div>
</template>

<script setup>
    import { useRoomStore } from '@/stores/room'
    const props = defineProps({
        roomStatus: {
            type: Object,
            required: true
        },
        users: {
            type: Object,
            required: true
        },
        parentFinalDecision: {
            type: String,
            required: true
        }
    })
    const { roomStatus, users, parentFinalDecision } = toRefs(props)

    const emit = defineEmits(['finalDecisionSelected'])
    
    const usersArray = computed(() => {
        return Object.values(users.value)
    })

    const roomStore = useRoomStore()
    const roomCards = reactive(roomStore.$room.cards)
    
    const vottedCards = computed(() => {
        const result = new Map()
        usersArray.value.map(user => {
            if(user.card) {
                if(result.has(user.card)) {
                    result.set(user.card, (result.get(user.card) + 1))
                } else {
                    result.set(user.card, 1)
                }
            }
        })

        return result
    })

    const agreementPercentage = computed(() => {
        if(vottedCards.value.size > 0) {
            let totalVotes = 0
            let mostVottedAmount = 0
            Array.from(vottedCards.value.values()).map(votesAmount => {
                totalVotes += votesAmount
    
                if(votesAmount > mostVottedAmount) mostVottedAmount = votesAmount
            })
    
            if(totalVotes > 0) {
                return (100 * mostVottedAmount) / totalVotes
            } else {
                return 100
            }
        } else {
            return 100
        }
    })

    const finalDecision = ref(null)
    function changeFinalDecision(card) {
        finalDecision.value = card
        emit('finalDecisionSelected', card)
    }
    watch(parentFinalDecision, () => {
        finalDecision.value = parentFinalDecision.value
    })

    const showReadyCard = computed(() => {
        return (user) => {
            return !roomStatus.value['report'] && 
                    (
                        user.card != undefined && 
                        (roomStatus.value['voting'] || roomStatus.value['votingCompleted'])
                    )
        }
    })

    const showPlaceholderCard = computed(() => {
        return (user) => {
            return (roomStatus.value['report'] && user.card == undefined) || 
                    (
                        user.card == undefined || 
                        roomStatus.value['standBy']
                    )
        }
    })

    const showPlayerCard = computed(() => {
        return (user) => {
            return roomStatus.value['report'] && user.card != undefined
        }
    })

    const isIconCard = computed(() => {
        return (card) => {
            if(card != undefined) {
                return typeof card === 'string' && !card.includes('number_')
            } else {
                return true
            }
        }
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

<style lang="scss" scoped>
    #lower-content {
        flex-grow: 1;
        background-color: $white;
        transition: $transition_default;
        
        .team__members {
            padding: 48px 32px 48px 32px;

            @media (max-width:$br_mobile){
                h2{
                    text-align: center;
                }
            }

            ul {
                margin: 48px 0;
                list-style: none;
                display: grid;
                grid-template-columns:repeat(4,1fr);
                grid-gap: 20px;
                @media (max-width:$br_mobile){
                    grid-template-columns:repeat(1,1fr);
                    grid-gap: 40px;
                }

                li {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    .card__placeholder {
                        background-color: $medium_grey;
                        width: 68px;
                        height: 94px;
                        border-radius: 8px;
                    }
                    .card__ready {
                        background-color: $medium_green;
                        width: 68px;
                        height: 94px;
                        border-radius: 8px;
                        display: grid;
                        place-items: center;
                        border: 2px solid $medium_grey;
                        box-shadow: 0px 4px 8px $box_shadow;
                        svg {
                            color: $white;
                        }
                    }
                    .card__revealed {
                        width: 68px;
                        height: 94px;
                        border-radius: 8px;
                        display: grid;
                        place-items: center;
                        font-size: 28px;
                        font-weight: bold;
                        color: $text_dark;
                        border: 2px solid $medium_grey;
                        box-shadow: 0px 4px 8px $box_shadow;
                    }
                    .user__text{
                        strong{
                            color: $text_dark;
                            font-size: 20px;
                        }
                        p{
                            font-size: 16px;
                            font-weight: 600;
                            color: $text_light;
                            &.waiting{
                                color: $text_light;
                            }
                            &.ready{
                                color: $medium_green;
                            }
                        }
                    }
                }
            }
        }
        .results{
            padding: 48px 32px 0 32px;
            >p{
                font-weight: 600;
                margin-bottom: 40px;
            }
            .selected__results{
                display: flex;
                justify-content: space-between;
                gap: 40px;
                @media (max-width:$br_mobile){
                    flex-wrap: wrap;
                }
                &__cards{
                    list-style: none;
                    display: flex;
                    gap: 20px;
                    li{
                        h3{
                            color: $text_dark;
                            font-size: 20px;
                            margin-bottom: 14px;
                            display: block;
                        }
                    }
                }
                .agreement{
                    @media (max-width:$br_mobile){
                        width: 100%;
                    }
                    h3{
                        color: $text_dark;
                        font-size: 20px;
                        margin-bottom: 14px;
                        display: block;
                    }
                    strong{
                        font-size: 60px;
                        font-weight:600;
                        color: $medium_green;
                        word-break: break-all;
                        min-width: 160px;
                        display: block;
                    }
                    &__bar{
                        widows: 100%;
                        height:12px;
                        background-color: $medium_grey;
                        border-radius: 20px;
                        position: relative;
                        span{
                            height: 100%;
                            background-color: $medium_green;
                            border-radius: 20px;
                            position: absolute;
                        }
                    }
                }
                .final__decision{
                    h3{
                        color: $text_dark;
                        font-size: 20px;
                        margin-bottom: 14px;
                        display: block;
                    }
                    &__cards{
                        list-style: none;
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                        li{
                            label{
                                span{
                                    background-color: $medium_grey;
                                    display: grid;
                                    place-items: center;
                                    width: 60px;
                                    height: 80px;
                                    border-radius: 8px;
                                    border: 2px solid $medium_grey;
                                    font-weight: 600;
                                    font-size: 20px;
                                    cursor: pointer;
                                    transition: $transition_default;
                                    svg, p{
                                        color: $text_light;
                                    }
                                    svg{
                                       width: 24px;
                                       height: 24px; 
                                    }
                                }
                                input[type=radio]{
                                    display: none;
                                    &:checked+span{
                                        border-color:$medium_green;
                                        background-color:$white;
                                        box-shadow: 0 8px 20px 0 $box_shadow;
                                        p,svg{
                                            color: $medium_green;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
</style>