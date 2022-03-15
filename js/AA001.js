const AA001 = (function () 
{
    function init() {        
        $('#btnLogin').on('click', login);
        $("#inputId").keypress(validInput);
        COMMON.setEnterKeyAsTab();
    }

    function validInput(evt) {
        return (evt.key.match(/[a-zA-Z0-9@.-_]/g) != null);
    }

    function login() {        
        var loginId = $("#inputId").val();
        var password = $("#inputPassword").val();        
        
        if (loginId == "") {
            COMMON.showMessageById("COM_902", "LoginId");
            $("#inputId").focus();
            return;
        }        
        if (password == "") {
            COMMON.showMessageById("COM_902", "パスワード");
            $("#inputPassword").focus();
            return;
        }

        sessionStorage.removeItem(SESSION_KEY);
        API.POST(URL_LOGIN, { 'Type': 'admin', 'Email': loginId, 'Password': password }, function (user) {           
            if (user) {
                COMMON.sessionSet(SESSION_KEY, user);
                window.location.href = "./index.html?gmid=AA091";
                return;                
            }

            COMMON.showMessageById("AA001_001");
            $("#inputId").focus();
        });        
    }    

    return {
        init: init,
        login: login,
    };
})();

AA001.init();
