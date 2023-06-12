import Koa from 'koa'
import Router from '@koa/router'
import cors from '@koa/cors'
import { getAllLanguages, getIssues, getTop10LanguagesByRepos, getRepos, getTop10LanguagesByIssues, getTop10LanguagesByPrs, getLanguageIssuesLine, getLanguagePrsLine } from './utils/getData.js'

const app = new Koa()
const router = new Router()

router.get('/', async (ctx, next) => {
    ctx.body = 'Hello World'
})

router.get('/api/languages', async (ctx, next) => {
    ctx.body = await getAllLanguages()
})

router.get('/api/repos', async (ctx, next) => {
    const repos = await getRepos()
    repos.sort((a, b) => b.num_repos - a.num_repos)
    ctx.body = repos
})

router.get('/api/issues', async (ctx, next) => {
    const issues = await getIssues()
    ctx.body = issues
})

router.get('/api/repos/top10', async (ctx, next) => {
    ctx.body = await getTop10LanguagesByRepos()
})

router.get('/api/issues/top10', async (ctx, next) => {
    const year = ctx.query.year
    const quarter = ctx.query.quarter
    ctx.body = await getTop10LanguagesByIssues(year, quarter)
})

router.get('/api/prs/top10', async (ctx, next) => {
    const year = ctx.query.year
    const quarter = ctx.query.quarter
    ctx.body = await getTop10LanguagesByPrs(year, quarter)
})

router.get('/api/issues/line', async (ctx, next) => {
    const language = ctx.query.language
    ctx.body = await getLanguageIssuesLine(language)
})

router.get('/api/prs/line', async (ctx, next) => {
    const language = ctx.query.language
    ctx.body = await getLanguagePrsLine(language)
})

app.use(cors())
app.use(router.routes())

app.listen(3000, async () => {
    let data = await getAllLanguages()
    console.log(data.length);
    console.log('Server running on port 3000')
})
