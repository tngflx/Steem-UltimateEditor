import medEmbeds from '../embeds'
const cheerio = require('cheerio');

export async function medInstEmbed(body) {
    var that = this;
    const c$ = cheerio.load(body);
    let doneHTML;

    const Reg = {
        youTubeId: /(?:(?:youtube.com\/watch\?v=)|(?:youtu.be\/)|(?:youtube.com\/embed\/))([A-Za-z0-9\_\-]+)/gi,
        vimeo: /https?:\/\/(?:vimeo.com\/|player.vimeo.com\/video\/)([0-9]+)\/*/g,
        vimeoId: /(?:vimeo.com\/|player.vimeo.com\/video\/)([0-9]+)/g
    }

    let filtVideolink = c$('p').filter((i, el) => {
        return c$(el).text().match(Reg.youTubeId)
    })

    //if video links are found proceed
    if (filtVideolink.length > 0) {
        return new Promise((resolve, reject) => {
            filtVideolink.each((i, el) => {
                let url = c$(el).text()
                $.support.cors = true;

                if (c$(el).parentsUntil('.medium-insert-embeds').length > 0) {
                    return;
                }

                    $.ajax({
                        crossDomain: true,
                        cache: false,
                        url: 'http://medium.iframe.ly/api/oembed?iframe=1',
                        dataType: 'json',
                        data: {
                            url: url
                        },
                        success: function (data) {
                            var html = data && data.html;

                            if (!html) {
                                // Prevent render empty embed.
                                $.proxy(that, 'convertBadEmbed', url)();
                                return;
                            }

                            embed(html, el);
                            doneHTML = c$.html();
                            resolve(doneHTML);

                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            var responseJSON = (function () {
                                try {
                                    return JSON.parse(jqXHR.responseText);
                                } catch (e) { }
                            })();

                            if (typeof window.console !== 'undefined') {
                                window.console.log((responseJSON && responseJSON.error) || jqXHR.status || errorThrown.message);
                            } else {
                                window.alert('Error requesting media from ' + that.options.oembedProxy + ' to insert: ' + errorThrown + ' (response status: ' + jqXHR.status + ')');
                            }

                            const html = `<img src="./img/404.jpg"/>`
                            const template = window.MediumInsert.Templates['src/js/templates/embeds-wrapper.hbs']({
                                html: html
                            });
                            c$(el).replaceWith(template)
                            resolve(c$.html())
                        }
                    })
            })
        })
    } else {
        return c$.html();
    }

    function embed(html, el) {

        if (!html) {
            alert('Incorrect URL format specified');
            return false;
        } else {

            const template = window.MediumInsert.Templates['src/js/templates/embeds-wrapper.hbs']({
                html: html
            });
            c$(el).replaceWith(template)

            //this.core.triggerInput();

        }
    };
};
//youTubeId: /(?:(?:youtube.com\/watch\?v=)|(?:youtu.be\/)|(?:youtube.com\/embed\/))([A-Za-z0-9\_\-]+)/i,
//    vimeo: /https?:\/\/(?:vimeo.com\/|player.vimeo.com\/video\/)([0-9]+)\/*/,
//        vimeoId: /(?:vimeo.com\/|player.vimeo.com\/video\/)([0-9]+)/,
//            // simpleLink: new RegExp(`<a href="(.*)">(.*)<\/a>`, 'ig'),
//            ipfsPrefix: /(https?:\/\/.*)?\/ipfs/i,
