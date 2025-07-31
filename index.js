import express from 'express'
import { hello } from './Hello.js'
import Lab5 from './Lab5/index.js'
const app = express()
hello(app)
Lab5(app)
app.listen(process.env.PORT || 4000)