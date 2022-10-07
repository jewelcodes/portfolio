
/* epic portfolio website
   jewel, 2022 */

const artText = "\
    * Heart: [Dansevenstar on OpenGameArt](https://opengameart.org/content/heart-pixel-art)\n \
    * Saturn: [ID 9664c4 on Pixel Art Maker](http://pixelartmaker.com/art/c21dda2f6d67dbc)\n \
    * Madeline & Badeline from [Celeste](https://store.steampowered.com/app/504230/Celeste/): [ID 9664c4 on Pixel Art Maker](http://pixelartmaker.com/art/b2812518a5adf71)";

const mainText = "\
    Hi, I'm Jewel (obviously an online alias) c:\n\n \
    I'm a 20-year-old undergrad biotech student from the [land of the pyramids](https://en.wikipedia.org/wiki/Cairo). \
    I've had a passion for coding for as far back as I can remember and some of my work is showcased here.";

function showArt() {
    if(getWindow("art")) {
        setActiveWindow("art");
        return;
    }

    createWindow("art", "Art Credits", 32, -1, 0, 0);
    dialog("art", artText, "OK");
    randomizeWindowPosition("art");
    showWindow("art");
}

var response, posts;

async function openBlog() {
    if(getWindow("blog")) {
        setActiveWindow("blog");
        return;
    }

    createWindow("blog", "Blog", 43, 35, 0, 0);

    // generate list of blog posts
    var blogMd = new String();
    blogMd = "";

    response = await fetch("res/posts/posts.json");
    if(!response.ok || response.status != 200) {
        createText("blog", "Unable to fetch blog posts. Check your internet connection.");
        showWindow("blog");
        return;
    }

    posts = await response.json();
    //debug(posts.posts.length);

    for(var i = 0; i < posts.posts.length; i++) {
        blogMd += "* [" + posts.posts[i].title + "](bp:" + posts.posts[i].id + ") - " + timeString(posts.posts[i].time) + "\n";
    }

    createText("blog", blogMd);
    setScrollable("blog", true);
    showWindow("blog");
}

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function timeString(t) {
    var elapsed = (Date.now() / 1000) - t;
    var str = new String();

    if(elapsed < 60) {
        str = "just now";
    } else if(elapsed < 3600) {
        var min = Math.floor(elapsed/60);
        if(min < 10 && min > 3) str = " a few minutes ago";
        else if(min >= 10) str = min + " minutes ago";
        else str = "just now";
    } else if(elapsed < 86400) {
        var hour = Math.floor(elapsed/3600);
        if(hour != 1) str = hour + " hours ago";
        else str = "an hour ago";
    } else if(elapsed < 604800) {
        var day = Math.floor(elapsed/86400);
        if(day != 1) str = day + " days ago";
        else str = "a day ago";
    } else {
        var timestamp = new Date(t * 1000);
        str = timestamp.getDate() + " " + months[timestamp.getMonth()] + " " + timestamp.getFullYear();
    }

    return str;
}

// opens a specific blog post
async function blogPost(id) {
    if(getWindow("post_" + id)) {
        setActiveWindow("post_" + id);
        return;
    }

    let response = await fetch("res/posts/" + id + ".md");
    if(!response.ok || response.status != 200) {
        alert("error");
        return;
    }

    let post = await response.text();

    createWindow("post_" + id, posts.posts[id].title, 40, 65, 0, 0);

    createText("post_" + id, "# " + posts.posts[id].title);
    createText("post_" + id, "**- " + timeString(posts.posts[id].time) + "**");

    createText("post_" + id, post);
    setScrollable("post_" + id, true);
    showWindow("post_" + id);
}

function mainWindow() {
    if(getWindow("main")) {
        setActiveWindow("main");
        return;
    }

    createWindow("main", "About", 40, -1, -1, -1);
    createImage("main", "res/images/celeste.png", "Celeste", 30, 30, 2);
    createText("main", mainText);
    centerWindow("main");
    showWindow("main");
}

async function appMain() {
    document.getElementById("heart").onclick = function() { showArt(); };
    document.getElementById("saturn").onclick = document.getElementById("heart").onclick;

    addMenuItem("Blog", async function() { await openBlog(); });
    addMenuItem("About", mainWindow);
    addMenuItem("Art Credits", showArt);

    await openBlog();
    mainWindow();
}

