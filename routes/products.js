const express=require('express')
const route=express.Router()
const dotenv=require('dotenv')
const {Product}=require('../models/product')
const { Category } = require('../models/category')
const api=process.env.API_URL
const mongoose =require('mongoose')
const multer=require('multer')
const path =require('path')


const FILE_TYPE_MAP={
    'image/png':"png",
    'image/jpeg':"jpeg",
    'image/jpg':"jpg",

}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid=FILE_TYPE_MAP[file.mimetype]
        let UploadError=new Error('invalid image type')
        if(isValid){
            UploadError=null
        }
      cb(UploadError, path.join(__dirname,'../public'))
    },
    filename: function (req, file, cb) {
        
const fileName=file.originalname.split(' ').join('-')
const extension=FILE_TYPE_MAP[file.mimetype]

cb(null,Date.now()+"--"+file.originalname)
}
  })
  
  const uploadOptions = multer({ storage: storage })


route.get(`/`,async(req,res)=>{

    // .find().select('name) mean get only the name from the every product
// .select('name image -_id') get the name and image only from the doc and remove the _id

let filter={}
if(req.query.categories){
    filter={ category:req.query.categories.split(',')}
    const filterid=req.query.categories.split(',');
   
   
}


    const products= await Product.find(filter).populate('category')
    if(!products){
    return res.status(400).json({success:false});
    }
        res.send(products)
    }
    
    )


    route.get('/:id',async(req,res)=>{
        const product=await Product.findById(req.params.id).populate('category')
        if(!product){
            return res.status(404).json({success:false});
        }
    
    res.status(200).json({success:" found the category",data:product})
    })



    route.post(`/`,uploadOptions.single('image'),async(req,res)=>{
        console.log(req.file)

        const category= await Category.findById(req.body.category)
        console.log(category)
        if(!category){
            return  res.status(400).send('invalid category');
          }

const file =req.file

if(!file){
    return  res.status(400).send('invalid fileImage');
}

          const fileName=req.file.filename          
          const basePath=`${req.protocol}://${req.get('host')}/public/upload/`


    let product=new Product(
{
    name:req.body.name,
    description:req.body.description,
    richDescription:req.body.richDescription,
    image:`${basePath}${fileName}`,
    brand:req.body.brand,
    price:req.body.price,
    category:req.body.category,
    countInStock:req.body.countInStock,
    rating:req.body.rating,
    numReviews:req.body.numReviews,
    isFeatured:req.body.isFeatured,
}
    )
    
    product= await product.save()
if (!product){
    return res.status(500).send('the product cannot be created');
}    


  res.status(200).json({success:true,product})

}
)



route.put('/:id',async(req,res)=>{
 
if(!mongoose.isValidObjectId(req.params.id)){
 return   res.status(400).send('invalid categoy')
}

  if(req.body.category)
  {
   const category= await Category.findById(req.body.category)
      if(!category){
          return  res.status(400).send('invalid categoryyyy');
        }
    }


    const product= await Product.findByIdAndUpdate(req.params.id,req.body,{new:true}).populate('category')
    if(!product){ 
      return  res.status(500).send('the product cannot be updated');
    }
    
    res.status(200).json({success:'success updated', product})
    
    })

    route.delete('/:id',(req,res)=>{
        try{
            
            Product.findByIdAndRemove(req.params.id).then((doc=>{
                if(doc){
                    return res.status(200).json({success:true,message:'product  is deleted'});
                }else{
                    return res.status(404).json({success:false,message:'product not found'});
                }
            })).catch(err=>{
                return res.status(400).json({success:false,err:err});
            })
        }catch(err){
            console.log(err)
        }
    
    
    
    
    })




route.get('/get/count',async(req,res)=>{
        const productCount=await Product.countDocuments({})
        console.log(productCount)
        if(!productCount){
            return res.status(404).json({success:false});
        }
    
    res.status(200).json({success:" found the category",count:productCount})
})


route.get('/get/featured/:count',async(req,res)=>{
    const count=req.params.count ? req.params.count :0
        const products=await Product.find({ifFeatured:true}).limit(+count)
        console.log(products)
        if(!products){
            return res.status(404).json(' cannot get is Featured true in the products ');
        }
    
    res.status(200).send(products)

    })
    


    route.put('/galaryimages/:id',
    uploadOptions.array('images',10),
       async(req,res)=>{
        if(!mongoose.isValidObjectId(req.params.id)){
            return   res.status(400).send('invalid categoy')
           }
      const files=req.files
      let imagesPaths=[]
      const basePath=`${req.protocol}://${req.get('host')}/public/`

if(files){
    files.map(file=>{
        console.log(file)
        imagesPaths.push(`${basePath}${file.filename}`)
    })
   
}

           const product=await Product.findByIdAndUpdate(req.params.id,
            {
             images:imagesPaths
            },{new :true})


         if(!product){
            return res.status(500).send('the product cannsot be updated')
         }

         res.send(product)
            })

module.exports=route