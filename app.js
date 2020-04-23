const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");

/*const request=require("request");
const https=require("https");*/
const app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
    useNewUrlParser: true
});

const itemsSchema = {
    name: String
};
//items
const Item = mongoose.model("Item", itemsSchema);
const item1=new Item({
    name:"fucker"
})
var defaultitems=[item1]

//customlist
const listSchema={
    name:String,
    items:[itemsSchema]
}
const List=mongoose.model("List",listSchema);


app.get("/:customListname",function(req,res){
    const customListname=req.params.customListname;
    console.log(customListname);
    
    List.findOne({name :customListname},function(err,foundlist){
        if(!err){
            if(foundlist)
            {
                console.log("exists")
                res.render("list", {list_title: foundlist.name,new_item: foundlist.items})
            }
            else
            {   
                console.log("doesnt exist")
                const list=new List({
                    name :customListname,
                    items:defaultitems
                })
                list.save();
                res.redirect("/"+customListname);
               // res.render("list",{list_title:customListname,new_item:defaultitems})
            }
        }
    })
})


app.get("/", function (req, res) {
    Item.find({}, function (err, founditems) {

        res.render("list", {
            list_title: "Today",
            new_item: founditems
        })
    })

   
});

app.post("/", function (req, res) {
        var a = req.body.input;
       
        const listname=req.body.list;
        if (listname==="Today")
            {
                Item.create({
                    name: a
                })
                
                res.redirect("/");
            }
});


app.post("/delete", function (req, res) {
    const b = req.body.checkbox;
    Item.findByIdAndRemove(b, function(err)
    {
        if (err)
        {console.log("there's osme error")}
        else
        {res.redirect("/")}
    })

})



app.listen(process.env.PORT || 3000, function () {
    console.log("server started at 3000");
});