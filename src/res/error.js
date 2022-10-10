
/* epic portfolio website
   jewel, 2022 */

const clientErrors = [ 
    "The server cannot handle this request due to it being malformed.", // 400
    "This part of the site requires authentication.",   // 401
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
    "HTTP version of client is not implemented by the server."  // 505
];

function appMain() {
    addMenuItem("Home", function() { window.location = "/"; });

    code = document.getElementById("code").value;
    var title, text;

    if(code >= 400 && code <= 405) {
        title = "Client error " + code;
        text = clientErrors[code-400];
    } else if(code >= 500 && code <= 505) {
        title = "Server error " + code;
        text = serverErrors[code-500];
    } else {
        title = "Undefined error " + code;
        text = "An undefined error has occured. This should not normally be possible.";
    }

    createWindow("error", title, 28, -1, -1, -1);
    createText("error", text);
    centerWindow("error");
    showWindow("error");
}
