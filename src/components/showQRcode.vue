<template>
    <transition>
        <div v-if="props.show" @click="$emit('hideQR', false)"
            class="fixed bg-black/60 top-0 left-0 flex justify-center items-center w-full h-full">
            
            <div @click.stop class="h-[256px] w-[256px] bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                <img :src="QRCode" alt="QR Code" class="w-full h-full object-cover">
            </div>
        </div>
    </transition>
</template>

<script setup>
import QRCode from '../assets/QRcodePic.png'
const props = defineProps({
    show: Boolean
})
const emits = defineEmits(['hideQR'])
</script>

<style scoped>  
.v-enter-active,
.v-leave-active { 
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>