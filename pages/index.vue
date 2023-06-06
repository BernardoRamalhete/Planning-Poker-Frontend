<template>
  <div class="container">
    <h1>What do you wanna do?</h1>
    <div class="select__options__wrap">
      <nuxt-link :to="isLogged ? '/room/create' : '/room/user'" class="select__options__wrap__item">
        <AppCard icon="fluent:add-12-filled" :hasBorder="false" class="primary"/>
        <p>Open new room</p>
      </nuxt-link>
      <nuxt-link to="/room/user?id=find" class="select__options__wrap__item">
        <AppCard icon="fluent:door-arrow-left-16-regular" :hasBorder="false" class="secondary"/>
        <p>Enter a room</p>
      </nuxt-link>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isLogged = computed(() => {
  return authStore.$authenticated
})
</script>

<style lang="scss" scoped>
.container{
  padding: 0 32px;
  h1{
    text-align: center;
  }
  .select__options__wrap {
    display: flex;
    align-items: center;
    gap: 48px;
    margin-top: 40px;
    &__item {
      display: grid;
      place-items: center;
      text-decoration: none;
      text-align: center;
      p {
        text-transform: uppercase;
        font-size: 20px;
        font-weight: 600;
        margin-top: 20px;
        transition: $transition_default;
        @media(max-width: $br_mobile){
          font-size: 16px;
        }
      }
      &:hover{
        p{
          color: $medium_green;
        }
      }
    }
  }
}
</style>