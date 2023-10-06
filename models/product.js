const mongoose =require('mongoose')


const productSchema=mongoose.Schema({
    name:{type:String,required:[true,'must be name']},
   description:{
    type:String,
    required:true
   },
   richDescription:{
    type:String,
    default:''
   },
   image:{
    type:String,
    default:'',trim:false
   },
   images:[{type:String,}],
   brand:{
    type:String,
    default:''
   }
,
price:{
    type:String,
    required:true
},
category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'category',
    required:true
},
countInStock:{
    type:Number,
    required:true,
    min:0,
    max:255
},
ratring:{
    type:Number,
   default:0
},
numReviews:{
    type:Number,
default:0
},
ifFeatured:{
    type:Boolean,
    default:false
}
,
dateCreated:{
    type:Date,
    default:Date.now
}

})

productSchema.virtual('id').get(function(){
    return this._id.toHexString()
})

productSchema.virtual('namevirtual').get(function(){
    return  this.name
})


;
productSchema.set('toJSON',{
    virtuals:true
})

exports.Product=mongoose.model('product',productSchema)

