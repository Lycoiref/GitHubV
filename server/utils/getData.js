import csv from 'csv-parser'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'


const results = []
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const getIssues = async () => {
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
    for (let language of languages) {
        if (!language) {
            // 剔除空值
            languages.splice(languages.indexOf(language), 1)
        }
    }
    languages.sort()
    return Array.from(new Set(languages))
}

export { getIssues, getPrs, getRepos, getAllLanguages }
