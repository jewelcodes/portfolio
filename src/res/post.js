
/* epic portfolio website
   jewel, 2022 */

var validateUploadCounter;
function validateUpload(frame) {
    createWindow("validateUpload", "File Uploader", 40, -1, -1, -1);
    clearWindow("validateUpload");
    createText("validateUpload", "Uploading file...");
    showWindow("validateUpload");

    validateUploadCounter = 0;
    let interval = setInterval(function() {
        if(frame.contentWindow.document.body.innerText) {
            var ret = new String(frame.contentWindow.document.body.innerText.toString());
            clearInterval(interval);
            clearWindow("validateUpload");
            if(ret.substring(0,2) == "ok") {
                navigator.clipboard.writeText(ret.substring(3));
                dialog("validateUpload", "File has been uploaded and its path has been copied to the clipboard.\n\n*" + ret.substring(3) + "*", "OK");
            } else {
                dialog("validateUpload", "An error occured while uploading.", "OK");
            }

            centerWindow("validateUpload");
        }

        validateUploadCounter++;
        if(validateUploadCounter > 10) {    // up to 15 seconds
            dialog("validateUpload", "Timed out while uploading; check your internet connection.", "OK");
            centerWindow("validateUpload");
            clearInterval(interval);
        }
    }, 500);

    return true;
}

function openUploader() {
    if(getWindow("uploader")) {
        setActiveWindow("uploader");
        return;
    }

    createWindow("uploader", "File Uploader", 30, -1, 0, 0);
    createForm("uploader", "uploadForm", "POST", "/post/upload.php", function(frame) { validateUpload(frame); });
    createFileUploader("uploadForm", "file", "", null, false);
    createSubmitButton("uploadForm", "Upload");

    randomizeWindowPosition("uploader");
    showWindow("uploader");
}

var validatePostCounter;
function validatePost(frame) {
    createWindow("validatePost", "Post Upload", 25, -1, -1, -1);
    clearWindow("validatePost");
    createText("validatePost", "Uploading post...");
    showWindow("validatePost");

    validatePostCounter = 0;
    let interval = setInterval(function() {
        if(frame.contentWindow.document.body.innerText) {
            var status = new String(frame.contentWindow.document.body.innerText.toString());
            clearInterval(interval);
            clearWindow("validatePost");
            if(status.substring(0,2) == "ok") {
                dialog("validatePost", "Post successful.", "OK");
            } else {
                dialog("validatePost", "An error occured while posting.", "OK");
            }

            centerWindow("validatePost");
        }

        validatePostCounter++;
        if(validatePostCounter >= 10) {     // up to 5 seconds
            dialog("validatePost", "Timed out while posting; check your internet connection.", "OK");
            centerWindow("validatePost");
            clearInterval(interval);
        }
    }, 500);

    return true;
}

async function appMain() {
    addMenuItem("File Uploader", function() { openUploader(); });

    createWindow("post", "Create Post", 45, -1, 64, 64);
    createForm("post", "postForm", "POST", "/post/post.php", function(frame) { validatePost(frame); });
    createTextbox("postForm", "postTitle", "Post Title:", true);
    createTextarea("postForm", "postBody", "Post Body (Markdown):");
    createSubmitButton("postForm", "Post");

    createWindow("preview", "Post Preview", 45, 70, 0, 0);
    setScrollable("preview", true);
    createText("preview", "Start typing in the next window and your post will automatically be previewed here.");
    showWindow("preview");
    showWindow("post");

    setInterval(function() {
        clearWindow("preview");

        if(document.getElementById("postTitle").value || document.getElementById("postBody").value) {
            let text = "# " + document.getElementById("postTitle").value + "\n\n";
            text += "**- just now**\n\n";
            text += document.getElementById("postBody").value;
            createText("preview", text);
        } else {
            createText("preview", "Start typing in the next window and your post will automatically be previewed here.");
        }
    }, 2000)
}

