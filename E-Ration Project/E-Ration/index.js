const express = require('express');
const app = express();
const path = require("path");
const mongoose = require('mongoose');

const user = require('./userSchema');
const payment = require('./paymentSchema');
const order = require('./orderSchema');
const stock = require('./stockSchema');

const bodyParser = require('body-parser');
const { response } = require('express');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));


//const connectionString = "mongodb+srv://root:root@erationshop.zro4b.mongodb.net/erationshop?retryWrites=true&w=majority";

const connectionString = "mongodb://localhost:27017/erationshop";
var connection = mongoose.connect(connectionString,
    { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
    }   
);

if(connection){
    console.log("DB connected");
}

app.get('/', (req,res) => {
    res.render("index",{
        message : null,
    });
});

app.post('/register',function (req, res){

    var user1 = new user({
            name : req.body.name,
            mobile : req.body.mobile,
            email : req.body.email,
            cardtype : req.body.cardtype,
            address : req.body.address,
            rationshopno : req.body.rationshopno,
            password : req.body.password,
    })

    user1.save()
    .then(function (err, results){
        res.send("Successfully Registered");
    })
    .catch(function(err){
        if (err.name === "ValidationError") {
            let errors = {};
      
            Object.keys(err.errors).forEach((key) => {
              errors[key] = err.errors[key].message;
            })
            res.send(errors);
        }
        
    })      
});
var username = "",is_rice = 0,userid = "",totalamnt=0,order_id = "";
app.post('/login',async function (req,res){
    var password = "";
    var cardtype = "";
    

    await user.find({mobile :req.body.mobile},function(err,pro){
        if(pro == "") return password = null;
        password=pro[0].password;
        cardtype = pro[0].cardtype;
        username = pro[0].name;
        userid  = pro[0].id;
        console.log(userid);
    });

    if(password != null){
        if(password  == req.body.password){
            if(cardtype == "Rice Card"){
                is_rice = 1;
               res.redirect('/home');
            }
            else{
                is_rice = 0;
                res.redirect('/home');
            }
            
            //res.send("Successfully Logged In");
        }
        else{
            res.render("index",{
                message : "Password not matched",
            });
            //res.send("Password Wrong");
        }
    }
    else{
        res.render("index",{
            message : "User not founded",
        });
    }
});

app.get('/home',(req,res)=>{
    res.render("product.ejs",{
        rice : is_rice,
        name : username,
    });
})

app.post('/pay',function(req,res){
    totalamnt = req.body.totalamnt;
    res.render("Cpayy.ejs",{
        totalamnt : req.body.totalamnt,
    });
})

app.post('/paymentsuccess', function(req,res){
    var payment1 = new payment({
        customerid : userid,
        orderid : order_id,
        cardname : req.body.cardname,
        cardnumber : req.body.cardnumber,
        month : req.body.expmonth,
        year : req.body.expyear,
        price : totalamnt,
    });

    payment1.save();
    order.findByIdAndUpdate(order_id,{paid : true},function(err,docs){
        if(err){
            console.log(err);
        }
        else{
            console.log(docs);
        }
    });
    res.redirect('/orderplaced');
})

var products;
app.post('/addtocart',(req,res)=>{
    //console.log(req.body.items);
    products = req.body.items;
    console.log(products);
    res.redirect('/cart');
})

app.get('/cart',(req,res) => {
    var order1 = new order({
        customerid : userid,
        product : products, 
        paid : false,
    });
    order1.save(function(err, a) {
        order_id = a.id;
    });
    res.render('cart.ejs',{
        name : username,
        product : products,
    });
})

app.get('/orderplaced',(req,res)=>{
    res.render('orderplaced.ejs',{
        name : username,
    });
})

app.get('/stock',async (req,res)=>{
    rice = 0;halfboiledrice = 0; 
    wheat = 0;
    sugar = 0;
    salt = 0;
    tea = 0;
    uraddall = 0;
    toordall = 0;
    palmoil = 0;
    await stock.find({stockname : 'RawRice'},function(err,pro){
        rice = pro[0].quantity;
    });
    await stock.find({stockname : 'HalfBoiledRice'},function(err,pro){
        halfboiledrice = pro[0].quantity;
    });
    await stock.find({stockname : 'Wheat'},function(err,pro){
        wheat = pro[0].quantity;
    });
    await stock.find({stockname : 'Sugar'},function(err,pro){
        sugar = pro[0].quantity;
    });
    await stock.find({stockname : 'Salt'},function(err,pro){
        salt = pro[0].quantity;
    });
    await stock.find({stockname : 'Tea'},function(err,pro){
        tea = pro[0].quantity;
    });
    await stock.find({stockname : 'UradDall'},function(err,pro){
        uraddall = pro[0].quantity;
    });

    await stock.find({stockname : 'ToorDall'},function(err,pro){
        toordall = pro[0].quantity;
    });
    await stock.find({stockname : 'PalmOil'},function(err,pro){
        palmoil = pro[0].quantity;
    });

    res.render('stock',{
        rice : rice,
        halfboiledrice : halfboiledrice,
        wheat : wheat,
        sugar : sugar,
        salt : salt,
        tea : tea,
        uraddall : uraddall,
        uraddall : uraddall,
        palmoil : palmoil,
    });
})

app.get('/addstock',(req,res)=>{
    res.render('addquantity');
})

app.post('/updatestock',async (req,res)=>{
    /*var stock1 = new stock({
        stockname : req.body.name,
        quantity : req.body.qty   
    });
    stock1.save();*/
    id = "";
    qty = 0;

    await stock.find({stockname :req.body.name},function(err,pro){
        id = pro[0].id;
        qty = pro[0].quantity;
    });
    console.log(id +"  "+qty);
    qty = Number(qty+Number(req.body.qty));
    stock.findByIdAndUpdate(id,{quantity : qty},function(err,docs){
        if(err){
            console.log(err);
        }
        else{
            console.log(docs);
        }
    });
    

});

app.listen(3000);