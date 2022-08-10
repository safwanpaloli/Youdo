const async = require('hbs/lib/async')
const { response } = require('../app')
const bcrypt=require('bcrypt')
const  db=require('../connection/connection')
let objectid=require('mongodb').ObjectId

module.exports={
     addnotes:(title,notearea,userid)=>{
         
         allnotes=[
            {
                ntitle:title,
                notearea:notearea,
                userid: userid
            }
         ]
         return new Promise(async(resolve,reject)=>{
               await db.get().collection('notes').insertMany(allnotes).then((noteid)=>{
                resolve(noteid)      
            })
            
        })
    },
    getnotes:(userid1)=>{
        console.log(userid1)
         return new Promise(async(resolve,reject)=>{
            const  findData= await db.get().collection('notes').find({userid:userid1}).toArray()
            resolve(findData)
            })
     },
     deletenotes:(noteid)=>{
         return new Promise(async(resolve,reject)=>{
             const deletedata=await db.get().collection('notes').deleteOne({_id:objectid(noteid)})
             resolve(deletedata)
         })
     },
     updateNotes:(userid,data)=>{
        return new Promise(async(resolve,reject)=>{
            const updateData = await db.get().collection('notes').update({_id:objectid(userid)},{
                $set :
                     data
            })
            resolve(updateData)
        })
     }  
        ,
     usersignup:(userdata)=>{
         return new Promise(async(resolve,reject)=>{
             userdata.password=await bcrypt.hash(userdata.password,(10))
             const datas=await db.get().collection('users').insertOne(userdata)
             resolve(datas)
        })
     },
     getSpecificUser:(userid)=>{
         return new Promise(async(resolve,reject)=>{
            const getUserData=await db.get().collection('users').find({_id:objectid(userid)}).toArray()
            resolve(getUserData)
         })
     },
     loginUser:(loginData)=>{
          const response={}
          return new Promise(async(resolve,reject)=>{
              const validation=await db.get().collection('users').findOne({username:loginData.username})
                if(validation){
                  await bcrypt.compare(loginData.userpassword,validation.password).then((value)=>{
                        if(value){
                                response.status=true
                                response.username=validation
                                response.userid=validation._id
                                resolve(response)
                            }
                        else{
                                 resolve({status:false})
                                console.log("password not correct")
                        }
                    })
                }else{
                    resolve({status:false})
                     console.log("user not found")
                }
          })

     }
}
