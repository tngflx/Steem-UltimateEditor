var allContents, x, editor;

function Replace(editor2) {
    editor2 = editor;
    allContents = editor.serialize();
    x = allContents[Object.keys(allContents)[0]].value;
    var reg1 = /medium-insert-images.*(left|right)/g,
        reg2 = /(<)\/?(figcaption>)|(<)\/?(figure>)/g,
        reg3 = /[^<\S >]\s/g;
    direction = "pull-$1";

    x = x.replace(reg1, direction);
    x = x.replace(reg2, "");
    x = x.replace(reg3, "");
}

function storeBase64Image() {
    var pics = $(".medium-insert-images img[src*='data']");

    for (var i = 0; i < pics.length; i++) {
        var a = pics[i].currentSrc,
            b = a.replace(/data:image.*base64,/, ""),
            c = a.replace(/,(.*)/, "," + i);
        localStorage.setItem("Imgdata" + i, b);
    }
    alert(c);
}

function readBase64Image() {
    var pics = $(".medium-insert-images img[src*='data']");

}
