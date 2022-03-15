/*********************************************************************
 *ログイン用
 *********************************************************************/

const AA001 = (function () {
    var role = { firstScreen: "", menuLst: "" };
    const _getMenuListByRole = function (userRole) {
        var gmid = GMAA001;
        //一般
        if (userRole == "0") {
            //alert('0:一般に入った');
            //AA011		通知管理画面へ遷移する
            role.firstScreen = GMAA011;
            role.menuLst = GMAA011 + "," + GMAA021;
        }
        //ドクター【医師の場合】
        else if (userRole == "1") {
            //alert('1:医師に入った');
            //AA021		検査結果一覧画面へ遷移する
            role.firstScreen = GMAA021;
            role.menuLst = GMAA021;
        }
        //システム
        else if (userRole == "9") {
            //alert('9:システムに入った');
            //AA011		通知管理画面へ遷移する
            role.firstScreen = GMAA011;
            role.menuLst = GMAA011 + "," + GMAA021 + "," + GMAA091 + "," + GMAA092;
        }
        else return null;
        return role;
    };

    function _login(loginId, password, callback) {
        debugger;
        API.POST(URL_LOGIN, { 'Type': 'admin', 'Email': loginId, 'Password': password }, function (data) {
            //0:正常、 1:異常、 -1：データなし
            if (data.result == 0) {                
                callback(user);
            }
            callback(data.result);

        });
    }

    return {
        getMenuListByRole: _getMenuListByRole,
        login: _login
    };
})();


const AA001_GUI = (function () {

    function init() {
        // COMMON.loadMessages();

        $('#btnLogin').on('click', AA001_GUI.login);
        //only allow input number and text
        $("#inputId").keypress(validInput);
        COMMON.setEnterKeyAsTab();
    }

    function validInput(evt) {
        return (evt.key.match(/[a-zA-Z0-9@.-_]/g) != null);
    }

    function login() {
        //pcの場合のみLogin画面
        var loginId = $("#inputId").val();
        var password = $("#inputPassword").val();
        sessionStorage.removeItem(SESSION_KEY);

        //loginIdをチェック、必須
        if (loginId == "") {
            COMMON.showMessageById("COM_902", "LoginId");
            $("#inputId").focus();
            return;
        }

        //パスワードをチェック、必須
        if (password == "") {
            COMMON.showMessageById("COM_902", "パスワード");
            $("#inputPassword").focus();
            return;
        }
        AA001.login(loginId, password, function (result) {
            //ルーティング 画面遷移制御　ロールで遷移先を変更する
            if (result == -1) {
                COMMON.showMessageById("AA001_001");
                $("#inputId").focus();
            }
            else {
                directByUserRole(result);
            }
        });

    }

    //ルーティング 画面遷移制御　ロールで遷移先を変更する
    //0:一般 1:医師 9:システム
    function directByUserRole(user) {
        var role = AA001.getMenuListByRole(user.userRole);
        if (role != null) {
            user.menuAllow = role.menuLst;
            //セッションストレージに保存
            COMMON.sessionSet(SESSION_KEY, user);
            window.location.href = "./index.html?gmid=" + role.firstScreen;
        }
        // //invalid Role
        // else {
        //     //alert('invalid Role が入った');
        //     $(".btn-danger").text("invalid Role が入った");
        //     $(".btn-danger").removeClass("display-none");
        //     return;
        // }
    }

    return {
        init: init,
        login: login,
    };
})();
$(document).ready(function () {
    AA001_GUI.init();
});
