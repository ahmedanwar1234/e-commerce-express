const {Category}=require('../models/category')

const express=require('express')
const route=express.Router()

route.get('/',async(req,res)=>{
    const categoryList=await Category.find()

    if(!categoryList){
        return res.status(500).json({success:false})

    }
    res.status(200).json(categoryList)


})

route.get('/:id',async(req,res)=>{
    const category=await Category.findById(req.params.id)

res.status(200).json({success:" found the category",data:category})
})

route.put('/:id',async(req,res)=>{
const categoryAbdate= await Category.findByIdAndUpdate(req.params.id,req.body,{new:true})
if(!categoryAbdate){ 
  return  res.status(404).send('not updated')
}

res.status(200).json({success:'success updated',categoryAbdate})

})

route.post('/',async(req,res)=>{
  
   let category=new Category({ 
    name:req.body.name,
    icon:req.body.icon,
    color:req.body.color
   })

   category.save().then((data)=>{
    res.status(200).send(data)
   }).catch(err=>res.status(200).json({success:'err',err}))

}).delete('/:id',(req,res)=>{
    
    Category.findByIdAndRemove(req.params.id).then((doc=>{
        if(doc){
            return res.status(200).json({success:true,message:'category is deleted'})
        }else{
            return res.status(404).json({success:false,message:'category not found'})
        }
    })).catch(err=>{
        return res.status(400).json({success:false,err:err})
    })



})

module.exports=route