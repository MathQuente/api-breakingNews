import mongoose from'mongoose'
 

const connectDataBase = () => {
  console.log('waiting connection to the database')

  mongoose.connect( process.env.MONGODB_URI,
  ).then(() => console.log('MongoDB Atlas connected')).catch((error) => console.log(error))
}

export default connectDataBase
