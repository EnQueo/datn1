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
app.use(cors({
  origin: 'http://192.168.55.106:3000',
  methods:['GET','POST','PUT','DELETE']
}));

// Database connection with mongodb
mongoose.connect("mongodb+srv://lolproloc2:lolprol0l@cluster0.3um5x.mongodb.net/e-commerce")

// API Creation

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

// Image storage engine

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/images'); // Folder lưu ảnh
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Tạo tên file duy nhất
  },
});

const upload = multer({storage:storage})

//Creating upload endpoint for images
app.use('/images',express.static('upload/images'))

app.post("/upload", upload.array('product_images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: 0, message: "No files uploaded." });
  }

  const imageUrls = req.files.map(file => `http://192.168.55.106:${port}/images/${file.filename}`);

  res.json({
      success: 1,
      image_urls: imageUrls, 
  });
});

//Schema for Creating Products

const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  image: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true
  },
  new_price: {
    type: Number,
    required: true
  },
  old_price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  available: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  }
});


app.post('/addproduct', async (req, res) => {
  try {
    let lastProduct = await Product.findOne().sort({ id: -1 });
    let id = lastProduct ? lastProduct.id + 1 : 1;

    // Destructure fields from request body
    const { name, image_urls, category, new_price, old_price, size, brand } = req.body;

    // Check if all required fields are provided
    if (!name || !image_urls || !category || !new_price || !old_price || !size || !brand) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Validate size as a string
    if (typeof size !== 'string') {
      return res.status(400).json({ success: false, message: "Size must be a string" });
    }

    // Create new product document
    const product = new Product({
      id: id,
      name: name,
      image: image_urls,
      category: category,
      new_price: new_price,
      old_price: old_price,
      size: size, 
      brand: brand, 
      available: true
    });

  
    await product.save();

    // Respond with success
    res.status(201).json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Error adding product" });
  }
});




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

// Creating API for getting product
app.get('/product/:id', async (req, res) => {
    const productId = req.params.id; // Lấy `id` từ URL
    try {
        // Tìm kiếm sản phẩm trong cơ sở dữ liệu với id
        const product = await Product.findOne({ id: Number(productId) }); 

        // Nếu không tìm thấy, trả về thông báo lỗi
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Trả về sản phẩm nếu tìm thấy
        res.status(200).json(product);
    } catch (error) {
        // Xử lý lỗi và trả về thông báo lỗi 500
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Error fetching product" });
    }
});



//Schema creating for user model

const Users = mongoose.model('Users',{
    id:{
      type: Number,
      require: true,
      unique: true
    },
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
    avatar: {
      type: String,
      default: null,
  },
    date:{
        type:Date,
        default:Date.now,
    }
})

// Creating endpoint for registering the user
app.post('/signup', async (req, res) => {
  try {
    const check = await Users.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ success: false, errors: "Existing user found with same email address" });
    }

    let lastUsers = await Users.findOne().sort({ id: -1 });
    let id = lastUsers ? lastUsers.id + 1 : 1;

    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new Users({
      id: id,
      name: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      cartData: cart,
      avatar: null,
    });

    await user.save();

    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});




// Endpoint for user login

app.post('/login',async (req,res)=>{
    try {
        const uEmail = req.body.email;
        const uPassword = req.body.password;
        const count = await Users.countDocuments();
        console.log("count = " + count) 
        const user = await Users.findOne({ email:uEmail });
        //const user1 = await Users.findOne({ email:"lolproloc5@gmail.com" });
        //const user3 = await Users.findOne({ email:uEmail});
        //const user2 = await Users.findOne({ id:2 });
        
        if (!user) {
          return res.json({ success: false, errors: "Wrong Email Id" });
        }
    
        const isPasswordValid = await bcrypt.compare(uPassword, user.password);
        if (!isPasswordValid) {
          return res.json({ success: false, errors: "Wrong Password" });
        }
    
        const data = {
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
          },
        };
    
        const token = jwt.sign(data, 'secret_ecom', { expiresIn: '1h' });
    
        res.json({
          success: true,
          token,
          role: user.role,
        });
        console.log(data)
      } catch (error) {
        res.status(500).json({ success: false, errors: "Server error" });
      }
})



const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('Missing or malformed Authorization header');
    return res.status(401).json({ message: 'Authorization header must be in the format: Bearer [token]' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, 'secret_ecom', (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token has expired' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user; // Lưu thông tin người dùng vào req.user
    next(); // Tiếp tục xử lý request
  });
};




app.get('/user-profile', authenticateToken, async (req, res) => {
  console.log(req.user.id)
  try {
    const user = await Users.findOne({email: req.user.user.email}); 
    console.log('Queried user from DB:', user);
    console.log(req.user.id)

    if (!user) {
      console.log('User not found in DB');
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      email: user.email,
      name: user.name,
      avatar: user.avatar || '', 
    });
  } catch (error) {
    console.error('Error in /user-profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});




app.put('/user-profile', authenticateToken, upload.single('avatar'), async (req, res) => {
  const { username } = req.body;
  const avatar = req.file ? req.file.filename : null;

  try {
    const user = await Users.findOne({id: req.user.id});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = username || user.username;
    user.avatar = avatar || user.avatar; 
    await user.save();

    res.json({ success: true, avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
});


app.put('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await Users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10); // Mã hóa mật khẩu mới
    await user.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


// API Orders

const Order = mongoose.model('Order', {
  productDetails: [
    {
      image: [{
        type: String,
        required: true, // Hình ảnh sản phẩm
      }],
      name: {
        type: String,
        required: true, // Tên sản phẩm
      },
      size: {
        type: String,
        required: true, // Size của sản phẩm
      },
      quantity: {
        type: Number,
        required: true, // Số lượng sản phẩm
      },
      price: {
        type: Number,
        required: true, // Giá của sản phẩm
      },
    },
  ],
  username: {
    type: String,
    required: true, // Người dùng thực hiện đơn hàng
  },
  total: {
    type: Number,
    required: true, // Tổng giá trị đơn hàng
  },
  date: {
    type: Date,
    default: Date.now, // Ngày tạo đơn hàng
  },
  status: {
    type: String,
    enum: ['pending', 'shipping', 'delivered', 'cancelled'], // Trạng thái đơn hàng
    default: 'pending', // Mặc định là trạng thái pending
  },
});
  
app.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { productDetails, total, status } = req.body;

    if (!productDetails || productDetails.length === 0 || !total) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

  
    for (let product of productDetails) {
      if (!product.name || !product.size || !product.quantity || !product.price) {
        return res.status(400).json({ message: 'Missing product details' });
      }
    }

    const user = await Users.findOne({ id: req.user.user.id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    const username = user.name;

    const newOrder = new Order({
      productDetails,
      username,
      total,
      status,
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
});
  
  


app.get("/orders", async (req, res) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.put('/orders/:orderId/status', async (req, res) => {
    try {
      const { orderId } = req.params; // Nhận _id từ URL
      const { newStatus } = req.body; // Nhận trạng thái mới từ body request
  
      if (!newStatus) {
        return res.status(400).json({ message: 'Missing new status' });
      }
  
      // Tìm và cập nhật trạng thái đơn hàng
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: newStatus },
        { new: true }
      );
  
      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({ message: 'Status updated successfully', order: updatedOrder });
    } catch (err) {
      res.status(500).json({ message: 'Error updating status', error: err });
    }
  });
  

app.listen(port,'0.0.0.0',(error)=>{
    if (!error) {
        console.log("Server Running on Port "+port)
    }
    else{
        console.log("Error: "+error)
    }
})