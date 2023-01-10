const express=  require('express');
const connection= require('../connections');
const router = express.Router();
 var auth=require('../services/authentification');

 router.get('/getDetails',auth.authenticateToken,(req,res,next)=>{
    var categoryCount;
    var ProductCount;
    var billCount;
    var query="select count(id) as categoryCount from category";
    connection.query(query,(err,results)=>{
        if(!err){
            categoryCount = results[0].categoryCount;
        }else{
            return res.status(500).json(err);
        }
    })
     var query="select count(id)  as ProductCount from product";
     connection.query(query,(err,results)=>{
        if(!err){
             ProductCount=results[0].ProductCount;
        }else{
            return res.status(500).json(err);
        }
     })
     var query="select count(id) as billCount from bill";
     connection.query(query,(err,results)=>{
            if(!err){
                 billCount=results[0].billCount;
                 var data = {
                    category:categoryCount,
                    product:ProductCount,
                    bill:billCount
                 };
                 return res.status(200).json(data)
            }else{
                return res.status(500).json(err);
            }
     })
 })


 module.exports = router;