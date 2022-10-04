
/* epic portfolio website
   jewel, 2022 */

// minimalistic markdown parser

function parse_md(md) {     // markdown to html
    var is_bold = false;
    var is_italic = false;
    var line_break = true;     // whether or not the last char was \n
    var list_item = false;
    var list = false;

    var heading_level = 0;      // 0 = none, 1-5 for h1 - h5

    var output = new String();
    var link_text = new String();
    var link_url = new String();

    output = "<p>";

    for(var i = 0; i < md.length; i++) {
        if(md[i] == '\n') {
            if(line_break) {
                // previous char was also a line break, start a new paragraph or end a list
                if(list) {
                    list = false;
                    output += "</ul>";
                    debug("ended list");
                } else {
                    output += "</p><p>";
                }
            } else if(heading_level != 0) {
                output += "</h" + heading_level + "><p>";
                heading_level = 0;
            } else if(list_item) {
                debug("list item newline");
                output += "</li>";
                list_item = false;
            } else {
                output += "<br>";   // normal line breaks
            }
            line_break = true;
        } else if(md[i] == '*') {
            // bold and italics and lists
            if((i+1) <= md.length) {
                if(md[i+1] == '*') {
                    is_italic = !is_italic;
                    i++;    // skip
                } else if(md[i+1] == ' ') {
                    // list
                    if(!list) {
                        output += "<ul>";
                        list = true;
                    }

                    list_item = true;
                    output += "<li>";

                    i++;    // skip
                } else {
                    is_bold = !is_bold;
                }
            } else {
                is_bold = !is_bold;
            }

            if(is_bold) output += "<strong>";
            else output += "</strong>";

            if(is_italic) output += "<em>";
            else output += "</em>";
        } else if(md[i] == '[') {
            // potential start of a link's text
            link_text = "";
            link_url = "";

            i++;    // ksip opening

            for(; md[i] != ']' && i < md.length; i++) {
                link_text += md[i];
            }

            if((i+1) >= md.length || md[i+1] != '(') {
                // not a link
                output += "[" + link_text + "]";
            } else {
                // this is a link
                debug("link text: " + link_text);

                // now we copy the link's URL
                i += 2;
                for(; md[i] != ')' && i < md.length; i++) {
                    link_url += md[i];
                }

                debug("link url: " + link_url);

                if(link_url[0] == 'b' && link_url[1] == 'p' && link_url[2] == ':') {
                    // blog post
                    output += "<a onclick=\"blog_post('" + link_url.substring(3) + "')\">" + link_text + "</a>";
                } else {
                    // normal link
                    output += "<a target=\"_blank\" href=\"" + link_url + "\">" + link_text + "</a>";
                }
            }
        } else if(md[i] == '&') {
            output += "&amp;";
            line_break = false;
        } else if(md[i] == '<') {
            output += "&lt;";
            line_break = false;
        } else if(md[i] == '>') {
            output += "&gt;";
            line_break = false;
        } else if(md[i] == '#' && line_break) {
            // headings - h1 through h5
            line_break = false;
            output += "</p>";

            heading_level = 1;

            i++;
            for(; md[i] == '#' && heading_level < 6; i++) {
                heading_level++;
            }

            output += "<h" + heading_level + ">";
        } else {
            // normal character
            output += md[i];
            line_break = false;
        }
    }

    if(is_bold) output += "</strong>";
    if(is_italic) output += "</em>";
    if(list_item) output += "</li>";
    if(list) output += "</ul>";

    output += "</p>";
    return output;
}