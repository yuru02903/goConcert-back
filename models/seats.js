import { Schema, model } from 'mongoose'

const schema = new Schema({
  venue: {
    type: String,
    required: [true, '缺少場館名稱']
  },
  area: {
    type: String,
    required: [true, '缺少區域名稱']
  },
  row: {
    type: String,
    required: [true, '缺少排數']
  },
  seat: {
    type: String,
    required: [true, '缺少座號']
  }
},
{
  timestamps: true,
  versionKey: false
})

export default model('seats', schema)
