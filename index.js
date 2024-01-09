import express from "express";
import bodyParser from "body-parser";
import $ from 'jquery-jsdom';
 
$("<a>DOM</a>").html()

const app = express();
const port = 3000;
var title = "";
var content = "";
let contentHolder = []
let titleHolder = []
var count = 0;
var EditTitle = "";
var EditContent = "";
var viewTitles = "";
var EditedTitle = "";
var EditedContent = "";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

function getTitle(req,res,next){
    title = req.body["title"];
    next();
}
function getContent(req,res,next){
    content = req.body["content"];
    next();
}
function getSearchTitle(req,res,next){
    EditTitle = req.body["SearchTitle"];
    next()
}
function getchangeTitle(req,res,next){
    EditedTitle = req.body["Editingtitle"];
    next()
}
function getchangeContent(req,res,next){
    EditedContent = req.body["Editingcontent"];
    next()
}

app.use(getTitle);
app.use(getContent);
app.use(getSearchTitle);
app.use(getchangeTitle);
app.use(getchangeContent);


function insertBlog(req,res,next){
    var i = 0;
    var find = false;
    while(i<titleHolder.length&& !find){
        if(titleHolder[i]==title && contentHolder[i]==content){
            find = !find;
        }else if(titleHolder[i]==title && contentHolder[i]!==content){
            title = title + "1";
        }
        i++;
    }
    if(!find){
        titleHolder.push(title);
        contentHolder.push(content);
    }
    next();
}
app.use(insertBlog);

function SearchBlog(req,res,next){
    var k = 0;
    var found = false;
    while(k<titleHolder.length&& !found){
        if (titleHolder[k] == EditTitle){
            EditContent = contentHolder[k];
            found = !found;
            count = k;
        }
        k++
    }
    if(!found){
        viewTitles = "No blog has been found, please check your title again"
    }else{
        viewTitles = "Please edit your blog below";
    }
    next();
}

app.use(SearchBlog);

function deleteBlog(req,res,next){
    $(".delete").on("click", function(){
        if (count == 0){
            titleHolder.splice(count,1);
            contentHolder.splice(count,1);
        }else{
            titleHolder.splice(count,count);
            contentHolder.splice(count,count);
        }
    })
    next();
}

app.use(deleteBlog);

function changeBlog(req,res,next){
    if(EditedTitle !== ""){
        titleHolder[count] = EditedTitle;
        contentHolder[count] = EditedContent;
        EditedTitle = "";
        EditedContent = "";
    }
    next();
}

app.use(changeBlog);

app.get("/",(req,res)=>{
    res.render("index.ejs");
})
app.get("/post",(req,res)=>{
    res.render("post.ejs");
})
app.get("/view",(req,res)=>{
    const data = {
        titleHolder,
        contentHolder,
    }
    res.render("view.ejs",data);
})
app.post("/post",(req,res)=>{
    res.render("post.ejs");
})
app.post("/view",(req,res)=>{
    const data = {
        titleHolder,
        contentHolder,
        EditTitle,
        EditContent,
        viewTitles,
    }
    res.render("view.ejs", data);
})

app.post("/edit", (req,res)=>{
    const data1 = {
        titleHolder,
        contentHolder,
        EditTitle,
        EditContent,
        viewTitles,
    }
    res.render("edit.ejs", data1);
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});