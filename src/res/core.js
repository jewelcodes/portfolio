
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
var draggedWindow = null;
var activeWindow = null;
var windowCount = 0;

function setActiveWindow(id) {
    debug("setActiveWindow('" + id + "')");

    const titles = document.getElementsByClassName("title");
    if(!titles.length) {
        error("window '" + id + "' doesn't exist");
        return;
    }

    //if(activeWindow == id) return;

    for(var i = 0; i < titles.length; i++) {
        if(titles[i].parentNode.id == id) {
            activeWindow = id;
            titles[i].classList.add("titleActive");
            titles[i].parentNode.style.zIndex = windowCount + 2;
        } else {
            titles[i].classList.remove("titleActive");
            titles[i].parentNode.style.zIndex--;
            if(titles[i].parentNode.style.zIndex <= 3) {
                titles[i].parentNode.style.zIndex = 3;
            }
        }
    }
}

function handleDrag(e) {
    if(draggedWindow != null && e.buttons & 1) {
        const w = document.getElementById(draggedWindow);
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
function createWindow(id, title, w, h, x, y) {
    windowCount++;

    debug("createWindow('" + id + "', '" + title + "', " + w + ", " + h + ", " + x + ", " + y + ")");

    if(getWindow(id)) {
        error("window '" + id + "' already exists, bringing it to front");
        showWindow(id);
        return;
    }

    // window bare skeleton
    const e  = document.createElement("div");
    e.id = id;
    e.classList.add("window");
    e.style.zIndex = windowCount + 2;
    e.style.width = w + "vw";

    //if(h != -1) e.style.height = h + "vh";

    e.style.visibility = "hidden";  // need to manually use showWindow()

    // title bar
    const t = document.createElement("div");
    t.classList.add("title");
    t.innerHTML = title;

    // basic event handlers
    e.onclick = function() {        // focus handler
        setActiveWindow(id);
    };

    t.onmousedown = function() {    // for dragging
        setActiveWindow(id);
        draggedWindow = id;
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

function showWindow(id) {
    debug("showWindow('" + id + "')");
    document.getElementById(id).style.visibility = "visible";

    setActiveWindow(id);
}

function hideWindow(id) {
    debug("hideWindow('" + id + "')");
    document.getElementById(id).style.visibility = "hidden";
}

function randomizeWindowPosition(id) {
    debug("randomizeWindowPosition('" + id + "')");

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

function centerWindow(id) {
    debug("centerWindow('" + id + "')");

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

function getWindow(id) {   // this exists only for readability
    debug("getWindow('" + id + "')");
    return document.getElementById(id);
}

function destroyWindow(id) {
    debug("destroyWindow('" + id + "')");

    if(!getWindow(id)) {
        error("window '" + id + "' doesn't exist");
        return;
    }

    document.getElementById(id).remove();

    windowCount--;
}

/* window body content manager */
function dialog(id, text, buttonText) {    // creates a standard dialog with text and one button that closes it
    debug("dialog('" + id + "', '" + text + "', '" + buttonText + "')");

    const w = document.getElementById(id);
    if(!w) {
        error("window '" + id + "' doesn't exist");
        return;
    }

    const content = w.children[1];
    content.innerHTML = parseMd(text);

    const container = document.createElement("div");
    container.classList.add("buttonContainer");

    const button = document.createElement("button");
    button.innerText = buttonText;

    button.onclick = function() {
        destroyWindow(id);
    };

    container.appendChild(button);
    content.appendChild(container);
}

function yesNo(id, text, handler) {    // creates a yes/no dialog box that then calls handler() with the choice
    // TODO
}

/* these functions are for non-standard dialog boxes */
function createText(id, text) {    // adds markdown text to a window that already exists
    debug("createText('" + id + "', '" + text + "')");

    const w = document.getElementById(id);
    if(!w) {
        error("window '" + id + "' doesn't exist");
        return;
    }

    const content = w.children[1];
    content.innerHTML += parseMd(text);
}

function createLink(id, text, handler) {   // creates a link that runs a handler on click
    debug("createLink('" + id + "', '" + text + "', " + handler + ")");

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

function createOutlink(id, text, url) {    // creates a link that opens another page
    debug("createOutlink('" + id + "', '" + text + "', '" + url + "')");

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
function createImage(id, url, alt, w, h, align) {
    debug("createImage('" + id + "', '" + url + "', '" + alt + "', " + w + ", " + h + ", " + align + ")");

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
var heartMinx, heartMiny, heartMaxx, heartMaxy;
var saturnMinx, saturnMiny, saturnMaxx, saturnMaxy;

function moveBackground(e) {
    const heart = document.getElementById("heart");
    const saturn = document.getElementById("saturn");

    var nx, ny;

    nx = heart.offsetLeft + (e.movementX/30);
    ny = heart.offsetTop + (e.movementY/30);
    if(nx > heartMaxx) nx = heartMaxx;
    if(nx < heartMinx) nx = heartMinx;
    if(ny > heartMaxy) ny = heartMaxy;
    if(ny < heartMiny) ny = heartMiny;
    heart.style.left = nx + "px";
    heart.style.top = ny + "px";

    nx = saturn.offsetLeft - (e.movementX/25);
    ny = saturn.offsetTop - (e.movementY/25);
    if(nx > saturnMaxx) nx = saturnMaxx;
    if(nx < saturnMinx) nx = saturnMinx;
    if(ny > saturnMaxy) ny = saturnMaxy;
    if(ny < saturnMiny) ny = saturnMiny;
    saturn.style.left = nx + "px";
    saturn.style.top = ny + "px";
}

window.onload = function() {
    const heart = document.getElementById("heart");
    const saturn = document.getElementById("saturn");

    heartMinx = heart.offsetLeft;
    heartMaxx = (window.innerWidth/2) - (heart.offsetWidth);
    heartMaxy = heart.offsetTop;
    heartMiny = (window.innerHeight/2) - (heart.offsetHeight/2);

    saturnMaxx = saturn.offsetLeft;
    saturnMinx = (window.innerWidth/2) - (saturn.offsetWidth);
    saturnMiny = saturn.offsetTop;
    saturnMaxy = (window.innerHeight/2) - (saturn.offsetHeight/2);

    window.onmouseup = function() {
        draggedWindow = null;
    };

    window.onmousemove = function(e) {
        handleDrag(e);
        moveBackground(e);
    };

    appMain();
};
