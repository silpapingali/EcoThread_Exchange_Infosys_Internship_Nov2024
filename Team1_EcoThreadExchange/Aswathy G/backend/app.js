const expross=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const app=expross()
const port=3000;
const authRoutes=require("./routes/auth");
const {verifyToken,isAdmin}=require("./middleware/auth-middleware")
const bodyParser = require('body-parser');
const User=require('../Backend/db/user');
const bcrypt=require("bcrypt");

app.use(cors());
app.use(expross.json());
/*setting and connecting the data base */
app.get("/",(req,res)=>{
    res.send("Server Running");
})
// Middleware
app.use(cors({ origin: 'http://localhost:4200', 
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  
}));
app.use(bodyParser.json()); // To parse JSON requests

// Use the routes

app.use('/api', authRoutes);  // Prefix for the routes in auth.js


app.use("/auth",authRoutes);

app.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    // Log the request body to see if it's being received correctly
    console.log('Request body:', req.body);

    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email and new password are required.' });
    }

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Attempt to update the user's password in the database
        const updatedUser = await User.findOneAndUpdate(
            { email: email },
            { password: hashedPassword },
            { new: true }
        );

        // Log the result of the update query
        console.log('Updated user:', updatedUser);

        // If no user is found with that email
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Send success message
        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        // Log the full error object, including the stack trace
        console.error('Error details:', error); // Logs the full error object
        res.status(500).json({ 
            message: 'An error occurred while updating the password.',
            error: error.message, // Send the error message in the response
            stack: error.stack // Log the stack trace for more debugging information
        });
    }
});

async function connectDb(){
    await mongoose.connect("mongodb://localhost:27017",{
        dbName:"infosys"
    });
    console.log("MongoDb connected");
}
connectDb().catch((err)=>{
    console.error(err);
})

app.listen(port,()=>{
    console.log("server running in port",port);
})
