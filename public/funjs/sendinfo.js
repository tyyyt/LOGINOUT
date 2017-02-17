function sendinfo() {
    var user = $("#inputUser").val();
    var pd = $("#inputPassword").val();
    var passwd = hex_md5(pd);
    var lan = $("#inputSelect").val();
    $.post("/login", {
        user: user,
        passwd: passwd,
        lan: lan,
        key:GetQueryString('key')
    }, function(data, status) {
        if (data.logstatus == "yes") {
            window.location.reload();
        }
        if (data.logstatus == "no") {
            alert('用户名密码错误，请重新登录');
        }
    });
};
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return (r[2]);
    } else {
        return ('zh');
    }
}
