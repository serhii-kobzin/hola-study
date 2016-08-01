function $(selector) {
    var elements = [];

    var sel = selector.trim();
    switch (selector.charAt(0)) {
        case '#':
            elements[0] = document.getElementById(sel.substring(1));
            break;
        case '.':
            elements = document.getElementsByClassName(sel.substring(1));
            break;
        default:
            elements = document.getElementsByTagName(sel);
            break;
    }

    elements.html = function (htmlString) {
        if (!htmlString) {
            return elements[0].innerHTML;
        }
        for (var i = 0; i < elements.length; ++i) {
            elements[i].innerHTML = htmlString;
        }
    };

    return elements;
}
