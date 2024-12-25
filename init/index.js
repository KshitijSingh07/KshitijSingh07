const mongoose = require("mongoose");
const data = require("./data");
const listing = require("../models/listing");
const Mongodb_URL = 'mongodb://127.0.0.1:27017/Wanderlust';

main().then(() => {
    console.log("Database connection successful");
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect(Mongodb_URL);
}

const initdb = async ()=>{
    await listing.deleteMany({});
    // data.data.map((obj)=>{{...obj, owner:ObjectId("6766f5db225915156431d3e9")}});
    await listing.insertMany(data.data)
    .then(()=>{console.log(data.data)})
    .catch((err)=>{console.log(err)});
}
initdb();