
/* epic portfolio website
   jewel, 2022 */

function getCookie(name) {
    let cookieName = name + "=";
    let cookies = decodeURIComponent(document.cookie).split(";");
    if(!cookies.length) return null;

    for(var i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while(cookie.charAt(0) == ' ') cookie = cookie.substring(1);

        if(cookie.search(cookieName) == 0) {
            let ret = cookie.substring(cookieName.length, cookie.length);
            while(ret.charAt(0) == ' ') ret = ret.substring(1);
            return ret;
        }
    }

    return null;
}

function setCookie(name, value) {
    document.cookie = name + "=" + value + ";";
}
