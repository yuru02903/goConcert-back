import { Schema, model, ObjectId } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '缺少演唱會名稱']
  },
  date: {
    type: String,
    required: [true, '缺少演唱會日期']
  },
  performer: {
    type: String,
    required: [true, '缺少表演者名稱']
  },
  originalPrice: {
    type: Number,
    required: [true, '缺少票券原價']
  },
  price: {
    type: Number,
    required: [true, '缺少票券售價']
  },
  // seat: {

  // },
  seller: {
    type: ObjectId,
    ref: 'users',
    required: [true, '缺少賣家']
  },
  // category_country: {
  //   type: ObjectId,
  //   ref: 'category_country',
  //   required: [true, '請選擇表演者國籍']
  // },
  categoryCountry: {
    type: String,
    required: [true, '缺少表演者國籍'],
    enum: {
      values: ['台灣', '韓國', '日本', '歐美', '泰國', '其他'],
      message: '表演者國籍有誤'
    }
  },
  categoryGroup: {
    type: String,
    required: [true, '缺少表演者性質'],
    enum: {
      values: ['團體', '個人'],
      message: '表演者性質有誤'
    }
  },
  description: {
    type: String
  },
  sell: {
    type: Boolean,
    required: [true, '缺少票券上架狀態']
  }
},
{
  timestamps: true,
  versionKey: false
})

export default model('tickets', schema)
