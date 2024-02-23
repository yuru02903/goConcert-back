// 套件，負責處裡fontdata的資料型態及附帶檔案
import multer from 'multer'
// 雲端平台套件
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { StatusCodes } from 'http-status-codes'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

// multer({ 上傳設定 })
const upload = multer({
  storage: new CloudinaryStorage({ cloudinary }),
  // (req, file, callback) =>(請求資訊, 上傳檔案資訊, 判斷是否允許)
  fileFilter (req, file, callback) {
    // 陣列內是否包含上傳檔案的類型
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      // callback(錯誤訊息, 是否允許)
      callback(null, true)
    } else {
      // LIMIT_FILE_FORMAT => 自訂的錯誤代碼
      callback(new multer.MulterError('LIMIT_FILE_FORMAT'), false)
    }
  },
  limits: {
    // 限制檔案大小
    fileSize: 1024 * 1024
  }
})

export default (req, res, next) => {
  upload.array('image')(req, res, error => {
    // A instanceof B => 判斷A是否為B屬性/class
    if (error instanceof multer.MulterError) {
      let message = '上傳錯誤'
      if (error.code === 'LIMIT_FILE_SIZE') {
        message = '檔案太大'
      } else if (error.code === 'LIMIT_FILE_FORMAT') {
        message = '檔案格式錯誤'
      }
      res.status(StatusCodes.BAD_REQUEST).json({
        sucess: false,
        message
      })
    } else if (error) {
      console.log(error)
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: '未知錯誤'
      })
    } else {
      next()
    }
  })
}
