const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error } = require("console");
const bcrypt = require('bcrypt');

app.use(express.json());
app.use(cors());

// Database connection with mongodb
mongoose.connect("mongodb+srv://lolproloc2:lolprol0l@cluster0.3um5x.mongodb.net/e-commerce")

// API Creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

// Image storage engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(req,file,cb)=>{
        return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//Creating upload endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload",upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

//Schema for Creating Products

const Product = mongoose.model("Product",{
    id:{
        type: Number,
        require: true,
    },
    name:{
        type:String,
        require:true
    },
    image:{
        type:String,
        require:true
    },
    category:{
        type:String,
        require:true
    },
    new_price:{
        type:Number,
        require:true
    },
    old_price:{
        type:Number,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    avilable:{
        type:Boolean,
        default:true
    }
})

app.post('/addproduct',async (req,res)=>{
    let products = await Product.find({});
    let id;
    if(products.length>0)
    {
        let last_product_array = products.slice(-1)
        let last_product = last_product_array[0]
        id = last_product.id+1;
    } 
    else{
        id=1;
    }
    const product = new Product({
        id:req.body.id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success:true,
        name:req.body.name
    })
})

// Createing API for deleting product

app.post('/removeproduct', async (req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed")
        success:true
        name:req.body.name
})

// Creating API for getting all products

app.get('/allproducts', async (req,res)=>{
    let products = await Product.find({})
    console.log("All Products Fetched")
    res.send(products);
})

//Schema creating for user model

const Users = mongoose.model('Users',{
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        enum:['user','admin'],
        default:'user'
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Creating endpoint for registering the user
app.post('/signup',async (req,res)=>{
    try {
        // Kiểm tra email đã tồn tại
        const check = await Users.findOne({ email: req.body.email });
        if (check) {
          return res.status(400).json({ success: false, errors: "Existing user found with same email address" });
        }
    
        // Tạo dữ liệu giỏ hàng mặc định
        let cart = {};
        for (let i = 0; i < 300; i++) {
          cart[i] = 0;
        }
    
        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
    
        // Tạo người dùng mới
        const user = new Users({
          name: req.body.username,
          email: req.body.email,
          password: hashedPassword, // Lưu mật khẩu đã hash
          cartData: cart,
        });
    
        await user.save();
    
        // Tạo token
        const data = {
          user: {
            id: user.id,
          },
        };
    
        const token = jwt.sign(data, 'secret_ecom');
        res.json({ success: true, token });
      } catch (error) {
        res.status(500).json({ success: false, errors: "Server error" });
      }
})

// Endpoint for user login

app.post('/login',async (req,res)=>{
    try {
        const { email, password } = req.body;
    
        // Tìm người dùng trong cơ sở dữ liệu
        const user = await Users.findOne({ email });
        if (!user) {
          return res.json({ success: false, errors: "Wrong Email Id" });
        }
    
        // So sánh mật khẩu an toàn
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.json({ success: false, errors: "Wrong Password" });
        }
    
        // Tạo token và bao gồm vai trò người dùng
        const data = {
          user: {
            id: user.id,
            role: user.role, // Bao gồm role trong token
          },
        };
    
        const token = jwt.sign(data, 'secret_ecom', { expiresIn: '1h' });
    
        // Trả về token và role
        res.json({
          success: true,
          token,
          role: user.role, // Trả về role để frontend xử lý
        });
      } catch (error) {
        res.status(500).json({ success: false, errors: "Server error" });
      }
})



app.listen(port,(error)=>{
    if (!error) {
        console.log("Server Running on Port "+port)
    }
    else{
        console.log("Error: "+error)
    }
})