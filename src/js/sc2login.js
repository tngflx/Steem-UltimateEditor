var author, account, win, idleTime = 0;

function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

var token = getURLParameter('access_token') ? getURLParameter('access_token') : localStorage.getItem('access_token');
var sc2api = sc2.Initialize({
    baseURL: 'https://v2.steemconnect.com',
    app: 'oauthflx',
    accessToken: token,
    callbackURL: 'http://localhost/medium-editor-insert-plugin/examples/index.html',
    scope: ['login', 'vote', 'custom_json', 'comment_options','comment']
});

var url = sc2api.getLoginURL();

function checkProfile() {
    sc2api.me(function (err, result) {
        console.log(err, result);
        if (result && !err) {
            console.log('Already logged in');

            //All user datas
            author = result.user;
            account = result.account;
            const { json_metadata } = result.account;
            const metadata = JSON.parse(json_metadata);
            const { profile_image } = metadata.profile;
            $('.avatar').attr('src', profile_image);
            

            $('.signout').show();
            $('.login').hide();

            if (window.opener) {
                window.close();
                window.opener.location.reload(false);
            }

            localStorage.setItem('access_token', token);

        } else if(err && !result){

             $('.login').show();
            $('.signout').hide();
            $('.avatar').hide();
        }
    });
}

//Sign out when idling for more than 20 min
$(document).ready(function () {
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });
});

function timerIncrement() {
        idleTime = idleTime + 1;
    if (idleTime > 19) { // 20 minutes
        Signout();
    }
}

function Signout() {
    sc2api.revokeToken(function (err, res) {
        if (res && !err) {
            $('.login').show();
            $('.signout').hide();
            $('.avatar').hide();
            console.log(res);
        }
    });
}


function openWin() {
    win = popupCenter(url, 'Steemconnect login', 500, 560);
    return win;
};

function popupCenter(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }

    return newWindow;
}