
/* epic portfolio website
   jewel, 2022 */

// minimalistic markdown parser

function parseMd(md) {     // markdown to html
    var isBold = false;
    var isItalic = false;
    var lineBreak = true;     // whether or not the last char was \n
    var listItem = false;
    var list = false;
    var isImage = false;

    var headingLevel = 0;      // 0 = none, 1-5 for h1 - h5

    var output = new String();
    var linkText = new String();
    var linkUrl = new String();

    output = "<p>";

    for(var i = 0; i < md.length; i++) {
        if(md[i] == '\n') {
            if(lineBreak) {
                // previous char was also a line break, start a new paragraph or end a list
                if(list) {
                    list = false;
                    output += "</ul>";
                    debug("ended list");
                } else {
                    output += "</p><p>";
                }
            } else if(headingLevel != 0) {
                output += "</h" + headingLevel + "><p>";
                headingLevel = 0;
            } else if(listItem) {
                debug("list item newline");
                output += "</li>";
                listItem = false;
            } else {
                output += "<br>";   // normal line breaks
            }
            lineBreak = true;
        } else if(md[i] == '*') {
            // bold and italics and lists
            if((i+1) <= md.length) {
                if(md[i+1] == '*') {
                    isItalic = !isItalic;
                    i++;    // skip
                } else if(md[i+1] == ' ') {
                    // list
                    if(!list) {
                        output += "<ul>";
                        list = true;
                    }

                    listItem = true;
                    output += "<li>";

                    i++;    // skip
                } else {
                    isBold = !isBold;
                }
            } else {
                isBold = !isBold;
            }

            if(isBold) output += "<strong>";
            else output += "</strong>";

            if(isItalic) output += "<em>";
            else output += "</em>";
        } else if(md[i] == '[') {
            // potential start of a link's text OR an image
            linkText = "";
            linkUrl = "";

            i++;    // skip opening

            for(; md[i] != ']' && i < md.length; i++) {
                linkText += md[i];
            }

            if((i+1) >= md.length || md[i+1] != '(') {
                // not a link/image
                if(!isImage) output += "!";
                output += "[" + linkText + "]";
            } else {
                // this is a link/image
                //debug("link text: " + linkText);

                // now we copy the link's URL
                i += 2;
                for(; md[i] != ')' && i < md.length; i++) {
                    linkUrl += md[i];
                }

                //debug("link url: " + linkUrl);
                if(!isImage) {
                    // link
                    if(linkUrl[0] == 'b' && linkUrl[1] == 'p' && linkUrl[2] == ':') {
                        // blog post
                        output += "<a onclick=\"openBlogPost('" + linkUrl.substring(3) + "')\">" + linkText + "</a>";
                    } else {
                        // normal link
                        output += "<a target=\"_blank\" href=\"" + linkUrl + "\">" + linkText + "</a>";
                    }
                } else {
                    // image
                    output += "</p><div class='mdImageContainer'>";
                    output += "<img src='" + linkUrl + "' alt='" + linkText + "'>";
                    output += "<br>";
                    output += "<em>" + linkText + "</em>";
                    output += "</div><p>";
                    isImage = false;
                }
            }
        } else if(md[i] == '&') {
            output += "&amp;";
            lineBreak = false;
        } else if(md[i] == '<') {
            output += "&lt;";
            lineBreak = false;
        } else if(md[i] == '>') {
            output += "&gt;";
            lineBreak = false;
        } else if(md[i] == '#' && lineBreak) {
            // headings - h1 through h5
            lineBreak = false;
            output += "</p>";

            headingLevel = 1;

            i++;
            for(; md[i] == '#' && headingLevel < 6; i++) {
                headingLevel++;
            }

            output += "<h" + headingLevel + ">";
        } else if(md[i] == '!') {   // potential image
            if(md[i+1] == '[') {
                isImage = true;
            } else {
                isImage = false;
                output += md[i];
            }
            lineBreak = false;
        } else {
            // normal character
            output += md[i];
            lineBreak = false;
        }
    }

    if(isBold) output += "</strong>";
    if(isItalic) output += "</em>";
    if(listItem) output += "</li>";
    if(list) output += "</ul>";

    output += "</p>";
    return output;
}