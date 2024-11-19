const expross=require("express")
const cors=require("cors")
const mongoose=require("mongoose")
const app=expross()
const port=3000;
const authRoutes=require("./routes/auth");
const {verifyToken,isAdmin}=require("./middleware/auth-middleware")
const bodyParser = require('body-parser');

app.use(cors());
app.use(expross.json());
/*setting and connecting the data base */
app.get("/",(req,res)=>{
    res.send("Server Running");
})
// Middleware
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(bodyParser.json()); // To parse JSON requests

// Use the routes

app.use('/api', authRoutes);  // Prefix for the routes in auth.js


app.use("/auth",authRoutes);


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
