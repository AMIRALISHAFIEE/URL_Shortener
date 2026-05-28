<template>
    <div class="overflow-hidden">
        <p class="text-sm text-gray-600 truncate">
            {{ props.item.original }}
        </p>
        <p class="font-bold text-blue-600 truncate">
            {{ props.item.short }}
        </p>
        <span dir="ltr" class="text-xs text-gray-500">
            expire at: {{ item.expireDay ? item.expireDay.replace(/\s?GMT.*$/, '') : 'never' }}
        </span>
    </div>
    <div class="flex md:flex-row flex-col flex-wrap gap-2">
        <copy class="md:w-6 w-4 cursor-pointer md:h-6 h-4" @click="copyToClipboard(props.item.short)" />
        <trash class="md:w-6 w-4 cursor-pointer md:h-6 h-4" @click="$emit('deleteItem', item.id)" />
        <QrCodeSVG @click="showQR = !showQR" class="md:w-6 w-4 cursor-pointer md:h-6 h-4" />
        <share class="md:w-6 w-4 md:h-6 h-4 cursor-pointer" @click="shareLink(item)" />
    </div>
    <show-q-rcode :show="showQR" @hide-q-r="hideQR" />
    <toast v-if="showToast || isShare" :message="isShare ? 'با موفقیت به اشتراک گذاشته می شود.' : 'لینک کوتاه کپی شد.'" />
</template>
<script setup>
import { ref } from 'vue'
import trash from '../components/svg/trash-bin-2-svgrepo-com.vue'
import copy from '../components/svg/copy-svgrepo-com.vue'
import share from '../components/svg/share-svgpro-com.vue'
import toast from '../components/toast.vue'
import showQRcode from '../components/showQRcode.vue'
import QrCodeSVG from '../components/svg/qr-code-svgrepo-com.vue'
const props = defineProps({
    item: {
        required: true,
        type: Object
    }
})
const emits = defineEmits(['deleteItem'])
const showToast = ref(false)
const isShare = ref(false)
const showQR = ref(false)
const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text)
    showToast.value = true
    setTimeout(() => {
        showToast.value = false
    }, 2000)
}
const hideQR = (flag) => {
    showQR.value = flag
}
const shareLink = async (item) => {
    const shareData = {
        title: 'لینک کوتاه',
        text: item.short,
        url: window.location.href 
    }
    if (navigator.share) {
        try {
            await navigator.share(shareData)
            isShare.value = true
            setTimeout(() => {
                isShare.value = false
            }, 1000);
        } catch (err) {
            alert('خطایی رخ داد: ', err)
        }
    } else {
        copyToClipboard(shareData.text)
        alert('قابلیت اشتراک‌گذاری مستقیم در این مرورگر پشتیبانی نمی‌شود. لینک در حافظه کپی شد!')
    }
}
</script>