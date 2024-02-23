import { Schema, model, ObjectId } from 'mongoose'

const schema = new Schema({
  seat: {
    type: ObjectId,
    ref: 'seats',
    required: [true, '缺少座位']
  },
  images: {
    type: [String],
    required: [true, '缺少圖片']
  },
  provider: {
    type: ObjectId,
    ref: 'users',
    required: [true, '缺少提供者']
  }
},
{
  timestamps: true,
  versionKey: false
})

export default model('seatView', schema)
