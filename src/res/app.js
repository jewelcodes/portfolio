
/* epic portfolio website
   jewel, 2022 */

const art_text = "\
    * Heart: [Dansevenstar on OpenGameArt](https://opengameart.org/content/heart-pixel-art)\n \
    * Saturn: [ID 9664c4 on Pixel Art Maker](http://pixelartmaker.com/art/c21dda2f6d67dbc)\n \
    * Madeline & Badeline from [Celeste](https://store.steampowered.com/app/504230/Celeste/): [ID 9664c4 on Pixel Art Maker](http://pixelartmaker.com/art/b2812518a5adf71)";

const main_text = "\
    Hi, I'm Jewel (obviously an online alias) c:\n\n \
    I'm a 20-year-old undergrad biotech student from the [land of the pyramids](https://en.wikipedia.org/wiki/Cairo). \
    I've had a passion for coding for as far back as I can remember and some of my work is showcased here.";

function show_art() {
    if(get_window("art")) {
        set_active_window("art");
        return;
    }

    create_window("art", "Art Credits", 32, -1, 0, 0);
    dialog("art", art_text, "OK");
    randomize_window_position("art");
    show_window("art");
}

var response, posts;

async function open_blog() {
    create_window("blog", "Blog", 43, 35, 0, 0);

    // generate list of blog posts
    var blog_md = new String();
    blog_md = "";

    response = await fetch("res/posts/posts");
    if(!response.ok || response.status != 200) {
        create_text("blog", "Unable to fetch blog posts. Check your internet connection.");
        show_window("blog");
        return;
    }

    posts = await response.json();
    //debug(posts.posts.length);

    for(var i = 0; i < posts.posts.length; i++) {
        blog_md += "* [" + posts.posts[i].title + "](bp:" + posts.posts[i].id + ") - " + time_string(posts.posts[i].time) + "\n";
    }

    create_text("blog", blog_md);
    show_window("blog");
}

var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

function time_string(t) {
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
async function blog_post(id) {
    let response = await fetch("res/posts/" + id + ".md");
    if(!response.ok || response.status != 200) {
        alert("error");
        return;
    }

    let post = await response.text();

    create_window("post_" + id, posts.posts[id].title, 40, 65, 0, 0);

    create_text("post_" + id, "# " + posts.posts[id].title);
    create_text("post_" + id, "**- " + time_string(posts.posts[id].time) + "**");

    create_text("post_" + id, post);
    show_window("post_" + id);
}

async function app_main() {
    document.getElementById("heart").onclick = function() { show_art(); };
    document.getElementById("saturn").onclick = document.getElementById("heart").onclick;

    await open_blog();

    create_window("main", "About", 40, -1, -1, -1);
    create_image("main", "res/images/celeste.png", "Celeste", 30, 30, 2);
    create_text("main", main_text);
    center_window("main");
    show_window("main");
}

