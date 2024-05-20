const express=require("express")
const app=express();

app.get("/",(req,res)=>{
    res.send("Hi i am root!")
});

app.get("/posts",(req,res)=>{
    res.send("GET for Users")
})

app.get("/posts/:id",(req,res)=>{
    res.send("GET for show Users id ")
})

app.post("/posts",(req,res)=>{
    res.send("post for users");
})

app.delete("/posts /:id",(res,req)=>{
    res.send("delete for users id")
})
app.listen(3000,()=>{
    console.log("server is listening to port 3000")
});