<template>
    <label v-if="props.label" class="block mb-2 mt-4 text-sm font-medium text-gray-700">
        {{ props.label }}
    </label>

    <input :dir="dir" type="text" :placeholder="props.placeholder" v-model="model"
        :class="isFormat ? 'focus:ring-blue-500' : 'focus:ring-red-500'"
        class="w-full px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-blue-500 focus:ring-2 mb-4" />
</template>
<script setup>
const props = defineProps({
    label: {
        type: String,
        default: ''
    },
    dir: {
        type: String,
        default: 'ltr'
    },
    placeholder: {
        type: String,
        required: true
    },
    isFormat: {
        type: Boolean,
        default: true
    }
})
const model = defineModel()
</script>