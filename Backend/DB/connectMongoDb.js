import mongoose from "mongoose"

export const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.log('Error in db connection:', error.message)
    process.exit(1)
  }
}
