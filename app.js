const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");

/*const request=require("request");
const https=require("https");*/
const app = express();
app.use(bodyparser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",{ useNewUrlParser: true });

const itemsSchema= {
    name : String
};
//items
const Item=mongoose.model("Item",itemsSchema);


//workitems
const workitem=mongoose.model("workitem",itemsSchema);







var worklist=[];

app.get("/",function(req,res)
{   
    Item.find({},function(err,founditems){
        
        res.render("list",{kindofday:"Today",new_item:founditems})
    }) 
});

app.post("/",function(req,res)
{   
    if(req.body.list==="work")
    {   
        var a=req.body.input;
        workitem.create({name: a})
        res.redirect("/work");
    }
    else{
        var a=req.body.input;
        Item.create({name: a})
        res.redirect("/");
    }
});

app.get("/work",function(req,res)
{
    workitem.find({},function(err,workfound)
    {
        res.render("list",{kindofday:"work list",new_item:workfound})
    })
    
    
});

app.listen(process.env.PORT || 3000,function()
{
    console.log("server started at 3000");
});