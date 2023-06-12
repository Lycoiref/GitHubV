<template>
    <div class="global">
        <div class="line top">
            <div class="block">
                <div class="title">当前年份:{{ year }}</div>
                <div class="value">目前展示的数据对应的年份</div>
            </div>
            <div class="block">
                <div class="title">当前季度：{{ quarter }}</div>
                <div class="value">目前展示的数据对应的年份</div>
            </div>
            <div class="block">
                <div class="title">Top Issues: {{ topLanguageByIssue }}</div>
                <div class="value">根据Issues排行选出的最受欢迎语言</div>
            </div>
            <div class="block">
                <div class="title">Top PRs: {{ topLanguageByPR }}</div>
                <div class="value">根据Pull Requests排行选出的最受欢迎语言</div>
            </div>
        </div>
        <div class="line bottom">
            <div class="block-left">
                <div id="repos-list"></div>
            </div>
            <div class="block-right">
                <div class="issues-list"></div>
                <div class="prs-list"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import axios from 'axios'
import * as echarts from 'echarts'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const year = ref(2011)
const quarter = ref(3)
const topLanguageByIssue = ref('JavaScript')
const topLanguageByPR = ref('JavaScript')
let reposChart, issuesChart, prsChart, timer

const changeyear = async () => {
    year.value += 1
    quarter.value = 1
    if (year.value === 2022) {
        year.value = 2011
    }
    await updateCharts()
}

onMounted(async () => {
    let res = await axios.get('http://127.0.0.1:3000/api/repos')
    const repos = res.data
    console.log(repos)
    reposChart = echarts.init(document.getElementById('repos-list'))
    const languages = repos.map(item => item.language)
    const num_repos = repos.map(item => item.num_repos)
    // 为每种语言随机生成一个颜色
    let languageColorList = []
    languages.map(item => {
        languageColorList[item] = '#' + Math.floor(Math.random() * 16777215).toString(16)
    })

    reposChart.setOption({
        title: {
            text: '按照GitHub仓库数量(2022)排序的语言排行榜',
            left: 300,
            textStyle: {
                fontSize: 14,
                fontFamily: 'beauty-en',
                // color: '#FFF9DE'
            },
        },
        toolbox: {
            feature: {
                dataZoom: {
                    yAxisIndex: false
                },
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            bottom: 90
        },
        dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 3
            },
            {
                type: 'slider',
                start: 0,
                end: 3
            }
        ],
        xAxis: {
            data: languages,
            silent: false,
            splitLine: {
                show: false
            },
            splitArea: {
                show: false
            },
            axisLabel: {
                interval: 0,
                rotate: 45
            }
        },
        yAxis: {
            splitArea: {
                show: false
            }
        },
        series: [
            {
                type: 'bar',
                data: num_repos,
                // Set `large` for large data amount
                large: true,
                itemStyle: {
                    color: function (param) {
                        return languageColorList[param.name]
                    }
                }
            }
        ]
    })

    res = await axios.get(`http://127.0.0.1:3000/api/issues/top10?year=${year.value}&quarter=${quarter.value}`)
    const issues = res.data
    console.log(issues)
    issuesChart = echarts.init(document.querySelector('.issues-list'))
    const issues_languages = issues.map(item => item.name)
    const issues_num = issues.map(item => item.count)
    topLanguageByIssue.value = issues_languages[0]

    issuesChart.setOption({
        xAxis: {
            max: 'dataMax'
        },
        yAxis: {
            type: 'category',
            data: issues_languages,
            inverse: true,
            animationDuration: 300,
            animationDurationUpdate: 300,
            max: 4 // only the largest 3 bars will be displayed
        },
        series: [
            {
                realtimeSort: true,
                colorBy: 'data',
                type: 'bar',
                data: issues_num,
                label: {
                    show: true,
                    position: 'right',
                    valueAnimation: true
                },
                itemStyle: {
                    color: function (param) {
                        return languageColorList[param.name]
                    }
                }
            }
        ],
        legend: {
            show: true
        },
        animationDuration: 0,
        animationDurationUpdate: 1000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
    })

    res = await axios.get(`http://127.0.0.1:3000/api/prs/top10?year=${year.value}&quarter=${quarter.value}`)
    const prs = res.data
    console.log(prs)
    prsChart = echarts.init(document.querySelector('.prs-list'))
    const prs_languages = prs.map(item => item.name)
    const prs_num = prs.map(item => item.count)
    topLanguageByPR.value = prs_languages[0]

    prsChart.setOption({
        xAxis: {
            max: 'dataMax'
        },
        yAxis: {
            type: 'category',
            data: prs_languages,
            inverse: true,
            animationDuration: 300,
            animationDurationUpdate: 300,
            max: 4 // only the largest 3 bars will be displayed
        },
        series: [
            {
                realtimeSort: true,
                colorBy: 'data',
                type: 'bar',
                data: prs_num,
                label: {
                    show: true,
                    position: 'right',
                    valueAnimation: true
                },
                itemStyle: {
                    color: function (params) {
                        // build a color map as your need.
                        const colorList = languageColorList
                        return colorList[params.name]
                    }
                }
            }
        ],
        legend: {
            show: true
        },
        animationDuration: 0,
        animationDurationUpdate: 1000,
        animationEasing: 'linear',
        animationEasingUpdate: 'linear'
    })

    timer = setInterval(async () => {
        await changeQuarter()
    }, 1500)
})

