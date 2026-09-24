import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import router from './routes/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import { runMigrations } from './db/migrate.js'
import { runSeed } from './db/seed.js'

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/api', router)
app.use(errorHandler)

const start = async () => {
  await runMigrations()
  await runSeed()

  app.listen(port, () => {
    console.log(`API http://localhost:${port} adresinde çalışıyor.`)
  })
}

start().catch((error) => {
  console.error('Sunucu başlatılamadı:', error)
  process.exit(1)
})
