<template>
    <div class="fixed top-5 right-5 bg-blue-400 text-white px-4 py-2 rounded-xl shadow-lg z-50">
        {{props.message}}
    </div>
</template>
<script setup>
const props = defineProps({
    message: {
        type: String,
        required: true
    }
})
</script>