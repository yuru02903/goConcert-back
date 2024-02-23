import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
// cors 是否允許跨域請求，前端才能請求資料
import cors from 'cors'
import routeUsers from './routes/user.js'
import routeTickets from './routes/tickets.js'
import { StatusCodes } from 'http-status-codes'
import './passport/passport.js'

const app = express()

app.use(cors({
  // origin = 請求的來源
  // callback(錯誤, 是否允許)
  // 如果用 postman 測試，請求來源會是 undefined
  origin (origin, callback) {
    if (origin === undefined || origin.includes('github.io') || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('CORS'), false)
    }
  }
}))
app.use((_, req, res, next) => {
  res.status(StatusCodes.FORBIDDEN).json({
    success: false,
    message: '請求被拒絕'
  })
})

app.use(express.json())
app.use((_, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: '資料格式錯誤'
  })
})

app.use('/users', routeUsers)
app.use('/tickets', routeTickets)

// app.all => 任意請求方式
// * => 任意字元 == 任意路徑
app.all('*', (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: '找不到'
  })
})

// 雲端伺服器會將指定的 port 放在環境變數裡，沒指定就用4000
app.listen(process.env.PORT || 4000, async () => {
  console.log('伺服器啟動')
  await mongoose.connect(process.env.DB_URL)
  console.log('資料庫連線成功')
})
