(function () {
    const templates = window.MediumInsert.Templates;
    const converter = new showdown.Converter();
    const link = 'https://steemit.com/';

    //Note get_content_replies is using steem bc provided id, due to same permlink can occur for multiple replies **DON'T CONFUSE DATAID AND ID**
    $('.scroller,#unreplied').click(async function (e) {
        const dataID = '#' + $(e.target).parent().parent().attr('id');
        const root_author = $(dataID).data().root_author;//This is the author of the root branch
        const present_author = $(dataID).data().parent_author;
        const present_id = $(dataID).data().id;
        const root_title = $(dataID).data().root_title;

        switch (e.target.classList[1]) {
            case ('fa-reply'):
                $('.avatar_wrap').html(root_title).attr('href', link + `@${root_author}/${root_permlink}`);

                //Get replies from root post together with all childrens
                await client.sendAsync('get_content_replies', [root_author, root_permlink]).then((z) => {
                    z = z.reverse();

                    //Filter to get only posts thaat have childrens
                    let repliesWchild = z.filter((i) => {
                        return i.root_children > 0;
                    });

                    //Rendering main replies from current post with no branches
                    z.forEach((r) => {
                        let { author, body, root_depth, permlink, id, root_children, replies, timestamp, voteweight } = r;
                        let { backgroundImage } = Avatar(author, 44);
                        body = converter.makeHtml(body);


                        //Message_base is true
                        $(templates['src/js/templates/not-replymodal.hbs']({
                            author: author,
                            profilelink: link + `@${author}`,
                            dataID: id,
                            parent_author: parent_author,
                            parent_perm: parent_permlink
                        })).appendTo('.message');

                    });

                    ResizeAllImages('.message_text');

                    if (depth <= 1 && present_id && present_permlink) {
                        document.getElementById(`${present_id}`).scrollIntoView({ behavior: 'smooth' });
                        $(`#${present_id}`).fadehighlight();
                    }

                    //If current notification has depth of more than 1 means they are nested replies
                    else if (depth > 1) {

                        //if author_depth = 2,then root_author.replies.depth==2, then we have a match
                        // And from this route, we can do depth -1 or +1  to get the children or parent
                        //Deep search into replies array for matched permlink (recursively)
                        const nested_reply = [];

                        function getPerm(arr) {
                            if (arr && arr.permlink === parent_permlink) return arr;

                            let result;
                            for (let reply of arr.replies) {
                                result = getPerm(reply);
                            }
                            return null;
                        }

                        //Push only when data is available, eliminate all null data
                        repliesWchild.forEach((replyWchild) => {
                            let data = getPerm(replyWchild)
                                nested_reply.push(data);
                            }
                        });

                        //Rendering children comment
                        let { author, body, permlink, id } = nested_reply[0]
                        //Rendering parent comment
                        let root_perm = nested_reply[0].permlink;
                        let { backgroundImage } = Avatar(author, 44);

                        if (root_perm === undefined || null) {
                            //Appending to matched permlink div tag
                            let full_path = getObjectPath(parent_permlink, repliesWchild)
                            let array_num = full_path.slice(0, 1);
                            let root_perm = repliesWchild[array_num].permlink;
                            console.log(full_path);
                            renderNotif();
                        } else if (root_perm) {
                            renderNotif();
                        }

                        async function renderNotif() {
                            
                            //Message_depth is true

                            await $(templates['src/js/templates/not-replymodal.hbs']({
                                author: author,
                                profilelink: author,
                                avatarsrc: backgroundImage,
                            })).insertAfter(`[permlink="${root_perm}"]>.message_textbox`);

                            ResizeAllImages('.message_text');

                        }

                        //Full path is returned when permlink is matched
                        let getObjectPath = function (search, obj) {

                            let res = false;

                            for (let key in obj) {
                                if (obj.hasOwnProperty(key)) {
                                    if (typeof obj[key] == "object") { //If value is an object, call getObjectPath again!
                                        if (res = getObjectPath(search, obj[key])) {
                                            if (!isNaN(parseInt(key))) {
                                                key = "[" + key + "]";
                                            }
                                            res = key + "." + res;
                                            return res;
                                        }
                                    } else if (search === obj[key]) {
                                        return key; //Value found!
                                    }
                                }
                            }

                            return res;
                        }

                    }

                })

                break;

            case ('fa-transfer'):
                console.log('hi');






        }
    });

    let parent, com_pauthor, com_pperm, com_author, com_perm, com_body, com_depth;

    $('.message').click(async function (e) {
        e.preventDefault();
        //Identical data to message_depth, not a redundancy
        parent = $(e.target).parent().parent();//Navigate to button class where i stored permlink data
        com_pauthor = parent.attr('parent_author');
        com_pperm = parent.attr('parent_perm');
        com_author = parent.attr('author');
        com_perm = parent.attr('permlink');
        com_depth = parent.attr('depth');
        com_body = $('#enterMessage').val()
        switch (e.target.classList[1]) {
            case ('fa-reply'):

                $('#enter_recipient').html(`Replying to user : ${com_author}`)

                break;

            case ('fa-chevron-circle-up'):
                sc2api.vote(
                    currentAuthUser, // Voter
                    com_author, // Author
                    com_perm,
                    1000, // Weight (10000 = 100%)
                    function (err, result) {
                        console.log(err, result);
                    }
                );
                break;

            case ('fa-flag'):
                sc2api.vote(
                    currentAuthUser, // Voter
                    com_author, // Author
                    com_perm,
                    -1000, // Weight (10000 = 100%)
                    function (err, result) {
                        console.log(err, result);
                    }
                );
                break;

        }


    })

    $('.enter').click(async function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
        $('.button_id_submit').html('<i class="fa fa-spinner fa-spin" aria-hidden="true"></i>');
        await sc2api.comment(
            com_author, // Author of recipient
            com_perm, // Recipient's permlink
            currentAuthUser, // Author
            com_pperm, // Paren permlink
            '', // Title
            com_body, // Body
            { tags: ['notif-reply'], app: 'steemultedt' }, // Json Metadata
            async function (err, result) {
                console.log(err, result);
                if (result && !err) {
                    //Stop spinner
                    $('.button_id_submit').html('<i class="fa fa-paper-plane" aria-hidden="true"></i>');
                    let new_perm;
                    await client.sendAsync('get_content_replies', [com_author, com_perm]).then((z) => {
                        z.forEach((r) => {
                            let { author, body, root_depth, permlink, id, replies, timestamp, voteweight } = r;
                            if (author === currentAuthUser) {
                                let { backgroundImage } = Avatar(author, 44);
                                let test = $(`.message>[permlink="${com_perm}"]`)
                                body = converter.makeHtml(body);
                                new_perm = permlink;

                                    $(templates['src/js/templates/not-replymodal.hbs']({
                                        author: author,
                                        profilelink: link + `@${author}`,
                                        avatarsrc: backgroundImage,
                                        msgtext: body,
                                        permlink: permlink,
                                        depth: root_depth,
                                        children: root_children,
                                        message_depth: true,
                                        dataID: id,
                                    })).insertAfter(`.message>[permlink="${com_perm}"]`);
                                }
                            }

                            ResizeAllImages('.message_text');

                        })
                    })
                    await Promise.all($(`.message_depth[permlink="${new_perm}"]`).scrollIntoView({ behavior: 'smooth' }),
                        $(`.message_depth[permlink="${new_perm}"]`).fadehighlight())
                }
            }
        );
    })

})();
