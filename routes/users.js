const {User}=require('../models/user')
const express=require('express')
const route=express.Router()
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

route.get('/',async(req,res)=>{
    const userlist=await User.find().select('-passwordHash')

    if(!userlist){
        return res.status(500).json({success:false})

    }
    res.status(200).json(userlist)
})

route.get('/:id',async(req,res)=>{
    const user=await User.findById(req.params.id).select('-passwordHash')

    if(!user){
        res.status(500).json({message:' the user with the igven id was not found'},)
    }

res.status(200).json({success:" found the user",data:user})
})

route.post('/',async(req,res)=>{
    console.log(req.body)
  passwordHash=bcrypt.hashSync(req.body.password,10)
  console.log( passwordHash)
  const data={...req.body,passwordHash}
    const user= await User.create(data)

    if(!user){
        return res.status(404).send('user dont created')
    }

    res.status(200).json({success:true,user})

})

route.post('/login',async(req,res)=>{
const user=await User.findOne({email:req.body.email})
console.log(user)

if(!user){
    return res.status(400).send('the user not found')

}

if(user&&bcrypt.compareSync(req.body.password,user.passwordHash))
{
    const token=jwt.sign({
        userId:user.id,
        isAdmin:user.isAdmin
    
    },
    `${process.env.SECRET}`
    ,
    {
        expiresIn:'1d'
    }
    )
    res.status(200).send({user:user.email,token})
}else{

    res.status(200).send('passwor is wrong')
}


})

route.get('/get/count',async(req,res)=>{
    const userCount=await User.countDocuments({})
    console.log(userCount)
    if(!userCount){
        return res.status(404).json({success:false});
    }

res.status(200).json({success:" found the category",count:userCount})
})


route.delete('/:id',(req,res)=>{
 
        
        User.findByIdAndRemove(req.params.id).then((doc=>{
            if(doc){
                return res.status(200).json({success:true,message:'user  is deleted'});
            }else{
                return res.status(404).json({success:false,message:'user not found'});
            }
        })).catch(err=>{
            return res.status(400).json({success:false,err:err});
        })
   



})


module.exports=route