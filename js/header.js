var master = "";
$('#menu').empty();
$.getJSON("data/menu.json", function (data) {
    if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0) {
        // スマートフォン
        master = data.sp;
        for (var i = 0; i < master.length; i++) {
            $('#menu').append(
                '<li><a class="dropdown-item" href="' + master[i].url + '">' + master[i].gmid + '&nbsp;' + master[i].name + '</a></li>'
            );
        }
        return;

    } else if (navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0) {
        // TODO タブレット向けの記述 現在なし
        return;

    } else {
        //PC
        master = data.pc;

        var param = getQueryString();
        menus = COMMON.getMenusAllow();
        for (var i = 0; i < master.length; i++) {
            if (menus.indexOf(master[i].gmid) >= 0) {
                $('#menu').append(
                    '<li><a class="dropdown-item" href="' + master[i].url + '">' + master[i].gmid + '&nbsp;' + master[i].name + '</a></li>'
                );
            }
            if (param) {
                if (master[i].gmid == param["gmid"]) {
                    $('#thisPagelnk').text(master[i].name);
                }
                if (master[i].gmid == param["gmid"]) {
                    $('#thisPagelnk').text(master[i].name);
                }
            }
        }
        $('#menu').append('<li><a class="dropdown-item" href="javascript:COMMON.logout();"><i class="fas fa-sign-out-alt"></i>ログアウト</a></li>');
        return;
    }
});