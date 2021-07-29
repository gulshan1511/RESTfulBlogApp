const express = require("express"),
app           = express(),
mongoose      = require("mongoose"),
methodOverride = require("method-override"),
expressSanitizer = require("express-sanitizer");

// APP CONFIG
mongoose.connect('mongodb://localhost/restful_blog_app', {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

// MONGOOSE/MODEL CONFIG
const Blog = mongoose.model("Blog",{
    title: String,
    image: {type: String, default: ""},
    body: String,
    created: {type: Date, default: Date.now}
});

// Blog.create({
//     title: "Test",
//     image: "https://img.indiefolio.com/fit-in/1100x0/filters:format(webp):fill(transparent)/project/body/ee7ded858e9648e36450501cfbcae610.jpg",
//     body: "HELLO THIS IS A BLOG POST!"
// });

// RESTFUL ROUTES
app.get("/", (req,res)=>{
    res.redirect("/blogs");
});

// INDEX ROUTE
app.get("/blogs", (req,res)=>{
    Blog.find({}, (err,blogs)=>{
        if(err){
            console.log(err);
        }else{
            console.log(blogs);
            res.render("index", {blogs: blogs});
        }
    });
    
});

// NEW ROUTE
app.get("/blogs/new", (req,res)=>{
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", (req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, (err, blog)=>{
        if(err){
            console.log(err);
        } else{
            res.redirect("/blogs");
            console.log(blog);
        }
    });
});

// SHOW ROUTE
app.get("/blogs/:id", (req,res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("show", {blog: foundBlog});
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", (req,res)=>{
    Blog.findById(req.params.id, (err, blog)=>{
        if(err){
            res.redirect("/blogs");
        } else{
            res.render("edit", {blog: blog});
        }
    });
     
});

// UPDATE ROUTE

app.put("/blogs/:id", (req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, blog)=>{
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/"+req.params.id);
        }
    });
});

// DESTROY ROUTE

app.delete("/blogs/:id", (req, res)=>{
    Blog.findByIdAndRemove(req.params.id, (err,blog)=>{
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    });
});

app.listen(3000, ()=>{
    console.log("SERVER STARTED");
});