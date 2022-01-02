const mongoose = require("mongoose");
require('dotenv').config();
const DB = process.env.DB;
mongoose.connect(DB ,{
    // these options are now depreciated. I think these will throw errors when tested,
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(() => {
    console.log(`connection successfull`);
}).catch((e) => {
    console.log(`connection unsuccessfull`);
})