const changeQuarter = async () => {
    quarter.value += 1
    if (quarter.value === 5) {
        quarter.value = 1
        year.value += 1
        if (year.value === 2022) {
            year.value = 2011
            quarter.value = 3
        }
    }
    await updateCharts()
}

const updateCharts = async () => {
    let res = await axios.get(`http://127.0.0.1:3000/api/issues/top10?year=${year.value}&quarter=${quarter.value}`)
    const issues = res.data
    console.log(issues)
    const issues_languages = issues.map(item => item.name)
    const issues_num = issues.map(item => item.count)
    topLanguageByIssue.value = issues_languages[0]

    issuesChart.setOption({
        yAxis: {
            type: 'category',
            data: issues_languages,
        },
        series: [
            {
                type: 'bar',
                data: issues_num,
            }
        ],
    })

    res = await axios.get(`http://127.0.0.1:3000/api/prs/top10?year=${year.value}&quarter=${quarter.value}`)
    const prs = res.data
    console.log(prs)
    const prs_languages = prs.map(item => item.name)
    const prs_num = prs.map(item => item.count)
    topLanguageByPR.value = prs_languages[0]

    prsChart.setOption({
        yAxis: {
            type: 'category',
            data: prs_languages,
        },
        series: [
            {
                type: 'bar',
                data: prs_num,
            }
        ],
    })
}

onBeforeUnmount(() => {
    reposChart.dispose()
    issuesChart.dispose()
    prsChart.dispose()
    clearInterval(timer)
})
</script>

<style scoped lang='less'>
.global {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    font-family: 'beauty-en';

    #repos-list {
        width: 100%;
        height: 100%;
    }

    .line {
        width: 100%;
        display: flex;

        &.top {
            width: 90%;
            height: 20vh;
            // background-color: #000;
            justify-content: space-around;
            align-items: center;

            .block {
                margin: 20px;
                flex: 1;
                border-radius: 15px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                // border: 1px solid #000;
                height: 80%;
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;

                .title {
                    font-size: 20px;
                    font-weight: bold;
                    text-align: center;
                    margin: 10px;
                }

                .value {
                    font-size: 15px;
                    text-align: center;
                    margin: 10px;
                }

                cursor: pointer;
                transition: all 0.2s;

                &:hover {
                    box-shadow: 0 0 10px rgba(0, 0, 0, 1);
                    scale: 1.05;
                }
            }
        }

        &.bottom {
            height: calc(~'70vh - 50px');
            width: 100%;
            display: flex;
            justify-content: space-around;
            align-items: center;

            .block-left {
                width: 70%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .block-right {
                width: 50%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;

                .issues-list {
                    width: 100%;
                    height: 50%;
                }

                .prs-list {
                    width: 100%;
                    height: 50%;
                }
            }
        }
    }
}
</style>
