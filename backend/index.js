const port = 4000;
const host = '0.0.0.0';
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error } = require("console");
const bcrypt = require('bcrypt');
const paypal = require("@paypal/checkout-server-sdk");
const bodyParser = require('body-parser');
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');

process.env.GOOGLE_APPLICATION_CREDENTIALS = "D:/Download/chatbotconnect/chatbotconnect.json";

app.use(express.json());

app.use(cors());

mongoose.connect("mongodb+srv://lolproloc2:lolprol0l@cluster0.3um5x.mongodb.net/e-commerce")

app.get("/",(req,res)=>{
    res.send("Express App is Running")
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'upload/images');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({storage:storage})

app.use('/images',express.static('upload/images'))

app.post("/upload", upload.array('product_images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: 0, message: "No files uploaded." });
  }

  const imageUrls = req.files.map(file => `http://localhost:${port}/images/${file.filename}`);

  res.json({
      success: 1,
      image_urls: imageUrls, 
  });
});

const clientId = 'ASASGU8oKI442ern3aNV8y7DR2G8yC308ghpg3F5TYkbkRTjBNmGN2bmgokrktOiCFA77-TxjPwE_1ZM';
const secret = 'EJK8dxmJIwP__GbyWjMk0nRDPLqDqLyrOQepn56vTOImHO7ECTAvEvor4yXrnDHLGqwwSBhxiIjY8owu'
const environment = new paypal.core.SandboxEnvironment(clientId, secret);
const client = new paypal.core.PayPalHttpClient(environment);

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
  sizes: [{
    size: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    }
  }],
  brand: {
    type: String,
    required: true
  }
});

app.post('/addproduct', async (req, res) => {
  try {
    let lastProduct = await Product.findOne().sort({ id: -1 });
    let id = lastProduct ? lastProduct.id + 1 : 1;

    const { name, image_urls, category, new_price, old_price, sizes, brand } = req.body;

    if (!name || !image_urls || !category || !new_price || !old_price || !sizes || !brand) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!Array.isArray(sizes) || sizes.some(size => !size.size || !size.quantity)) {
      return res.status(400).json({ success: false, message: "Sizes must be an array with each item containing 'size' and 'quantity'" });
    }

    const product = new Product({
      id: id,
      name: name,
      image: image_urls,
      category: category,
      new_price: new_price,
      old_price: old_price,
      sizes: sizes,
      brand: brand, 
      available: true
    });

    await product.save();

    res.status(201).json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ success: false, message: "Error adding product" });
  }
});


app.post('/updateproduct', async (req, res) => {
  const { id, sizes } = req.body;

  try {
      const product = await Product.findOneAndUpdate({ id: id }, { $set: { sizes: sizes } }, { new: true });
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json({ message: 'Product updated successfully', product });
  } catch (err) {
      res.status(500).json({ message: 'Error updating product', error: err.message });
  }
});

app.post('/removeproduct', async (req,res)=>{
    await Product.findOneAndDelete({id: req.body.id});
    res.json({
      success:true,
      name:req.body.name
    })
})

app.get('/allproducts', async (req,res)=>{
    let products = await Product.find({})
    console.log("All Products Fetched")
    res.send(products);
})

app.get('/product/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findOne({ id: Number(productId) }); 

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ message: "Error fetching product" });
    }
});

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

app.post('/login',async (req,res)=>{
    try {
        const uEmail = req.body.email;
        const uPassword = req.body.password;
        const count = await Users.countDocuments();
        const user = await Users.findOne({ email:uEmail });
        
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
      } catch (error) {
        res.status(500).json({ success: false, errors: "Server error" });
      }
})

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

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
    req.user = user;
    next();
  });
};

