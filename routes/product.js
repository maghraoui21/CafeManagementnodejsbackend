const express = require('express');

const connection=require ('../connections');
const router=express.Router();
var auth=require('../services/authentification');
var checkRole = require('../services/checkRole');

router.post('/addproduct',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let product = req.body;
    const query="insert into product (name,categoryId,description,price,status) values(?,?,?,?,'true')";
    connection.query(query,[product.name,product.categoryId,product.description,product.price],(err,resuls)=>{
        if(!err){
            return res.status(200).json({message:"Product Added Successfully"});
        }else{
            return res.status(500).json(err);
        }
    })
})

router.get('/getallproduct',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    const query="select p.id,p.name,p.description,p.price,p.status,c.id as categoryId,c.name as categoryName from product as p INNER JOIN category as c where p.categoryId = c.id";

    connection.query(query,(err,results)=>{
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})
//dispaly all the product connected to the category id
router.get('/getbycategory/:id',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    const id = req.params.id;
    const query = "select id,name from product where categoryId=? and status='true'";
    connection.query(query,[id],(err,results)=>{
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
 })

 router.get('/getbyid/:id',auth.authenticateToken,(req,res,next)=>{
    const id = req.params.id;
    const query="select id,name,description,status from product where id=?";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            return res.status(200).json(results[0]);
        }else{
            return res.status(500).json(err);
        }
    })
 })

 router.patch('/updateproduct',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let product=req.body;
    const query="update product set name=?,categoryId=?,description=?,price=? where id=?";
    connection.query(query,[product.name,product.categoryId,product.description,product.price,product.id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({message:"Product id not found"});
            }else{
                return res.status(200).json({message:"Product update successfully"})
            }
             
        }else{
            return res.status(404).json(err);
        
        }
    })
 });


//Delete Product version 1
 router.delete('/delete/:id', auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    const id=req.params.id;
    const query="delete from product where id=?";
    connection.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows == 0){
                return res.status(404).json({ message:"Bill Id not found"});
            }
            return res.status(200).json({message :"Bill Deleted Successfully"});
        }else{
            return res.status(500).json(err);
        }
    })
})



//Delete Product version 2

//  router.get('/deleteproduct/(:id)',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
//     const product ={id: req.params.id};
//     //const query="delete from product where id=?";
//     connection.query('DELETE FROM product WHERE id = '+req.params.id,product,(err,results)=>{
//         if(!err){
//             // if(results.affectedRows == 0){
                
//             //     return res.status(404).json(err);
//             // }else{
//                 return res.status(200).json({message:"product deleted successfully"});
            

//         }else{
//             return res.status(400).json(err);
//         }
//     })
//  })

 router.patch('/updateStatus',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let users=req.body;
    const query = "update product set status=? where id=?";
    connection.query(query,[users.status,users.id],(err,results)=>{
        if(!err){
             if(results.affectedRows == 0){
                
                 return res.status(404).json({message:"Product not found"});
             }else{
                return res.status(200).json({message:"product status updated successfully"});
            

        }
    }else{
        return res.status(400).json(err);
    }

 })
});

module.exports = router;