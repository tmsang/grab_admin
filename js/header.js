var master = "";

$('#menu').empty();

$.getJSON("data/menu.json", function (data) {
    if (navigator.userAgent.indexOf('iPhone') > 0
        || navigator.userAgent.indexOf('Android') > 0
        && navigator.userAgent.indexOf('Mobile') > 0) {
        // TODO: Mobile    
        master = data.sp;
        for (var i = 0; i < master.length; i++) {
            $('#menu').append(
                '<li><a class="dropdown-item" href="' + master[i].url + '">' + master[i].gmid + '&nbsp;' + master[i].name + '</a></li>'
            );
        }
        return;
    }
    else if (navigator.userAgent.indexOf('iPad') > 0
        || navigator.userAgent.indexOf('Android') > 0) {
        // TODO: Tablet
        return;
    }
    else {
        // TODO: PC
        master = data.pc;

        var param = getQueryString();
        menus = COMMON.getMenusAllow();
        for (var i = 0; i < master.length; i++) {
            $('#menu').append(
                '<li><a class="dropdown-item" href="' + master[i].url + '">' + master[i].gmid + '&nbsp;' + master[i].name + '</a></li>'
            );
            
            if (param) {
                if (master[i].gmid == param["gmid"]) {
                    $('#thisPagelnk').text(master[i].name);
                }
                if (master[i].gmid == param["gmid"]) {
                    $('#thisPagelnk').text(master[i].name);
                }
            }
        }
        $('#menu').append('<li><a class="dropdown-item" href="javascript:COMMON.logout();"><i class="fas fa-sign-out-alt"></i><span class="logout">Logout</span></a></li>');
        return;
    }
});
