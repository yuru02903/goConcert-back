import passport from 'passport'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import bcrypt from 'bcrypt'
import users from '../models/users.js'

// 建立一個叫 login 的驗證方式，是使用 passportLocal 的驗證策略(.Strategy)
passport.use('login', new passportLocal.Strategy({
  // 設定傳進來的資料的 username & password 欄位
  usernameField: 'email',
  passwordField: 'password'

  // 驗證方式(參數)=>{function}
}, async (email, password, done) => {
  try {
    // 用 login 的 email 去資料庫查詢對應的 user 資料
    const user = await users.findOne({ email })

    // 如果該 email 沒有對應的 user
    if (!user) {
      throw new Error('EMAIL')
    }
    // 如果該 email 有帳號，但 password 不符
    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error('PASSWORD')
    }
    // return 查詢到的 user 資料，放在 done 第二個參數
    return done(null, user, null)
  } catch (error) {
    // 錯誤為 => email 沒有對應的 user
    if (error.message === 'EMAIL') {
      return done(null, null, { message: '帳號不存在或email有誤' })

    // 錯誤為 => 該 email 有帳號，但 password 不符
    } else if (error.message === 'PASSWORD') {
      return done(null, null, { message: '密碼錯誤' })

      // 其他錯誤
    } else {
      return done(null, null, { message: '未知錯誤' })
    }
  }
}))
// 上述驗證方式在 middlewares 的 auth.js 被呼叫，執行後將 user 資料代進該呼叫 function 的 (error, 'user', info)

// JWT驗證，驗證通過才能使用拜訪特定路徑
// 建立一個叫 jwt 的驗證方式，是使用 passportJWT 的驗證策略(.Strategy)
passport.use('jwt', new passportJWT.Strategy({
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,

  // 驗證方式需要用到req內容，所以要將req資料pass下去
  passReqToCallback: true,

  // 略過JWT驗證策略的過期檢查，後續另外自訂檢查方式讓特定請求路徑通過
  ignoreExpiration: true

  // req = 請求資訊；payload = token解譯出的資料(token在middlewares-auth.js透過jwt.sign設定的內容，有設定效期(exp))
}, async (req, payload, done) => {
  try {
    // 檢查過期，若解譯出的資料的有效時間(日期) < 送出請求(登入)的時間
    // jwt (過期)時間單位是'秒'，node.js 日期單位是'毫秒'，故 *1000
    const expired = payload.exp * 1000 < new Date().getTime()

    /* 可取得的請求資訊之細項
    請求來源：http://localhost:4000/users/login?aaa=111&bbb=2
    req.originalUrl = /users/login?aaa=111&bbb=2
    req.baseUrl = /users
    req.path = /login
    req.query = { aaa: 111, bbb: 222 }
    */
    const url = req.baseUrl + req.path

    // 除了token舊換新&登出的路徑，若token過期則拋出error
    if (expired && url !== '/users/extend' && url !== '/users/logout') {
      throw new Error('EXPIRED')
    }

    // const token = req.headers.authorization.split('')，與下列式可通用
    const token = passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken()(req)
    const user = await users.findOne({ _id: payload._id, tokens: token })
    // 如果 token沒過期，但資料庫沒有具有該 token 的 user id
    if (!user) {
      throw new Error('JWT')
    }

    return done(null, { user, token }, null)
  } catch (error) {
    if (error.message === 'EXPIRED') {
      return done(null, null, { message: 'JWT 過期' })
    } else if (error.message === 'JWT') {
      return done(null, null, { message: 'JWT 無效' })
    } else {
      return done(null, null, { message: '未知錯誤' })
    }
  }
}))
