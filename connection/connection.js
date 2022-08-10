const {MongoClient} = require('mongodb')
const mongodb=require('mongodb').MongoClient
const state={
    db:null
}

module.exports.connect=(done)=>{
    const url='mongodb://localhost:27017'
    const dbname='youdo'
 
    mongodb.connect(url,function(err,data){
        if(err) throw err;
        state.db=data.db(dbname)
        done()
    })
}

module.exports.get=()=>{
    return state.db
}
