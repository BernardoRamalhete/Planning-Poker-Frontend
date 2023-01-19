<template>
    <form id="create" @submit.prevent="createRoom">
        <h1>Select your room's valid cards</h1>
        <small class="error_feedback" v-if="createRoomError">
            <AppIcon iconName="fluent:warning-12-filled"/> You need to select at least 3 cards!
        </small>
        <div class="cards__wrapper">
            <label for="question_mark">
                <input type="checkbox" id="question_mark" @change="handleCardSelection('question_mark')">
                <AppCard icon="fluent:question-16-filled"/>
            </label>
            <label for="coffe_mug">
                <input type="checkbox" id="coffe_mug" @click="handleCardSelection('coffe_mug')">
                <AppCard icon="fluent:drink-coffee-16-filled"/>
            </label>
            <label 
                v-for="number in cardNumbers"
                :key="number"
                :for="`number_${number}`"
            >
                <input type="checkbox" :id="`number_${number}`" @change="handleCardSelection(`number_${number}`)">
                <AppCard 
                    :isIconCard="false" 
                    :text="number"
                />
            </label>
        </div>
        <div class="timer__wrapper">
            <p>Expire time per User Story (optional):</p>
            <div class="timer__wrapper__select">
                <AppIcon iconName="fluent:timer-12-regular"/>
                <div class="timer__wrapper__select__dropdown">
                    <AppButton @click="toggleTimerDropdown" type="button">
                        <p>{{ selectedTimerOption }}s</p>
                        <AppIcon iconName="fluent:chevron-down-12-regular"/>
                    </AppButton>
                    <ul v-if="isDropdownOpened" class="timer__wrapper__select__dropdown__menu">
                        <li v-for="option in timerOptions" :key="option" @click="selectTimerOption(option)">{{option}}s</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="button__wraper">
            <AppButton class="cancel" type="button" @click="navigateTo('/')">Cancel</AppButton>
            <AppButton class="primary" type="submit">Create room</AppButton>
        </div>
    </form>
</template>

<script setup>
    import { useRoomStore } from "@/stores/room"

    definePageMeta({
        layout: 'no-footer'
    })

    const createRoomError = ref(false)

    const cardNumbers = reactive([0, 0.5, 1, 2, 3 ,5, 8, 13, 20, 40, 100])

    const selectedCards = reactive(new Set())
    function handleCardSelection(card) {
        selectedCards.has(card) ? selectedCards.delete(card) : selectedCards.add(card)
    }


    const isDropdownOpened = ref(false)

    function toggleTimerDropdown(){
        isDropdownOpened.value = !isDropdownOpened.value
    }

    const timerOptions = reactive([0, 10, 20, 30, 40, 50, 60])
    const selectedTimerOption = ref(0)
    function selectTimerOption(option) {
        selectedTimerOption.value = option
        isDropdownOpened.value = false
    }

    const roomStore = useRoomStore()
    async function createRoom() {
        createRoomError.value = selectedCards.size < 3
        if(!createRoomError.value){
            const data = {
                cards: Array.from(selectedCards),
                timerInSeconds: selectedTimerOption.value > 0 ? selectedTimerOption.value : null
            }
    
            await roomStore.create(data)
    
    
            if(roomStore.$room != undefined) {
                navigateTo('/room/' + roomStore.$room._id)
            }
        }
    }
    
</script>

<style lang="scss" scoped>
    #create {
        display: grid;
        place-items: center;
        //margin: 40px 20px;
        .cards__wrapper {
            display: flex;
            flex-wrap: wrap;
            grid-gap: 20px;
            width: 100%;
            max-width: 880px;
            padding: 40px 20px;
            overflow: auto;
            justify-content: center;
            @media(max-width: $br_desktop){
                display: grid;
                grid-template-areas: '. . . . . . . . . . . . .';
                justify-content: inherit;
            }
            label {
                input[type="checkbox"] {
                    display: none;
                    &:checked + div{
                        background-color: $light_green;
                        border-color: $medium_green;
                    }
                }
            }

        }
        .timer__wrapper {
            margin-bottom: 40px;
            position: relative;
            z-index: 1;
            &>p {
                margin-bottom: 28px;
                font-size: 16px;
            }
            
            &__select {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 16px;

                svg {
                    color: $text_light;
                    width: 30px;
                    height: 30px;
                }
                &__dropdown {
                    position: relative;
                    button {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        gap: 12px;
                        border: 2px solid $medium_grey;
                        cursor: pointer;
                        min-width: 100%;
                        width: 92px;
                        box-shadow: 0 8px 20px 0 $box_shadow;
                        border-radius: 12px;
                        padding: 8px 12px;
                        font-size: 16px;
                        background-color: $white;
                        p{
                            display: grid;
                            place-items: center;
                            font-weight: 600;
                        }
                        svg {
                            width: 20px;
                            height: 20px;
                        }
                    }
                    &__menu {
                        position: absolute;
                        background-color: $white;
                        padding: 8px;
                        border-radius: 8px;
                        list-style: none;
                        box-shadow: 0 8px 20px 0 $box_shadow;
                        overflow: auto;
                        max-height: 100px;
                        width: 100%;
                        border: 2px solid $medium_grey;
                        li{
                            padding: 8px;
                            font-size: 14px;
                            font-weight: 600;
                            cursor: pointer;
                            border-radius: 8px;
                            &:hover{
                                background-color: $light_green;
                            }
                        }
                    }
                }
            }
        }
        .button__wraper{
            width: 100%;
            padding: 40px 20px;
            position: fixed;
            justify-content: space-between;
            align-items: center;
            right: 0;
            bottom: 0;
            display: flex;
        }
    }
</style>