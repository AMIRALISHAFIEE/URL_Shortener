<template>
    <div class="flex flex-col p-4 items-center md:mx-0 mx-3 bg-white md:w-1/3 w-full shadow rounded-2xl h-96">
        <searchInput v-model="search" dir="rtl" placeholder="جستجو..." />
        <div
            class="w-full overflow-y-auto scrollbar scrollbar-thumb-blue-500 scrollbar-track-gray-200 mt-3 flex flex-col gap-2">
            <div v-if="isLoad" class="w-full text-center text-gray-500 mt-4">
                <p class="mb-2">در حال بارگذاری ...</p>
            </div>
            <template v-else>
                <div dir="ltr" v-for="item in filteredHistory" :key="item.id"
                    class="w-full rounded-xl bg-gray-300 flex items-center justify-between shadow py-2 px-4">
                    <item v-if="!item.isDeleting" :item="item" @deleteItem="deleteLink" />
                    <div v-else
                        class="flex w-full items-center justify-between text-xs text-gray-700 font-medium font-sans">
                        <button @click="undoDelete(item.id)"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-lg transition-all shadow-sm">
                            بازگردانی (Undo)
                        </button>
                        <span class="text-right" dir="rtl">حذف تا 5 ثانیه دیگر...</span>
                    </div>
                </div>
                <p v-if="!filteredHistory.length" class="text-center text-gray-500 mt-4"> چیزی پیدا نشد </p>
            </template>
            
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue"
import searchInput from '../components/inputs/input.vue'
import loadingAnimation from "../components/loadingAnimation.vue"
import item from '../components/item.vue'

const history = ref([])
const activeTimers = ref({})
const search = ref('')
const isLoad = ref(false)

onMounted(() => {
    isLoad.value = true
    setTimeout(() => {
        const saved = localStorage.getItem('url-history')
        if (saved) {
            const parsedData = JSON.parse(saved)
            history.value = parsedData.map(item => ({ ...item, isDeleting: false }))
        }
        isLoad.value = false
    }, 1500)
})

const filteredHistory = computed(() => {
    if (!search.value) {
        return history.value
    } 
    return history.value.filter(item =>
        item.original?.toLowerCase().includes(search.value.toLowerCase()) ||
        item.short?.toLowerCase().includes(search.value.toLowerCase())
    )
})

const deleteLink = (id) => {
    const targetItem = history.value.find(link => link.id === id)
    if (targetItem) {
        targetItem.isDeleting = true
    }

    activeTimers.value[id] = setTimeout(() => {
        const updatedHistory = history.value.filter(link => link.id !== id)
        history.value = updatedHistory
        localStorage.setItem('url-history', JSON.stringify(updatedHistory))
        delete activeTimers.value[id]
    }, 5000)
}

const undoDelete = (id) => {
    if (activeTimers.value[id]) {
        clearTimeout(activeTimers.value[id])
        delete activeTimers.value[id]
    }
    const targetItem = history.value.find(link => link.id === id)
    if (targetItem) {
        targetItem.isDeleting = false
    }
}
</script>