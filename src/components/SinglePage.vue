<template>
    <div class="single">
        <div class="line top-line">
            <div class="block-left">
                <div id="issues-chart"></div>
            </div>
            <div class="block-right">
                <div class="block">
                    <div class="year">
                        <div class="title">选择年份：</div>
                        <div class="value">{{ currentYear }}</div>
                    </div>
                </div>
                <div class="block">
                    <div class="data">
                        <div class="title">Issues</div>
                        <div class="value">{{ issuesValue }}</div>
                    </div>
                </div>
                <div class="block">
                    <div class="data">
                        <div class="title">PRs</div>
                        <div class="value">{{ prsValue }}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="line bottom-line">
            <div class="block-left">
                <div id="prs-chart"></div>
            </div>
            <div class="block-right"></div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import * as echarts from 'echarts'
import { ref, onMounted, onBeforeUnmount } from 'vue'

let year = [...Array(10).keys()].map((i) => String(i + 2012))
let issuesValue = ref(0)
let prsValue = ref(0)
let currentYear = ref('-')

onMounted(async () => {
    let res = await axios.get('http://127.0.0.1:3000/api/issues')
    const issues = res.data
    const issuesChart = echarts.init(document.getElementById('issues-chart'))
    const prsChart = echarts.init(document.getElementById('prs-chart'))
    // year: 2012 -> 2021
    res = await axios.get('http://127.0.0.1:3000/api/repos/top10')
    const top10 = res.data
    const seriesList = []
    let languages = top10.map((repos) => repos.language)
    let languageData = []
    await new Promise((resolve) => {

        languages.forEach(async (language) => {
            let languageQuarterLine = await axios.get(`http://127.0.0.1:3000/api/issues/line`, {
                params: {
                    language,
                },
            })
            languageData[language] = []
            for (let y of year) {
                languageData[language][y] = 0
                languageQuarterLine.data.forEach((item) => {
                    // console.log(item.year === String(y))
                    if (item.year === String(y)) {
                        languageData[language][y] += Number(item.count)
                    }
                })
            }
            // console.log(languageData[language].slice(2012, 2022))
            seriesList.push({
                type: 'line',
                smooth: true,
                name: language,
                data: languageData[language].slice(2012, 2022),
                emphasis: {
                    focus: 'series',
                },
            })
            if (seriesList.length === languages.length) {
                resolve()
            }
        })
    })
    console.log(seriesList)
    issuesChart.setOption({
        // animation: true,
        legend: {
            data: languages,
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
        },
        tooltip: {
            order: 'valueDesc',
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
        },
        xAxis: {
            name: 'Year',
            type: 'category',
            data: year,
        },
        yAxis: {
            name: 'Repo',
            type: 'value',
        },
        grid: {
            containLabel: true,
        },
        series: seriesList,
    })

    await updatePRChart('JavaScript', prsChart)

    issuesChart.on('click', async (params) => {
        let language = params.seriesName
        currentYear.value = params.name
        issuesValue.value = params.value
        prsValue.value = await updatePRChart(language, prsChart)
    })
})

const updatePRChart = async (language, prsChart) => {
    let res = await axios.get(`http://127.0.0.1:3000/api/prs/line`, {
        params: {
            language,
        },
    })
    let languageQuarterLine = res.data
    let prsData = []
    for (let y of year) {
        prsData[y] = 0
        languageQuarterLine.forEach((item) => {
            // console.log(item.year === String(y))
            if (item.year === String(y)) {
                prsData[y] += Number(item.count)
            }
        })
    }
    prsChart.setOption({
        // animation: true,
        legend: {
            data: [language],
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
        },
        tooltip: {
            order: 'valueDesc',
            trigger: 'axis',
            axisPointer: {
                type: 'shadow',
            },
        },
        xAxis: {
            name: 'Year',
            type: 'category',
            data: year,
        },
        yAxis: {
            name: 'Repo',
            type: 'value',
        },
        grid: {
            containLabel: true,
        },
        series: [
            {
                type: 'line',
                smooth: true,
                name: language,
                data: prsData.slice(2012, 2022),
                emphasis: {
                    focus: 'series',
                },
            },
        ],
    })
    return prsData[currentYear.value]
}

onBeforeUnmount(() => {
    echarts.dispose(document.getElementById('issues-chart'))
    echarts.dispose(document.getElementById('prs-chart'))
})
</script>

<style scoped lang='less'>
.single {
    width: 100%;
    height: calc(~'100vh - 50px');

    .line {
        width: 100%;
        display: flex;

        &.top-line {
            height: 70%;

            .block-left {
                width: 70%;
                height: 100%;

                #issues-chart {
                    width: 100%;
                    height: 100%;
                }
            }

            .block-right {
                width: 30%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                font-size: 40px;

                .block {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .title {
                        display: flex;
                        justify-content: center;
                    }

                    .value {
                        display: flex;
                        justify-content: center;
                    }
                }
            }
        }

        &.bottom-line {
            height: 30%;

            .block-left {
                width: 70%;
                height: 100%;

                #prs-chart {
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }
}
</style>
