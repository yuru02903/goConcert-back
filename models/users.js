import { Schema, model, Error } from 'mongoose'
import validator from 'validator'
// bcrypt => 密碼雜湊函數，使用一個加鹽的流程加密密碼
import bcrypt from 'bcrypt'
import UserRole from '../enums/UserRole.js'
import {
  isNationalIdentificationNumberValid // 身分證字號
  // isEInvoiceCellPhoneBarcodeValid, // 手機條碼
  // isCreditCardNumberValid // 信用卡
} from 'taiwan-id-validator'

const schema = new Schema({
  account: {
    type: String,
    required: [true, '缺少使用者帳號'],
    minlength: [4, '使用者帳號長度不符'],
    maxlength: [20, '使用者帳號長度不符'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isAlphanumeric(value)
      },
      message: '使用者帳號格式錯誤'
    }
  },
  nationalIdNumber: {
    type: String,
    required: [true, '缺少使用者身分證'],
    unique: true,
    validate: {
      validator (value) {
        return isNationalIdentificationNumberValid(value)
      },
      message: '使用者身分證格式錯誤'
    }
  },
  email: {
    type: String,
    required: [true, '缺少使用者信箱'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: '使用者信箱格式錯誤'
    }
  },
  password: {
    type: String,
    required: [true, '缺少使用者密碼']
  },
  tokens: {
    type: [String]
  },
  role: {
    type: Number,
    default: UserRole.USER
  }
}, {
  // 紀錄資料建立日期及最後更新日期
  timestamps: true,
  // 關掉__v => 不儲存資料更改次數
  versionKey: false
})

// schema.pre('save', function () {} => 讓 schema 在 save 前先執行 function
// 不能用箭頭函式，因為會使用到this，箭頭函式沒有this
schema.pre('save', function (next) {
  const user = this
  // 如果 user 的 password 有修改 = true，則執行{}
  if (user.isModified('password')) {
    // 先驗證修改後的密碼長度再加密(加密後密碼長度會改變)
    // 如果密碼長度 <8 或 >20，回傳驗證錯誤
    if (user.password.length < 8 || user.password.length > 20) {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度不符' }))
      next(error)
      return
    } else {
      // 8 < 密碼長度 < 20，可進行加密
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  // 完成後進行下一步，如果沒寫這個會停在這裡
  next()
})

export default model('users', schema)
