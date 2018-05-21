var allContents, x, editor;

$("#post").click(function () {
    Replace(editor);

})

//Saving to localstorage
function savDraft() {
    updateContent();

    const data = {
        author: author,
        title: title,
        body: draft,
        footer: footer,
        permlink: tags
    }

    //JSON extension 
    JSON.extn = {

        format: '\t',

        replacer: function (key, value) {
            function trim(text) {
                var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
                text = (text == null)
                    ? ""
                    : (text + "").replace(rtrim, "");
                return text;
            }
            return typeof this[key] === "string" ? trim(value) : value;
        },
        stringify: function (obj, replacer, space) {
            return JSON.stringify(obj, replacer, space);
        }, 

        trimedStringify: function (obj) {
            return this.stringify(obj, this.replacer);
        },
    }
    //Saving data to localstorage
    localStorage.setItem("draft", JSON.extn.trimedStringify(data, null, 0));
    //console.log("Saved draft")
}

function GetDraft() {
    localStorage.getItem('draft');
}

function Replace(editor2) {
    editor2 = editor;
    allContents = editor.serialize();
    x = allContents[Object.keys(allContents)[0]].value;
    var reg1 = /medium-insert-images.*(left|right)/g,
        reg2 = /(<)\/?(figcaption>)|(<)\/?(figure>)/g,
        reg3 = /[^<\S >]\s/g,
        reg4 = /\\"/g;
    direction = "pull-$1";

    x = x.replace(reg1, direction);
    x = x.replace(reg3, "");
    x = x.replace(reg2, "");
    x = x.replace(reg4, '"');

    FiltrBody = x;
    if (checkDraft() == true) {
        PostBenef();
    }
}



function PostBenef() {
    checkProfile();
    updateContent();

    var beneficiaries = [];
    beneficiaries.push({
        account: '',
        weight: 100 * 15
    });

    var operations = [
        ['comment',
            {
                parent_author: '',
                parent_permlink: tags[0],
                author: author,
                permlink: permlink,
                title: title,
                body: FiltrBody,
                json_metadata: JSON.stringify({
                    tags: tags,
                    app: 'steemultedt.app'
                })
            }
        ];

    console.log(operations);

    sc2api.broadcast(
        operations,
        function (e, r) {
            if (e) {
                console.log(e.error, r);
                if (e.error !== undefined) {
                    console.log(e);
                    alert('The request was not succesfull. Please make sure that you logged in via SteemConnect, and then you didn\'t post within the last 5 minutes. If the problem persists please contact @tngflx on Discord. Error msg:' + e.error_description);
                }
            } else {
                alert('Successfully posted on STEEM blockchain!')
            }
        });
}
