
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

    hideMenu();

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

    const taskbarButtons = document.getElementsByClassName("taskbarButton");
    for(var i = 0; i < taskbarButtons.length; i++) {
        if(taskbarButtons[i].id == id + "_button") {
            taskbarButtons[i].classList.add("buttonActive");
        } else {
            taskbarButtons[i].classList.remove("buttonActive");
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
        if(y < taskbarHeight) y = taskbarHeight;
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
    debug("createWindow('" + id + "', '" + title + "', " + w + ", " + h + ", " + x + ", " + y + ")");

    if(getWindow(id)) {
        error("window '" + id + "' already exists, bringing it to front");
        showWindow(id);
        return;
    }

    windowCount++;

    // window bare skeleton
    const e  = document.createElement("div");
    e.id = id;
    e.classList.add("window");
    e.style.zIndex = windowCount + 2;
    e.style.width = w + "vw";

    //if(h != -1) e.style.height = h + "vh";

    e.style.visibility = "hidden";  // need to manually use showWindow()

    // title bar
    const tContainer = document.createElement("div");
    tContainer.classList.add("title");

    const t = document.createElement("div");
    t.innerText = title;
    tContainer.appendChild(t);

    // close icon, fontawesome-dependent
    const close = document.createElement("i");
    close.classList.add("titleButton");
    close.classList.add("fa-solid");
    close.classList.add("fa-xmark");
    tContainer.appendChild(close);

    // basic event handlers
    e.onclick = function() {        // focus handler
        setActiveWindow(id);
    };

    t.onmousedown = function() {    // for dragging
        setActiveWindow(id);
        draggedWindow = id;
    };

    close.onclick = function() {    // close
        destroyWindow(id);
    }

    // window content
    const c = document.createElement("div");
    c.classList.add("content");

    if(h != -1) c.style.height = h + "vh";

    /*c.innerHTML = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";*/

    e.appendChild(tContainer);
    e.appendChild(c);

    // apparently you can only calculate elements' width/height if they're already in the DOM
    // so add it first and then position it
    document.body.appendChild(e);

    var maxx = window.innerWidth - e.offsetWidth;
    var maxy = window.innerHeight - e.offsetHeight;

    if((x == -1) || (y == -1)) {
        var nx = (window.innerWidth / 2) - (e.offsetWidth / 2);
        var ny = (window.innerHeight / 2) - (e.offsetHeight / 2);
        if(ny < taskbarHeight) ny = taskbarHeight;
        e.style.left = nx + "px";
        e.style.top = ny + "px";
    } else if(!x && !y) {
        // random position
        var nx = Math.random() * maxx;
        var ny = Math.random() * maxy;
        if(ny < taskbarHeight) ny = taskbarHeight;
        e.style.left = nx + "px";
        e.style.top = ny + "px";
    } else {
        e.style.left = x + "px";
        e.style.top = y + "px";
    }

    // add the window to the taskbar
    const button = document.createElement("button");
    button.id = id + "_button";
    button.classList.add("taskbarButton");
    button.innerText = title;
    button.onclick = function() { toggleWindow(id); };

    document.getElementById("taskbar").appendChild(button);
}

function showWindow(id) {
    debug("showWindow('" + id + "')");
    document.getElementById(id).style.visibility = "visible";

    setActiveWindow(id);
}

function hideWindow(id) {
    debug("hideWindow('" + id + "')");
    document.getElementById(id).style.visibility = "hidden";
    document.getElementById(id).children[0].classList.remove("titleActive");
    setActiveWindow(null);
}

function toggleWindow(id) {
    debug("toggleWindow('" + id + "')");

    if(document.getElementById(id).children[0].classList.contains("titleActive")) {
        hideWindow(id);
    } else {
        showWindow(id);
    }
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
    if(y < taskbarHeight) y = taskbarHeight;
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
    document.getElementById(id + "_button").remove();

    windowCount--;
}

function clearWindow(id) {
    debug("clearWindow('" + id + "')");

    const w = document.getElementById(id);
    if(!w) {
        error("window '" + id + "' doesn't exist");
        return;
    }

    w.children[1].innerHTML = "";
}

/* scrollbar implementation */
var activeScrollbar = null;

function updateScrollbarPosition(w) {
    const sbc = w.children[2];      // container
    const sb = sbc.children[0];     // moveable bar
    const c = w.children[1];        // window content

    if(activeScrollbar == sb) return;

    var currentScroll = c.scrollTop;
    var maxScroll = c.scrollHeight;
    var maxy = c.offsetHeight - sb.offsetHeight;
    var ratio = currentScroll/maxScroll;

    var y = ratio * sbc.offsetHeight;
    if(y < 0) y = 0;
    if(y > maxy) y = maxy;
    sb.style.top = y + "px";
}

function handleScrollDrag(e) {
    if(!(e.buttons & 1) || !activeScrollbar) {     // primary button
        activeScrollbar = null;
        return;
    }

    // window -> scrollbar container -> scrollbar
    // activeScrollbar refers to the scrollbar itself
    const container = activeScrollbar.parentNode;
    const content = container.previousElementSibling;

    var y = parseInt(activeScrollbar.style.top);
    var maxy = container.offsetHeight - activeScrollbar.offsetHeight;
    var maxScroll = content.scrollHeight - content.offsetHeight;

    y += e.movementY;
    if(y > maxy) y = maxy;
    if(y < 0) y = 0;

    //debug("old scrolltop: " + content.scrollTop + ", scroll height: " + content.scrollHeight);
    //debug("y/maxy ratio = " + y/maxy);

    activeScrollbar.style.top = y + "px";
    content.scrollTop = Math.floor((y / maxy) * maxScroll);
}

function setScrollbarHeight(w) {
    // determine scrollbar height
    const content = w.children[1];
    sb = w.children[2].children[0];

    if(!sb) return;

    var visible = content.offsetHeight/content.scrollHeight;
    if(visible > 1) visible = 1;

    var height = visible * content.offsetHeight;
    if(height > content.offsetHeight) height = content.offsetHeight;
    if(height < 24) height = 24;
    sb.style.height = height + "px";
}

function updateScrollbars() {
    // updates all scrollbars because there's no standard way to monitor
    // element.scrollHeight, so we need to run this every interval :shrug:
    const contents = document.getElementsByClassName("contentScrollable");
    if(!contents.length) return;

    for(var i = 0; i < contents.length; i++) {
        let w = contents[i].parentNode;
        setScrollbarHeight(w);
    }
}

function setScrollable(id, scrollable) {    // this only works for windows with a preset height
    debug("setScrollable('" + id + "', " + scrollable + ")");

    const w = document.getElementById(id);
    if(!w) {
        error("window '" + id + "' doesn't exist");
        return;
    }

    const content = w.children[1];

    // windows contain 2 or 3 elements: title bar, content container, and optionally scrollbar
    if(scrollable) {
        // add a scrollbar
        if(w.children.length == 3) {
            error("window '" + id + "' is already scrollable");
            return;
        }

        const sbc = document.createElement("div");
        sbc.classList.add("scrollbarContainer");
        sbc.style.height = "calc(" + content.style.height + " + 24px)";

        // if the content is not large enough to scroll through just add a scrollbar container
        if(content.scrollHeight <= content.offsetHeight) {
            content.classList.add("contentScrollable");
            w.appendChild(sbc);
            return;
        }

        const sb = document.createElement("div");
        sb.classList.add("scrollbar");

        sbc.appendChild(sb);
        w.appendChild(sbc);

        content.classList.add("contentScrollable");

        setScrollbarHeight(w);

        // event handlers
        content.onscroll = function() { updateScrollbarPosition(w); };
        sb.onmousedown = function() { activeScrollbar = sb; };
        //sb.onmouseup = function() { activeScrollbar = null; };
        updateScrollbarPosition(w);
    } else {
        // TODO: remove scrollbar
        error("unimplemented remove scrollbar");
    }
}

/* taskbar and menu implementation */
var taskbarHeight;

function toggleMenu() {
    if(document.getElementById("menu").style.display == "block") {
        document.getElementById("menu").style.display = "none";
        document.getElementById("menuButton").classList.remove("buttonActive");
    } else {
        document.getElementById("menu").style.display = "block";
        document.getElementById("menuButton").classList.add("buttonActive");
    }
}

function hideMenu() {
    document.getElementById("menu").style.display = "none";
    document.getElementById("menuButton").classList.remove("buttonActive");
}

function addMenuItem(text, handler) {
    const menu = document.getElementById("menu");

    const i = document.createElement("li");
    i.innerText = text;
    i.onclick = function() {
        hideMenu();
        handler();
    };

    menu.appendChild(i);
}

function createTaskbar() {
    debug("createTaskbar()");

    const taskbar = document.createElement("div")
    taskbar.id = "taskbar";

    const menuButton = document.createElement("button");
    menuButton.id = "menuButton";
    menuButton.innerText = "Menu";
    menuButton.style.fontWeight = "bold";
    //menuButton.style.marginRight = "16px";

    taskbar.appendChild(menuButton);

    document.body.appendChild(taskbar);
    taskbarHeight = taskbar.offsetHeight;

    // menu
    const menu = document.createElement("ul");
    menu.id = "menu";
    menu.style.top = taskbarHeight + "px";
    menu.style.display = "none";

    document.body.appendChild(menu);

    //menu.innerHTML = "<li>test</li><li>test 2</li>"

    menuButton.onclick = function() { toggleMenu(); };
    //menuButton.onblur = function() { hideMenu(); };
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

/* forms -- this is used in the uploader */
function createForm(winId, formId, formMethod, formAction, submitHandler) {
    const w = document.getElementById(winId);
    if(!w) {
        error("window '" + winId + "' doesn't exist");
        return;
    }

    const content = w.children[1];

    const frame = document.createElement("iframe");
    frame.name = formId + "Frame";

    const f = document.createElement("form");
    f.id = formId;
    f.method = formMethod;
    f.action = formAction;
    f.autocomplete = "off";
    f.target = formId + "Frame";
    f.enctype = "multipart/form-data";
    f.onsubmit = function() { submitHandler(frame); };

    content.appendChild(frame);
    content.appendChild(f);
}

function createTextarea(id, name, label) {
    const f = document.getElementById(id);
    if(!f) {
        error("form '" + id + "' doesn't exist");
        return;
    }

    const l = document.createElement("label");
    l.setAttributeNS(null, "for", name);
    l.innerText = label;
    f.appendChild(l);

    const ta = document.createElement("textarea");
    ta.name = name;
    ta.id = name;
    ta.spellcheck = false;
    f.appendChild(ta);
}

function createTextbox(id, name, label) {
    const f = document.getElementById(id);
    if(!f) {
        error("form '" + id + "' doesn't exist");
        return;
    }

    const l = document.createElement("label");
    l.setAttributeNS(null, "for", name);
    l.innerText = label;
    f.appendChild(l);

    const tb = document.createElement("input");
    tb.type = "text";
    tb.name = name;
    tb.id = name;
    tb.spellcheck = false;
    f.appendChild(tb);
}

function createSubmitButton(id, text) {
    const f = document.getElementById(id);
    if(!f) {
        error("form '" + id + "' doesn't exist");
        return;
    }

    const container = document.createElement("div");
    container.classList.add("buttonContainer");

    const button = document.createElement("input");
    button.type = "submit";
    button.value = text;

    container.appendChild(button);
    f.appendChild(container);
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

    c.appendChild(i);
    content.appendChild(c);

    i.style.width = Math.floor((w/100) * i.parentNode.offsetWidth) + "px";
    if(h) i.style.height = Math.floor((i.offsetWidth - 4) * (h/w)) + "px";
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
    // calculate boundaries for the heart and saturn background
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

    createTaskbar();

    window.onmouseup = function() {
        draggedWindow = null;
    };

    window.onmousemove = function(e) {
        handleDrag(e);
        handleScrollDrag(e);
        moveBackground(e);
    };

    setInterval(function() { updateScrollbars(); }, 100);

    appMain();
};
