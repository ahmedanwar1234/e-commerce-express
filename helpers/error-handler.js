

function errorHandler(err,req,res,next){
    if(err.name=='UnauthorizedError'){
        res.status(500).json({message:'the user is not authorized'})
 
    }   

    if(err.name==='ValidationError'){
     return   res.status(500).json({message:err})

    }

    return res.status(500).json({err,errr:"errrrrr"})
}

module.exports=errorHandler