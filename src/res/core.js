
/* epic portfolio website
   jewel, 2022 */

/* windowing system that can be reused */

function debug(s) {
    console.log("debug: " + s);
}

function error(s) {
    console.log("error: " + s);
}

/* can't believe i'm actually writing a windowing system in javascript */
var dragged_window = null;
var active_window = null;
var window_count = 0;

function set_active_window(id) {
    debug("set_active_window('" + id + "')");

    const titles = document.getElementsByClassName("title");
    if(!titles.length) {
        error("window '" + id + "' doesn't exist");
        return;
    }

    //if(active_window == id) return;

    for(var i = 0; i < titles.length; i++) {
        if(titles[i].parentNode.id == id) {
            active_window = id;
            titles[i].classList.add("title_active");
            titles[i].parentNode.style.zIndex = window_count + 2;
        } else {
            titles[i].classList.remove("title_active");
            titles[i].parentNode.style.zIndex--;
            if(titles[i].parentNode.style.zIndex <= 3) {
                titles[i].parentNode.style.zIndex = 3;
            }
        }
    }
}

function handle_drag(e) {
    if(dragged_window != null && e.buttons & 1) {
        const w = document.getElementById(dragged_window);
        var x = w.offsetLeft;
        var y = w.offsetTop;

        var maxx = window.innerWidth - w.offsetWidth;
        var maxy = window.innerHeight - w.offsetHeight;

        x += e.movementX;
        y += e.movementY;

        // boundaries
        if(x < 0) x = 0;
        if(y < 0) y = 0;
        if(x > maxx) x = maxx;
        if(y > maxy) y = maxy;

        w.style.transform = "";
        w.style.left = x + "px";
        w.style.top = y + "px";

    }
}

// Width and Height are in both % of viewport
// set x or y to -1 for center, zero for random, else they are in pixels
// set height to -1 for automatic height
function create_window(id, title, w, h, x, y) {
    window_count++;

    debug("create_window('" + id + "', '" + title + "', " + w + ", " + h + ", " + x + ", " + y + ")");

    if(get_window(id)) {
        error("window '" + id + "' already exists, bringing it to front");
        show_window(id);
        return;
    }

    // window bare skeleton
    const e  = document.createElement("div");
    e.id = id;
    e.classList.add("window");
    e.style.zIndex = window_count + 2;
    e.style.width = w + "vw";

    //if(h != -1) e.style.height = h + "vh";

    e.style.visibility = "hidden";  // need to manually use show_window()

    // title bar
    const t = document.createElement("div");
    t.classList.add("title");
    t.innerHTML = title;

    // basic event handlers
    e.onclick = function() {        // focus handler
        set_active_window(id);
    };

    t.onmousedown = function() {    // for dragging
        set_active_window(id);
        dragged_window = id;
    };

    // window content
    const c = document.createElement("div");
    c.classList.add("content");

    if(h != -1) c.style.height = h + "vh";

    /*c.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";*/

    e.appendChild(t);
    e.appendChild(c);

    // apparently you can only calculate elements' width/height if they're already in the DOM
    // so add it first and then position it
    document.body.appendChild(e);

    var maxx = window.innerWidth - e.offsetWidth;
    var maxy = window.innerHeight - e.offsetHeight;

    if((x == -1) || (y == -1)) {
        var nx = (window.innerWidth / 2) - (e.offsetWidth / 2);
        var ny = (window.innerHeight / 2) - (e.offsetHeight / 2);
        e.style.left = nx + "px";
        e.style.top = ny + "px";
    } else if(!x && !y) {
        // random position
        var nx = Math.random() * maxx;
        var ny = Math.random() * maxy;
        e.style.left = nx + "px";
        e.style.top = ny + "px";
    } else {
        e.style.left = x + "px";
        e.style.top = y + "px";
    }
}

function show_window(id) {
    debug("show_window('" + id + "')");
    document.getElementById(id).style.visibility = "visible";

    set_active_window(id);
}

function hide_window(id) {
    debug("hide_window('" + id + "')");
    document.getElementById(id).style.visibility = "hidden";
}

function randomize_window_position(id) {
    debug("randomize_window_position('" + id + "')");

    const w = document.getElementById(id);
    if(!w) {
        error("window '" + id + "' doesn't exist");
        return;
    }

    var maxx = window.innerWidth - w.offsetWidth;
    var maxy = window.innerHeight - w.offsetHeight;

    var x = Math.random() * maxx;
    var y = Math.random() * maxy;
    w.style.left = x + "px";
    w.style.top = y + "px";
}

function center_window(id) {
    debug("randomize_window_position('" + id + "')");

    const w = document.getElementById(id);
    if(!w) {
        error("window '" + id + "' doesn't exist");
        return;
    }

    var x = (window.innerWidth / 2) - (w.offsetWidth / 2);
    var y = (window.innerHeight / 2) - (w.offsetHeight / 2);
    w.style.left = x + "px";
    w.style.top = y + "px";
}

function get_window(id) {   // this exists only for readability
    debug("get_window('" + id + "')");
    return document.getElementById(id);
}

