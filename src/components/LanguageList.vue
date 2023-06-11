<template>
    <div class="list">
        <h1>Language List(Totally {{ languages.length }} languages)</h1>
        <li class="language" v-for="language of languages">
            {{ language }}
        </li>
    </div>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'

const languages = ref([])

const res = await axios.get('http://127.0.0.1:3000/api/languages')
languages.value = res.data
</script>

<style scoped lang='less'>
.list {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;

    li {
        // 去除默认样式
        list-style: none;
    }
}
</style>
