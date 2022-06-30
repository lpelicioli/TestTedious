function Login(usr, passw, callback) {
    if (isNull(usr)) {
        callback({ code: 401 });
    }
    else {
        serverRequest("/login", { "username": usr, "password": passw }, 2000, function (result) {
            callback(result);
        })
    }

}

function renewToken(callback) {
    var cookies = getCookies();
    if (isNull(cookies.token)) {
        callback({ code: 401 });
    }
    else {
        serverRequest("/renewToken", {}, 2000, function (result) {
            callback(result);
        })
    }
}

function logout(callback) {
    serverRequest("/logout", {}, 2000, function (result) {
        callback(result);
    })
}

function getUserData(callback) {
    serverRequest("/getUserData", {}, 2000, function (result) {
        callback(result);
    })
}

function serverRequest(topic, data, timeout, callback) {
    var cookies = getCookies();
    var output = {
        code: -1,
    }
    var requestData = {
        token: cookies.token
    }
    requestData.data = data;

/*     var xhr = new XMLHttpRequest();
        if (timeout > 0)
            xhr.timeout = timeout;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                output.code = xhr.status;
                output.data = JSON.parse(xhr.responseText);
                callback(output);
            }
            else if (xhr.readyState == 4 && xhr.status >= 400) {
                output.code = xhr.status;
                callback(output);
            }
        }
    
        xhr.ontimeout = function (e) {
            output.code = 408;
            output.text = "Connection timeout"
            callback(output);
        };
    
        xhr.open("POST", topic, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(JSON.stringify(requestData)); */
    
    
 
    postData(topic, requestData)
        .then(data => {
            //console.log(data); // JSON data parsed by `data.json()` call
            output.code = 200;
            output.data = data;
            callback(output);
        });
}


async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'default', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}