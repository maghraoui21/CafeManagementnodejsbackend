const express=require ('express');
const connection=require('../connections');
const router = express.Router();
var auth= require('../services/authentification');
var checkRole =  require('../services/checkRole');

router.post('/addcategorie',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let categorie = req.body;
    const query="insert into category (name) values(?)";
    connection.query(query,[categorie.name],(err,resuls)=>{
        if(!err){
            return res.status(200).json({message:"Category Added Successfully"});
        }else{
            return res.status(500).json(err);
        }
    })
})

router.get('/gettallcategory',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    const query="select * from category order by name";
    connection.query(query,(err,results)=>{
        if (!err) {
            return res.status(200).json(results);
        } else {
            return res.status(500).json(err);
        }
    })
})
router.patch('/updatecategory',auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
    let product= req.body;
    const query="update category set name=? where id=?";
    connection.query(query,[product.name,product.id],(err,resuls)=>{
        if(!err){
            if(resuls.affectedRows == 0 ){
                return res.status(404).json({message:"Categoryid not found"});
            }else{
                return res.status(200).json({message:"Category Updated Successfully"});
            }
           
        }else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router ; 