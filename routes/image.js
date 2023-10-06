const express=require('express')
const route=express.Router()
const multer=require('multer')
const path =require('path')

const fileStorageEngine=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname))
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"--"+file.originalname)

    }
})
console.log(__dirname,'../public')

const upload=multer({storage:fileStorageEngine})
route.post('/photo',upload.single('image'),(req,res)=>{
console.log(req.file)
    
    res.send('single file upload success')
})

module.exports=route