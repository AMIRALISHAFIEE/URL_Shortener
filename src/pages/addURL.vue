<template>
    <form @submit.prevent class="max-w-md md:w-1/2 w-full  md:mx-auto mx-3 bg-white p-6 rounded-2xl shadow-lg">
        <baseInput v-model="url" :is-format="isFormat" label="لینک را وارد کنید"
            placeholder="https://example.com/products/mobile" />
        <div v-if="errorsList.length">
            <p v-for="err in errorsList" :key="err" class="text-red-500 font-bold text-xs">{{ err }}</p>
        </div>
        <select-box v-model="expire" :list="list" label="تاریخ انقضا را وارد کنید." />
        <button type="button" @click="submitURL" v-if="url && isFormat"
            class="w-full mt-4 py-3 rounded-xl text-white bg-blue-500 transition flex items-center justify-center gap-2">
            ساخت لینک کوتاه
            <loadingAnimation v-if="isLoad" />
        </button>
        <div dir="ltr" v-for="item in recentLinks" :key="item.short"
            class="w-full rounded-xl bg-gray-300 flex items-center justify-between mt-2 shadow py-2 px-4">
            <div>
                <p class="text-sm text-gray-600">{{ item.original }}</p>
                <p class="font-bold text-blue-600">{{ item.short }}</p>
                <span dir="ltr" class="text-xs text-gray-500">
                    epire day: {{ item.expireDay ? item.expireDay.replace(/\s?GMT.*$/, '') : 'never' }}
                </span>
            </div>
            <copy @click="copyToClipboard(item.short)" class="md:w-8 md:h-8 h-6 w-6 cursor-pointer " />
        </div>
    </form>
    <toast v-if="showToast || isSuccess"
        :message="isSuccess ? 'لینک کوتاه با موفقیت ساخته شد.' : 'لینک کوتاه کپی شد.'" />
</template>
<script setup>
import baseInput from '../components/inputs/input.vue'
import selectBox from '../components/inputs/selectBox.vue'
import { ref, watch, onMounted } from 'vue'
import toast from '../components/toast.vue'
import loadingAnimation from '../components/loadingAnimation.vue'
import copy from '../components/svg/copy-svgrepo-com.vue'
const url = ref('')
const shortUrl = ref('')
const expire = ref('never')
const history = ref([])
const recentLinks = ref([])
const errorsList = ref([])
const hasSpace = (text) => /\s/.test(text)
const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/.*)?$/
const isFormat = ref(true)
const isLoad = ref(false);
const isSuccess = ref(false)
const showToast = ref(false)
const list = [
    { name: 'بدون انقضا', value: 'never' },
    { name: 'یک ساعت', value: '1h' },
    { name: 'یک روز', value: '1d' },
    { name: 'یک هفته', value: '7d' },
]
onMounted(() => {
    const savedHistory = localStorage.getItem('url-history')
    if (savedHistory) {
        history.value = JSON.parse(savedHistory)
    }
})
watch(url, (val) => {
    errorsList.value = []
    if (!val) {
        isFormat.value = true
        return
    }
    if (hasSpace(val)) {
        errorsList.value.push('فاصله (space) مجاز نیست')
    }
    if (!urlPattern.test(val)) {
        errorsList.value.push('فرمت آدرس صحیح نیست (مثلاً https://example.com/phone/color)')
    }
    isFormat.value = errorsList.value.length === 0
})
watch(history, (newVal) => {
    localStorage.setItem('url-history', JSON.stringify(newVal))
}, { deep: true })
const generateUniqueShortCode = () => {
    let code = ''
    let exists = true
    while (exists) {
        code = Math.random().toString(36).slice(2, 8)
        exists = history.value.some(item => {
            return item.short.endsWith('/' + code)
        })
    }
    return code
}
const submitURL = async () => {
    isLoad.value = true
    const baseUrl = window.location.origin
    setTimeout(() => {
        let expiresAt = null
        const now = new Date()
        if (expire.value === '1h') {
            expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toString()
        } else if (expire.value === '1d') {
            expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toString()
        } else if (expire.value === '7d') {
            expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toString()
        }
        isLoad.value = false
        const generated = baseUrl + '/' + generateUniqueShortCode()
        shortUrl.value = generated
        history.value.push({
            id: Math.random() * 100000,
            original: url.value,
            short: generated,
            expireDay: expiresAt
        })
        recentLinks.value.push({
            id: Math.random() * 100000,
            original: url.value,
            short: generated,
            expireDay: expiresAt
        })
        isSuccess.value = true
        url.value = ''
        expire.value = 'never'
    }, 1000);
    setTimeout(() => {
        isSuccess.value = false
    }, 3000)
}
const copyToClipboard = (text) => {
    showToast.value = true
    setTimeout(() => {
        showToast.value = false
    }, 1000);
    navigator.clipboard.writeText(text)
}
</script>