<template>
    <label v-if="props.label" class="block mb-2 text-sm font-medium text-gray-700">
        {{ props.label }}
    </label>
    <select v-model="model" class="w-full p-3 mt-1 rounded-xl border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer">
        <option v-for="(item, index) in list" :key="index" :value="item.value">{{ item.name }}</option>
    </select>
</template>
<script setup>
const props = defineProps({
    list: {
        type: Array,
        required: true
    },
    label: {
        type: String,
        required: true
    }
})
const model = defineModel()
</script>