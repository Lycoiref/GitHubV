<template>
    <div class="page">
        <div class="top-bar">
            <div class="item" :class="itemActive === 'global' ? 'item-active' : ''" @click="itemActive = 'global'">Global</div>
            <div class="item" :class="itemActive === 'single' ? 'item-active' : ''" @click="itemActive = 'single'">Single</div>
            <div class="item" :class="itemActive === 'list' ? 'item-active' : ''" @click="itemActive = 'list'">Language List</div>
        </div>
        <div v-if="itemActive === 'global'" class="body">

        </div>
        <div v-if="itemActive === 'single'" class="body">
            second
        </div>
        <div v-if="itemActive === 'list'" class="body">
            <Suspense>
                <LanguageList />
            </Suspense>
        </div>
    </div>
</template>

<script setup>
import LanguageList from './components/LanguageList.vue'
import axios from 'axios'
import { ref } from 'vue'

const itemActive = ref('global')


// const test = ref('')
// test.value = await axios.get('http://127.0.0.1:3000/')
// console.log(test.value);
</script>

<style scoped lang="less">
@import './assets/font/font.css';

.page {
    width: 100vw;
    height: 100vh;
    font-family: 'beauty-en';

    .top-bar {
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 100;
        color: #ccc;
        
        .item {
            margin: 0 20px;
            cursor: pointer;
            user-select: none;
            
            &.item-active {
                color: #ff3f3f;
            }
            transition: all 0.3s ease-in-out;
        }
    }
}
</style>
