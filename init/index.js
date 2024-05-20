const mongoose=require('mongoose')
const initdata=require('./data.js')
const listing=require('../models/listing.js')

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust")
}

main().then(()=>{
    console.log("conected to db")
})
.catch((err)=>{
    console.log(err)
})

const initDB=async()=>{
    await listing.deleteMany({})
    initdata.data=initdata.data.map((obj)=>({...obj,owner:'6645ae344f2bb946f4e9d6c7'}))
    await listing.insertMany(initdata.data)
    console.log("data was initialised")
}
initDB();