function destroy_window(id) {
    debug("destroy_window('" + id + "')");

    if(!get_window(id)) {
        error("window '" + id + "' doesn't exist");
        return;
    }

    document.getElementById(id).remove();

    window_count--;
}

/* window body content manager */
function dialog(id, text, button_text) {    // creates a standard dialog with text and one button that closes it
    debug("dialog('" + id + "', '" + text + "', '" + button_text + "')");

    const w = document.getElementById(id);
    if(!w) {
        error("window '" + id + "' doesn't exist");
        return;
    }

    const content = w.children[1];
    content.innerHTML = parse_md(text);

    const container = document.createElement("div");
    container.classList.add("button_container");

    const button = document.createElement("button");
    button.innerText = button_text;

    button.onclick = function() {
        destroy_window(id);
    };

    container.appendChild(button);
    content.appendChild(container);
}

function yes_no(id, text, handler) {    // creates a yes/no dialog box that then calls handler() with the choice
    // TODO
}

/* these functions are for non-standard dialog boxes */
function create_text(id, text) {    // adds markdown text to a window that already exists
    debug("create_text('" + id + "', '" + text + "')");

    const w = document.getElementById(id);
    if(!w) {
        error("window '" + id + "' doesn't exist");
        return;
    }

    const content = w.children[1];
    content.innerHTML += parse_md(text);
}

function create_link(id, text, handler) {   // creates a link that runs a handler on click
    debug("create_link('" + id + "', '" + text + "', " + handler + ")");

    const w = document.getElementById(id);
    if(!w) {
        error("window '" + id + "' doesn't exist");
        return;
    }

    const content = w.children[1];

    const l = document.createElement("a");
    l.href = "#";
    l.innerText = text;
    l.onclick = handler;

    content.appendChild(l);
}

function create_outlink(id, text, url) {    // creates a link that opens another page
    debug("create_outlink('" + id + "', '" + text + "', '" + url + "')");

    const w = document.getElementById(id);
    if(!w) {
        error("window '" + id + "' doesn't exist");
        return;
    }

    const content = w.children[1];

    const l = document.createElement("a");
    l.href = url;
    l.innerText = text;
    l.target = "_blank";    // new tab

    content.appendChild(l);
}

// creates an image
// width and height are in % of window, height can be omitted (zero) to auto-adjust according to width
// align 0 = left, 1 = right, 2 = center
function create_image(id, url, alt, w, h, align) {
    debug("create_image('" + id + "', '" + url + "', '" + alt + "', " + w + ", " + h + ", " + align + ")");

    const wi = document.getElementById(id);
    if(!wi) {
        error("window '" + id + "' doesn't exist");
        return;
    }

    const content = wi.children[1];

    const c = document.createElement("div");    // container
    if(align == 1) {
        c.style.textAlign = "right";
    } else if(align == 2) {
        c.style.textAlign = "center";
        c.style.paddingBottom = "8px";
    } else {
        // default align left
        c.style.textAlign = "left";
    }

    const i = document.createElement("img");
    i.src = url;
    i.alt = alt;

    i.style.width = w + "%";
    if(h) i.style.height = h + "%";

    c.appendChild(i);
    content.appendChild(c);
}

/* for the background heart and things */
var heart_minx, heart_miny, heart_maxx, heart_maxy;
var saturn_minx, saturn_miny, saturn_maxx, saturn_maxy;

function move_background(e) {
    const heart = document.getElementById("heart");
    const saturn = document.getElementById("saturn");

    var nx, ny;

    nx = heart.offsetLeft + (e.movementX/30);
    ny = heart.offsetTop + (e.movementY/30);
    if(nx > heart_maxx) nx = heart_maxx;
    if(nx < heart_minx) nx = heart_minx;
    if(ny > heart_maxy) ny = heart_maxy;
    if(ny < heart_miny) ny = heart_miny;
    heart.style.left = nx + "px";
    heart.style.top = ny + "px";

    nx = saturn.offsetLeft - (e.movementX/25);
    ny = saturn.offsetTop - (e.movementY/25);
    if(nx > saturn_maxx) nx = saturn_maxx;
    if(nx < saturn_minx) nx = saturn_minx;
    if(ny > saturn_maxy) ny = saturn_maxy;
    if(ny < saturn_miny) ny = saturn_miny;
    saturn.style.left = nx + "px";
    saturn.style.top = ny + "px";
}

window.onload = function() {
    const heart = document.getElementById("heart");
    const saturn = document.getElementById("saturn");

    heart_minx = heart.offsetLeft;
    heart_maxx = (window.innerWidth/2) - (heart.offsetWidth);
    heart_maxy = heart.offsetTop;
    heart_miny = (window.innerHeight/2) - (heart.offsetHeight/2);

    saturn_maxx = saturn.offsetLeft;
    saturn_minx = (window.innerWidth/2) - (saturn.offsetWidth);
    saturn_miny = saturn.offsetTop;
    saturn_maxy = (window.innerHeight/2) - (saturn.offsetHeight/2);

    window.onmouseup = function() {
        dragged_window = null;
    };

    window.onmousemove = function(e) {
        handle_drag(e);
        move_background(e);
    };

    app_main();
};
