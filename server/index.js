import Koa from 'koa'
import Router from '@koa/router'
import cors from '@koa/cors'
import { getAllLanguages, getIssues } from './utils/getData.js'

const app = new Koa()
const router = new Router()

router.get('/', async (ctx, next) => {
    ctx.body = 'Hello World'
})

router.get('/api/languages', async (ctx, next) => {
    ctx.body = await getAllLanguages()
})

app.use(cors())
app.use(router.routes())

app.listen(3000, async () => {
    let data = await getAllLanguages()
    console.log(data.length);
    console.log('Server running on port 3000')
})
