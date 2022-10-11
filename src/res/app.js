
/* epic portfolio website
   jewel, 2022 */

const artText = "\
    * Cat background: [Pixel Jeff](https://www.behance.net/gallery/103154127/SUDIO) on Behance\n\
    * Madeline & Badeline from [Celeste](https://store.steampowered.com/app/504230/Celeste/): [Pixel Art Maker](http://pixelartmaker.com/art/b2812518a5adf71)\n\
    * Folder icon: [Pixel Art Maker](http://pixelartmaker.com/art/e4800219f1710c9)\n\
    * Settings icon: [Kind PNG](https://www.kindpng.com/imgv/ThwoJoT_transparent-settings-icon-png-companion-cube-pixel-art/)\n\
    * GitHub logo: [Pixel Art Maker](http://pixelartmaker.com/art/d7e4e1e509c728d)\n\
    * Clipboard icon: [Nicholas Zaharias](http://www.ngzaharias.com/blog/2018/9/3/pixel-art)\n\
    * Email icon: [Pixel Art Maker](http://pixelartmaker.com/art/53c6e86088e2560)";

const contactText = "\
    * Email: [omarmelghoul01@gmail.com](mailto:omarmelghoul01@gmail.com)";

const mainText = "\
    Hi, I'm Jewel (obviously an alias) c:\n\n \
    I'm a 20-year-old undergrad biotech student from the [land of the pyramids](https://en.wikipedia.org/wiki/Cairo). \
    I've had a passion for coding for as far back as I can remember and some of my work is showcased here.\n\n \
    This page is powered by a custom UI framework and blogging system built with love [entirely in JavaScript](https://github.com/jewelcodes/portfolio).";

function showArt() {
    if(getWindow("art")) {
        setActiveWindow("art");
        return;
    }

    createWindow("art", "Art Credits", 36, -1, 0, 0);
    createImage("art", "/res/images/celeste.png", "Madeline & Badeline from Celeste", 33, 33, 2);
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

    createWindow("blog", "Blog", 47, 35, 0, 0);

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
async function openBlogPost(id) {
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

    var i;
    for(i = 0; i < posts.posts.length; i++) {
        if(posts.posts[i].id == id) break;
    }

    createWindow("post_" + id, posts.posts[i].title, 48, 74, 0, 0);

    createText("post_" + id, "# " + posts.posts[i].title);
    createText("post_" + id, "**- " + timeString(posts.posts[i].time) + "**");

    createText("post_" + id, post);
    setScrollable("post_" + id, true);
    showWindow("post_" + id);
}

function mainWindow() {
    if(getWindow("main")) {
        setActiveWindow("main");
        return;
    }

    createWindow("main", "About", 42, -1, -1, -1);
    createImage("main", "res/images/avatar.png", "Avatar", 33, 33, 2);
    createText("main", mainText);
    centerWindow("main");
    showWindow("main");
}

function openContact() {
    if(getWindow("contact")) {
        setActiveWindow("contact");
        return;
    }

    createWindow("contact", "Contact", 30, -1, 0, 0);
    dialog("contact", contactText, "OK");
    randomizeWindowPosition("contact");
    showWindow("contact");
}

async function appMain() {
    //document.getElementById("heart").onclick = function() { showArt(); };
    //document.getElementById("saturn").onclick = document.getElementById("heart").onclick;

    addMenuItem("About", mainWindow);
    addMenuItem("Blog", async function() { await openBlog(); });
    addMenuItem("Contact", openContact);
    addMenuItem("Art Credits", showArt);

    createDesktopIcon(desktopIconFolder, "Blog", async function() { await openBlog(); });
    createDesktopIcon(desktopIconGitHub, "GitHub", function() { window.open("https://github.com/jewelcodes", "_blank"); });
    createDesktopIcon(desktopIconEmail, "Contact", openContact);
    createDesktopIcon(desktopIconGear, "Settings", async function() {
        messageBox("Unimplemented", "This feature is still unimplemented.", "OK");
    });
    //createDesktopIcon(desktopIconChecklist, "Changelog", function() { /* todo */ });

    //await openBlog();
    mainWindow();
}