app.get('/user-profile', authenticateToken, async (req, res) => {
  try {
    const user = await Users.findOne({email: req.user.user.email}); 

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

app.get('/users', async (req, res) => {
  try {
    const users = await Users.find();

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'No users found' });
    }
    
    return res.status(200).json(users);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await Users.findOneAndDelete({ id });

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.put('/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  try {
    const user = await Users.findOne({id: req.user.user.id});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const Promo = mongoose.model('Promo', {
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount_percentage: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  expire_date: {
    type: Date,
    required: true,
  },
});

app.post('/promos', async (req,res)=>{
  const { code, discount_percentage, expire_date } = req.body;

  if (!code || !discount_percentage || !expire_date) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const newPromo = new Promo({
      code,
      discount_percentage,
      expire_date,
    });

    await newPromo.save();
    return res.status(201).json({ message: 'Promo code added successfully.' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Promo code already exists.' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
})

app.post('/promos/validate', async(req,res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Promo code is required.' });
  }

  try {
    const promo = await Promo.findOne({ code });

    if (!promo) {
      return res.status(404).json({ error: 'Promo code not found.' });
    }

    const currentDate = new Date();

    if (new Date(promo.expire_date) < currentDate) {
      return res.status(400).json({ error: 'Promo code has expired.' });
    }

    return res.status(200).json({
      message: 'Promo code is valid.',
      discount_percentage: promo.discount_percentage,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
})

app.get('/promos', async (req, res) => {
  try {
    const promos = await Promo.find();
    res.status(200).json(promos);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching promos' });
  }
});

app.put('/promos/:id', async (req, res) => {
  const { id } = req.params;
  const { code, discount_percentage, expire_date } = req.body;

  if (!code || !discount_percentage || !expire_date) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const updatedPromo = await Promo.findByIdAndUpdate(
      id,
      { code, discount_percentage, expire_date },
      { new: true, runValidators: true }
    );

    if (!updatedPromo) {
      return res.status(404).json({ error: 'Promo not found.' });
    }

    return res.status(200).json({ message: 'Promo updated successfully.', promo: updatedPromo });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Promo code already exists.' });
    }
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

app.delete('/promos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPromo = await Promo.findByIdAndDelete(id);

    if (!deletedPromo) {
      return res.status(404).json({ error: 'Promo not found.' });
    }

    return res.status(200).json({ message: 'Promo deleted successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

const Order = mongoose.model('Order', {
  productDetails: [
    {
      image: [{
        type: String,
        required: true,
      }],
      name: {
        type: String,
        required: true, 
      },
      size: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  username: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Pending', 'Shipping', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  address: { 
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number, 
    required: true
  }
});

app.post('/paypal/create-order', async (req, res) => {
  const { productDetails, username, total, address, phoneNumber, status } = req.body;

  if (!address || !phoneNumber) {
    return res.status(400).json({ message: 'Missing address or phone number' });
  }

  const order = new paypal.orders.OrdersCreateRequest();
  order.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: { currency_code: 'USD', value: total.toString() },
    }],
    application_context: {
      brand_name: 'Your Brand',
      landing_page: 'BILLING',
      user_action: 'PAY_NOW',
      return_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancelled',
    },
  });

  try {
    const response = await client.execute(order);
    const orderId = response.result.id;
    const approvalUrl = response.result.links.find(link => link.rel === 'approve').href;

    res.json({ approvalUrl, orderId });
  } catch (err) {
    return res.status(500).json({ message: 'Error creating PayPal order', error: err.message });
  }
});

app.post('/paypal/capture-payment', async (req, res) => {
  const { orderId, productDetails, username, total, address, phoneNumber, status } = req.body;

  if (!orderId || !productDetails || !username || !total || !address || !phoneNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const response = await client.execute(request);
    const paymentDetails = response.result;

    if (paymentDetails.status === 'COMPLETED') {
      const newOrder = new Order({
        productDetails,
        username,
        total,
        status,
        address,
        phoneNumber,
      });

      const savedOrder = await newOrder.save();
      res.json({ success: true, paymentDetails, savedOrder });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error capturing payment', error: err.message });
  }
});

app.post('/orders', authenticateToken, async (req, res) => {
  try {
    const { productDetails, total, status, address, phoneNumber } = req.body;

    if (!productDetails || productDetails.length === 0 || !total || !address || !phoneNumber) {
      return res.status(400).json({ message: 'Missing required fields' });
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
      address,
      phoneNumber
    });

    const savedOrder = await newOrder.save();

    for (let product of productDetails) {
      const { name, size, quantity } = product;
      const productDoc = await Product.findOne({name});

      if (productDoc) {
        const sizeIndex = productDoc.sizes.findIndex(s => s.size === size);
        
        if (sizeIndex !== -1) {
          productDoc.sizes[sizeIndex].quantity -= quantity;

          await productDoc.save();
        } else {
          console.log(`Size ${size} not found for product ${product.name}`);
        }
      } else {
        console.log(`Product with Name ${name} not found`);
      }
    }

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

app.get('/user-orders', authenticateToken, async (req, res) => {
    try {
      const user = await Users.findOne({ id: req.user.user.id });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const username = user.name;
  
      const orders = await Order.find({ username });
  
      if (orders.length === 0) {
        return res.status(404).json({ message: 'No orders found for this user' });
      }
  
      res.status(200).json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error retrieving orders', error: err.message });
    }
  });

app.put('/orders/:orderId/status', async (req, res) => {
    try {
      const { orderId } = req.params;
      const { newStatus } = req.body;
  
      if (!newStatus) {
        return res.status(400).json({ message: 'Missing new status' });
      }
  
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

const sessionId = uuid.v4();

app.post('/api/chatbot', async (req, res) => {
  const { message } = req.body;

  const projectId = 'my-e-commerce-project-441812';
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: message,
        languageCode: 'en',
      },
    },
  };

  try {
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ reply: result.fulfillmentText });
  } catch (error) {
    console.error('Error connecting to Dialogflow:', error);
    res.status(500).send('Error connecting to Dialogflow');
  }
});

app.get('/dashboard-stats', async (req, res) => {
  try {
    const totalUsers = await Users.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.json({ totalUsers, totalProducts, totalOrders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/monthly-revenue', async (req, res) => {
  const { month } = req.query;
  const year = new Date().getFullYear();

  try { 
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0);

    const revenueData = await Order.aggregate([
      {
        $match: {
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: "$status",
          totalRevenue: { $sum: "$total" },
        },
      },
    ]);

    const result = {
      Pending: 0,
      Shipping: 0,
      Delivered: 0,
      Cancelled: 0,
    };

    revenueData.forEach((item) => {
      result[item._id] = item.totalRevenue;
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port,host,(error)=>{
  console.log("Server Running on Port "+port)
})