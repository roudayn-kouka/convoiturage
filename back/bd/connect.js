const mongoose = require("mongoose")
const Connect = (url)=>{
   return mongoose.connect(url)
}
module.exports = Connect