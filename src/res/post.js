
/* epic portfolio website
   jewel, 2022 */

function openUploader() {

}

var validateCounter;
function validatePost(frame) {
    createWindow("validating", "Post Upload", 25, -1, -1, -1);
    createText("validating", "Uploading post...");
    showWindow("validating");

    validateCounter = 0;
    let interval = setInterval(function() {
        if(frame.contentWindow.document.body.innerText) {
            var status = new String(frame.contentWindow.document.body.innerText.toString());
            clearInterval(interval);
            clearWindow("validating");
            if(status.substring(0,2) == "ok") {
                dialog("validating", "Post successful.", "OK");
            } else {
                dialog("validating", "An error occured while posting.", "OK");
            }

            centerWindow("validating");
        }

        validateCounter++;
        if(validateCounter >= 10) {
            dialog("validating", "Timed out while posting; check your internet connection.", "OK");
            centerWindow("validating");
            clearInterval(interval);
        }
    }, 500);
}

async function appMain() {
    addMenuItem("Upload files", function() { openUploader(); });

    createWindow("post", "Create Post", 45, -1, 64, 64);
    createForm("post", "postForm", "POST", "/post/post.php", function(frame) { validatePost(frame); });
    createTextbox("postForm", "postTitle", "Post Title:");
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

