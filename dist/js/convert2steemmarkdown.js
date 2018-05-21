var allContents, x, editor;

function savDraft() {
    var setItem = () => {
        console.log("saveitem");
        localStorage.setItem("draft.title", title);
        localStorage.setItem("draft.body", draft);
    };
    window.setInterval(() => { setItem() }, 10000);
}

//resDraft = localStorage.getItem("draft")
if (resDraft) {
    $('#container').html(resDraft);
}

$("#post").click(function () {
    Replace(editor);

})

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
