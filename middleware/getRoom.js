import { useRoomStore } from '@/stores/room'

export default defineNuxtRouteMiddleware(async (to) => {
    const roomStore = useRoomStore()

    if(roomStore.$room == undefined || roomStore.$room._id !== to.params.id) {
        await roomStore.getRoomById(to.params.id)
    }
})