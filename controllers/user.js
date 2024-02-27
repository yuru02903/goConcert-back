import users from '../models/users.js'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

// 註冊
export const create = async (req, res) => {
  try {
    // 建立使用者 => 將請求來源內容依schema建立資料
    await users.create(req.body)
    // 成功通知
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message
      })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      // 11000 => 資料重複的錯誤代碼
      res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: '該帳號已被註冊'
      })
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    }
  }
}

// 登入 (給予 token 並回傳該使用者的相關資訊)
export const login = async (req, res) => {
  try {
    // jwt.sign(保存對象的id, 密鑰, 保存期限)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    // req.user 為 middlewares 的 auth.js 在驗證完登入帳號後代入的 user 資訊
    req.user.tokens.push(token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      // 回覆該使用者可能會使用的資訊
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// 登出 (清除請求來源的token)
export const logout = async (req, res) => {
  try {
    // 過濾出這次請求token以外的tokens後儲存 = 刪掉請求token
    req.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: ''
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

// token舊換新
export const extend = async (req, res) => {
  try {
    // 取得這次請求的id
    const idx = req.user.tokens.findIndex(token => token === req.token)
    // 設定新的token
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '1 days' })
    // 替換token
    req.user.tokens[idx] = token
    // 儲存新的 token，完成舊換新
    await req.user.save()
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: token
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}

export const getProfile = (req, res) => {
  try {
    res.status(StatusCodes.OK).json({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        email: req.user.email,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: '未知錯誤'
    })
  }
}
