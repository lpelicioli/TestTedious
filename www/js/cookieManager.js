function getCookies() {
    var list = {},
        rc = document.cookie;

    rc && rc.split(';').forEach(function (cookie) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

function setCookie(cname, cvalue) {
    const d = new Date();
    const duration = 10; //days
    d.setTime(d.getTime() + (duration * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Lax";//";SameSite=None; Secure"     Secure è per https
}