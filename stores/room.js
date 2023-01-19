import { defineStore } from 'pinia';
import { useAuthStore } from './auth';

export const useRoomStore = defineStore('room', {
    state: () => ({
        API_RUL: useRuntimeConfig().public.API_URL + '/room/',
        room: null,
        counterIntervalId: null,
        counter: null
    }),
    getters: {
        $room: (state) => state.room,
        $counter: (state) => state.counter
    },
    actions: {
        startCounter() {
            this.decreaseCounter()
            this.counterIntervalId = setInterval(this.decreaseCounter, 1000)
        },
        decreaseCounter() {
            if(this.counter == undefined) {
                this.counter = this.room.timerInSeconds - 1
            } else {
                this.counter = this.counter - 1
            }
        },
        setCounter(value) {
            this.counter = value
        },
        resetCounter() {
            clearInterval(this.counterIntervalId)
            this.counter = null
            this.counterIntervalId = null
        },
        async create(data) {
            try {
                const authStore = useAuthStore()
                let token = null
                
                if(authStore.$authenticated) {
                    token = authStore.$user.token
                }
    
                const body = JSON.stringify(data)
                const headers = {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
    
                const response = await $fetch(this.API_URL + "create", {
                    method: "POST",
                    headers,
                    body
                })
    
                if(!("message" in response)) {
                    this.room = response
                } else {
                    throw new Error(response.message)
                }
            } catch(error) {
                this.room = null
                console.error(error)
            }
        },
        async getRoomById(id) {
            try {
                const response = await $fetch(this.API_URL + id, {
                    method: "GET"
                })

                if(!("message" in response)) {
                    this.room = response
                } else {
                    throw new Error(response.message)
                }
            } catch (error) {
                this.room = null
                console.error(error)
            }
        }
    },
});
