 const cheerio = require('cheerio');

export function ResizeAllImages(selector) {
    $(selector).find('img').css({
        "display": "block",
        "max-width": "400px",
        "max-height": "400px",
        "width": "auto",
        "height": "auto"
    })
}

//if not wrapped in img src, manually wrap it
export function replaceURLWithImage(body) {
    const imageRegex = />(https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,}))))/gim;

    return body.replace(imageRegex, '><img src=\"$1\">')

}

export function medInsImage(body) {
    const c$ = cheerio.load(body);

    const pullLeft = c$('img').parent('[class="pull-left"]')
    const pullRight = c$('img').parent('[class="pull-right"]')
    const Img = c$('img')

    if (pullLeft) {
        c$(pullLeft).wrap(template).parent().parent().addClass('images-left')
        c$Unwrap(pullLeft.children())
    }

    if (pullRight) {
        c$(pullRight).wrap(template).parent().parent().addClass('images-right')
        c$Unwrap(pullRight.children())
    }

    if (Img) {
        //Removal of class left because don't want to create another template
        //c$(Img.children().children()).wrap(template)
    }
    
    const author_link = '/@' + get(content, 'author');
    let link = `/@${author}/${permlink}`;
    if (category) link = `/${category}${link}`;
    const body = get(content, 'body');
    let jsonMetadata = {};
    let image_link;
    try {
        jsonMetadata = JSON.parse(json_metadata);
        if (typeof jsonMetadata == 'string') {
            // At least one case where jsonMetadata was double-encoded: #895
            jsonMetadata = JSON.parse(jsonMetadata);
        }
        // First, attempt to find an image url in the json metadata
        if (jsonMetadata && jsonMetadata.image) {
            image_link = getValidImage(jsonMetadata.image);
        }
    } catch (error) {
        // console.error('Invalid json metadata string', json_metadata, 'in post', author, permlink);
    }

    // If nothing found in json metadata, parse body and check images/links
    if (!image_link) {
        let rtags;
        {
            const isHtml = /^<html>([\S\s]*)<\/html>$/.test(body);
            const htmlText = isHtml
                ? body
                : remarkable.render(
                      body.replace(
                          /<!--([\s\S]+?)(-->|$)/g,
                          '(html comment removed: $1)'
                      )
                  );
            rtags = HtmlReady(htmlText, { mutate: false });
        }

        [image_link] = Array.from(rtags.images);
    }
    

    function c$Unwrap(item) {
        c$(item).each(function () {
            var $p = c$(this).parent();
            c$(this).insertAfter(c$(this).parent());
            $p.remove()
        })
    }

    return c$.html()
}

