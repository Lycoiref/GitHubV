import csv from 'csv-parser'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* repos.csv
* @param {string} language 语言名称
* @param {string} num_repos 数量
*/

/* issues.csv
* @param {string} name 语言名称
* @param {string} year 年份
* @param {string} quarter 季度
* @param {string} count 数量
*/

/* prs.csv
* @param {string} name 语言名称
* @param {string} year 年份
* @param {string} quarter 季度
* @param {string} count 数量
*/

const getIssues = async () => {
    const results = []
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '../data/github/issues.csv'))
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                // console.log(results)
                resolve(results)
            })
    })
}

const getPrs = async () => {
    const results = []
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '../data/github/prs.csv'))
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results)
            })
    })
}

const getRepos = async () => {
    const results = []
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '../data/github/repos.csv'))
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results)
            })
    })
}

const getAllLanguages = async () => {
    const repos = await getRepos()
    const languages = repos.map(repo => repo.language)
    languages.sort()
    return Array.from(new Set(languages))
}

export const getTop10LanguagesByRepos = async () => {
    const repos = await getRepos()
    const languages = Array.from(new Set(repos))
    languages.sort((a, b) => b.num_repos - a.num_repos)
    // 将第二三个元素去除
    repos.splice(1, 2)
    return repos.slice(0, 10)
}

export const getTop10LanguagesByIssues = async (year, quarter) => {
    const issues = await getIssues()
    const issuesThisQuarter = issues.filter(issue => issue.year === year && issue.quarter === quarter)
    const languages = Array.from(new Set(issuesThisQuarter))
    languages.sort((a, b) => b.count - a.count)
    return languages.slice(0, 10)
}

export const getTop10LanguagesByPrs = async (year, quarter) => {
    const prs = await getPrs()
    const prsThisQuarter = prs.filter(pr => pr.year === year && pr.quarter === quarter)
    const languages = Array.from(new Set(prsThisQuarter))
    languages.sort((a, b) => b.count - a.count)
    return languages.slice(0, 10)
}

export const getLanguageIssuesLine = async (language) => {
    const issues = await getIssues()
    console.log(language);
    const issuesThisLanguage = issues.filter(issue => issue.name === language)
    return issuesThisLanguage
}

export const getLanguagePrsLine = async (language) => {
    const prs = await getPrs()
    const prsThisLanguage = prs.filter(pr => pr.name === language)
    return prsThisLanguage
}

export { getIssues, getPrs, getRepos, getAllLanguages }
