import { Schema, model } from 'mongoose'

const schema = new Schema({
  country: {
    type: String,
    required: [true, '缺少表演者國籍']
  }
},
{
  timestamps: true,
  versionKey: false
})

export default model('categoryCountry', schema)
