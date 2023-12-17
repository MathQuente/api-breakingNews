const mongoose = require('mongoose')

const connectDataBase = () => {
  console.log('waiting connection to the database')

  mongoose.connect(
    'mongodb+srv://MathQuente:root@cluster0.igb6ckh.mongodb.net/?retryWrites=true&w=majority'
  ).then(() => console.log('MongoDB Atlas connected')).catch((error) => console.log(error))
}

module.exports = connectDataBase
