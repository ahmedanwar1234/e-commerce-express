const {expressjwt:jwt}=require('express-jwt')

function authJwt(){
    const secret=process.env.SECRET
    return jwt({
        secret,
        algorithms:['HS256'],
        isRevoked:isRevoked
    }).unless({
        path:[
            {url:/\/public\/(.*)/,method:['GET','OPTIONS']},
            {url:/\/routes\/(.*)/,method:['GET','OPTIONS']},

            {url:/\/api\/v1\/products(.*)/,method:['GET','OPTIONS']},
            {url:/\/api\/v1\/categories(.*)/,method:['GET','OPTIONS']},
            '/api/v1/users/login',
            '/api/v1/users/register',
        ]
    })
}

async function isRevoked(req, token){
   return !token.payload.isAdmin
  
  }


module.exports=authJwt