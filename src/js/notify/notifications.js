const templates = window.MediumInsert.Templates;

const wait = (ws, cb) => {
    setTimeout(() => {
        if (ws.readyState === 1) {
            if (cb !== null) cb();
        } else {
            wait(ws, cb);
        }
    }, 5);
};

class Client {
    constructor(address) {
        this.address = address;
        this.open = false;
        this.queue = {};
        this.pushnotif = () => { };
        this.id = 0;
        this.notifications = () => { };

        this.ws = new WebSocket(address);

        this.ws.addEventListener('message', (data) => {
            const message = JSON.parse(data.data);
                

            if (message.result) {
                if (message.result.hasOwnProperty('0')) {
                    renderNotif();
                }
            }

            if (message.type && message.result) {
                this.pushnotif(null, message.result);
                instNotif();
            }
            

            if (this.queue[message.id]) {
                this.queue[message.id](null, message.result);

            } else {
                this.notifications(null, message);
            }
        });

        this.ws.addEventListener('open', () => {
            this.open = true;
        });

        this.ws.addEventListener('close', () => {
            this.open = false;
        });
    }

    subscribe(cb) {
        this.notifications = cb;
    }

    send(message) {
        wait(this.ws, () => {
            this.ws.send(JSON.stringify(message));
        });
    }

    fetch_newNotif(cb) {
        this.pushnotif = cb;
    }

    call(method, params = [], cb) {
        this.id++;
        this.queue = cb;
        this.send({
            id: this.id,
            method: method,
            jsonrpc: '2.0',
            params: params,
        });
    }
}

const client = new Client('ws://localhost:3500/');

client.sendAsync = (message, params) => {
    return new Promise((resolve, reject) => {
        client.call( params, (err, result) => {
            if (err !== null) return reject(err);
            return resolve(result);
        });
    });
}

//if new notification arrived, call render to html
function instNotif() {
    client.fetch_newNotif((e, r) => {
        renderNotif(r);
    })
}

//Query for collection of notifications' history
client.sendAsync('get_notifications', [currentAuthUser]).then((result) => {
    renderNotif(result);
});

export default function getReplies(param1, param2) {
    return new Promise((resolve, reject) => {
        client.sendAsync('get_content_replies', [param1, param2]).then((r) => {
            return resolve(r);
        });
    })
}
//Rendering notification to html page
function renderNotif(notification) {

    for (var index in notification) {
        const { timestamp, author, id, parent_permlink, permlink, type } = notification[index];
        var { backgroundImage, minWidth, width, height } = Avatar(author, 44);
        const style = `min-width:${minWidth}; width:${width}; height:${height};`;
        const time = epochConv(timestamp);
        const link = 'https://steemit.com';
        updateBadge();
        switch (type) {
            case ('reply'):

                $(templates['src/js/templates/not-reply.hbs']({
                    link: link + `/@${currentAuthUser}/${parent_permlink}/#@${author}/${permlink}`,
                    style: style,
                    avatar: backgroundImage,
                    author: author,
                    timestamp: time,
                    body: `Commented on your post <b>${permlink}</b>`,
                    reply: true
                })).prependTo('.scroller');
                break;

            case ('mention'):
                const { is_root_post } = notification[index];
                //const linkm = `/@${author}/${permlink}`;
        
                $(templates['src/js/templates/not-reply.hbs']({
                    link: link + `/@${author}/${permlink}`,
                    style: style,
                    avatar: backgroundImage,
                    author: author,
                    timestamp: time,
                    body: `Mentioned you in the post <b>${permlink}</b\>`,
                    mention: true
                })).prependTo('.scroller');
                break;

            case ('follow'):
                const { follower } = notification[index];
                ({ backgroundImage } = Avatar(follower, 44));
                $(templates['src/js/templates/not-reply.hbs']({
                    link: link + `/@${follower}`,
                    style: style,
                    avatar: backgroundImage,
                    author: follower,
                    timestamp: time,
                    body: 'Just followed you!',
                    follow: true
                })).prependTo('.scroller');
                break;

            case ('transfer'):
                const { from, amount } = notification[index];
                ({ backgroundImage } = Avatar(from, 44));

                $(templates['src/js/templates/not-reply.hbs']({
                    link: link + `/@${from}`,
                    style: style,
                    avatar: backgroundImage,
                    author: from,
                    timestamp: time,
                    body: `Sent you an amount of ${amount}`,
                    transfer: true
                })).prependTo('.scroller');
                break;

            case ('reblog'):
                const { account } = notification[index];
                ({ backgroundImage } = Avatar(account, 44));
                $(templates['src/js/templates/not-reply.hbs']({
                    link: link + `/@${currentAuthUser}/${permlink}`,
                    style: style,
                    avatar: backgroundImage,
                    author: account,
                    timestamp: time,
                    body: permlink
                })).prependTo('.scroller');
                break;

            case ('vote'):
                const { voter, weight } = notification[index];
                let flagorup;
                ({ backgroundImage } = Avatar(voter, 44));
                if (weight < 0) {
                    flagorup = 'Downvoted';
                } else { flagorup = 'Upvoted' };
                $(templates['src/js/templates/not-reply.hbs']({
                    link: '',
                    style: style,
                    avatar: backgroundImage,
                    author: voter,
                    timestamp: time,
                    body: `${flagorup} you with weight of ${weight / 100}%`,
                    vote: true
                })).prependTo('.scroller');
                break;
        }
    }
}

//
function epochConv(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
}


