function userAlert() {
    var id = document.getElementById("textId").value;
    var pass = document.getElementById("textPass").value;
    if (id == 'user' && pass == '1234') {
        alert(id + " " + pass);
        window.open("/Users/miracunlu/internet programcılığı/yazlab1.3/user.html")
    }
}

function adminAlert() {
    var id = document.getElementById("textId").value;
    var pass = document.getElementById("textPass").value;
    if (id == 'admin' && pass == '12345') {
        alert(id + " " + pass);
    }
}