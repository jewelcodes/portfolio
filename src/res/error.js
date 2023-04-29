
/* epic portfolio website
   jewel, 2022 */

const clientErrors = [ 
    "The server cannot handle this request due to it being malformed.", // 400
    "This part of the site requires logging in.",   // 401
    "Payment required.",    // 402
    "Access to this part of the site is forbidden.",    // 403
    "The resource requested does not exist.",   // 404
    "The request method used is not allowed."   // 405
];

const serverErrors = [
    "Internal server misconfiguration; please try again later.",    // 500
    "Client request is not implemented by the server.",     // 501
    "Bad gateway/proxy.",   // 502
    "The service is currently unavailable.",    // 503
    "Gateway timed out.",   // 504
    "HTTP version of the client is not implemented by the server."  // 505
];

function appMain() {
    addMenuItem("Home", function() { window.location = "/"; });

    code = document.getElementById("code").value;
    var title, text;

    title = "Error " + code;

    if(code >= 400 && code <= 405) {
        text = clientErrors[code-400];
    } else if(code >= 500 && code <= 505) {
        text = serverErrors[code-500];
    } else {
        title = "Unhandled error " + code;
        text = "An undefined error has occured. This should not normally be possible.";
    }

    createWindow("error", title, 29, -1, -1, -1);
    createText("error", text);
    createOutlink("error", "Go back home", "/");
    centerWindow("error");
    showWindow("error");
}
