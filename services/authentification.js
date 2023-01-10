require('dotenv').config();
const jwt=require('jsonwebtoken');

// when ever any api hit were gonna check that if the token exist
//in the header or not 
// if it is null were going to return over here that token is not signed
// by the particular access token
//in that case were also goinig to return with the status not found
//and if everything goes well like the token is created by us in that case we are
//going to allow them to move forward from next

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token= authHeader && authHeader.split(' ')[1]
    if(token == null)
    return res.sendStatus(401);

    jwt.verify(token,process.env.ACCESS_TOKEN,(err,response)=>{
        if(err){
            return res.sendStatus(403).json(err);
            
        
        }
        res.locals = response;
        next();
    })
}
module.exports = { authenticateToken: authenticateToken}