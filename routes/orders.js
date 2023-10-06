const {Order}=require('../models/order')

const express=require('express')
const { OrderItem } = require('../models/oreder-item')
const route=express.Router()

route.get('/',async(req,res)=>{
    const orderList=await Order.find().populate('user','name').sort({'dateOrdered':-1})

    if(!orderList){
        return res.status(500).json({success:false})

    }
    res.status(200).json(orderList)
})

route.get('/:id',async(req,res)=>{
    const orderList=await Order.findById(req.params.id).populate('user','name').populate({path:'orderItems',populate:{path:'product',populate:'category'}})

    if(!orderList){
        return res.status(500).json({success:false})

    }
    res.status(200).json(orderList)
})

// =========>   CREATE
route.post('/',async(req,res)=>{
    const orderItemsIds=Promise.all(req.body.orderItems.map(async orderitem=>{
let newOrderItem =new OrderItem({quantity:orderitem.quantity,product:orderitem.product})

newOrderItem=await newOrderItem.save()
return newOrderItem.id
    })
    )
    
    const orderItemsIdsResolve= await orderItemsIds

const totalPrices=await Promise.all(orderItemsIdsResolve.map(async orderItemId=>{

    const orderItem=await OrderItem.findById(orderItemId).populate('product','price')
const tatalPrice=orderItem.product.price * orderItem.quantity

return tatalPrice
}))

const totalPrice=totalPrices.reduce((a,b)=>a+b,0)

    data={
        orderItems:orderItemsIdsResolve,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        status:req.body.status,
        totalPrice:totalPrice,
        user:req.body.user,
    }
    let order=await new Order(data).save()
 
// order=await order.save()

if(!order){
    return res.status(500).json({success:false,message:'dont created the order',err})
}
 res.send(order)
 })

 // =======>UPDATE

 route.put('/:id',async(req,res)=>{
    const orderUpdate= await Order.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true})
    if(!orderUpdate){ 
      return  res.status(404).send('not updated')
    }
    
    res.status(200).json({success:'success updated',orderUpdate})
    
    })

// ======> DELETE 
route.delete('/:id',(req,res)=>{
    
    Order.findByIdAndRemove(req.params.id,).then((async order=>{

        if(order){
            await order.orderItems.map(async orderItem=>{
                await OrderItem.findByIdAndRemove(orderItem) 
            })
            return res.status(200).json({success:true,message:'order is deleted'})
        }else{
            return res.status(404).json({success:false,message:'order not found'})
        }
    })).catch(err=>{
        return res.status(400).json({success:false,err:err})
    })



})

route.get('/get/totalsales',async(req,res)=>{

const totalSales=await Order.aggregate([
    {$group:{_id:null,totalsales:{$sum:'$totalPrice'}}}
])
if(!totalSales){
    return res.status(400).send('order salse cannot be generated')

}

res.send({totalsales:totalSales.pop().totalsales})
})



route.get('/get/count',async(req,res)=>{
    const orderCount=await Order.countDocuments({})
    console.log(orderCount)
    if(!orderCount){
        return res.status(404).json({success:false});
    }

res.status(200).json({success:" found the order",count:orderCount})
})


route.get('/userorders/:userid',async(req,res)=>{
    const userOrderList=await Order.find({user:req.params.userid}).populate('user','name').populate({path:'orderItems',populate:{path:'product',populate:'category'}}).sort({'dateOrdered':-1})

    if(!userOrderList){
        return res.status(500).json({success:false})

    }
    res.status(200).json(userOrderList)
})


module.exports=route