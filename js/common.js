/*********************************************************************
*共通関数
*ログイン状態チェック
*ログアウト
*セッションタイムアウト管理
*メッセージ取得
*********************************************************************/
var COMMON = (function () {
    //Tab順及びEnterキーでの項目移動順設定
    function setEnterKeyAsTab() {
        $('body').on('keydown', 'input, select, textarea', function (e) {
            var self = $(this),
                form = self.parents('form:eq(0)'),
                submit = (self.attr('type') == 'submit' || self.attr('type') == 'button'),
                focusable,
                next;
            if ((e.keyCode == KEY_CODE_ENTER && !submit)) {
                focusable = form.find('input,a,select,button,textarea').filter(':visible:not([readonly]):not([disabled])');
                next = focusable.eq(focusable.index(this) + 1);
                if (next.length) {
                    next.focus();
                } else {
                    form.submit();
                }
                return false;
            }
        });
    }
    //ログイン状況をチェックする(モック用)
    function chkLoginStatus() {
        var user = sessionGet(SESSION_KEY);
        return (user != null);
    }

    //セッションが有効期限切れの場合は、強制的に再ログインを行う。
    function chkSessionTimeOut() {
        if (!chkLoginStatus())
            return logout();
        return false;
    }

    //ログアウト
    function logout() {
        console.log('logoutに来ました');
        var login = sessionStorage.getItem(SESSION_KEY);
        if (login) {
            sessionStorage.removeItem(SESSION_KEY);
        }
        window.location.href = "./";
        return true;
    }

    //セッションストレージから取得、期限切れと解除する。
    function sessionGet(key) {
        var stringValue = window.sessionStorage.getItem(key);
        if (stringValue !== null) {
            var value = JSON.parse(stringValue);
            var expirationDate = new Date(sessionStorage.getItem(SESSION_TIME_KEY));
            if (expirationDate > new Date()) {
                changeSessionTime();
                return value;
            } else {
                sessionStorage.removeItem(key);
                sessionStorage.removeItem(SESSION_TIME_KEY);
            }
        }
        return null;
    }

    //セッションストレージに設定する。
    function sessionSet(key, value) {
        changeSessionTime();

        sessionStorage.setItem(key, JSON.stringify(value));
    }

    function changeSessionTime(expirationInMin) {
        if (!expirationInMin)
            expirationInMin = 30;
        var expirationDate = new Date(new Date().getTime() + (60000 * expirationInMin));
        //update time 
        sessionStorage.setItem(SESSION_TIME_KEY, expirationDate.toISOString());
    }

    //メッセージIDで取得
    function getMessageById(id, param1, param2) {
        var message = $.grep(messages, function (n, i) {
            return n.id == id;
        });
        if (message.length) {
            return message[0].content.replace("[0]", "[" + param1 + "]").replace("[1]", "[" + param2 + "]").replace(/new_line/g, "<br>");
        }
        return id + ":メッセージ内容が見つけません";//見つけません。
    }

    //メッセージIDで表示
    function showMessageById(id, param1, param2, successFlg) {
        var message = getMessageById(id, param1, param2);
        showMessage(message, successFlg);
    }

    //メッセージを表示
    function showMessage(message, successFlg) {
        hideMessage();
        let cssClass = ".alert-danger";
        if (successFlg)
            cssClass = ".alert-success";
        if (message) {
            // $(cssClass).html(message.replace(/new_line/g, "<br>"));
            $(cssClass).html(message.replace(/\\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/\\n/g, "<br>"));

            //メッセージを表示
            $(cssClass).removeClass("display-none");
            if (successFlg)
                setTimeout(hideMessage, 3.0 * 1000);
        }
    }

    //メッセージを表示
    function showSearchResult(mgsId) {
        let cssClass = ".alert-warning";
        if (!mgsId)
            mgsId = "COM_909"
        $(cssClass).html(getMessageById(mgsId));
        //メッセージを表示
        $(cssClass).removeClass("display-none");
        // setTimeout(hideMessage, 5.0 * 1000);
    }

    //メッセージを非表示
    function hideMessage() {
        //メッセージを非表示
        $(".alert").addClass("display-none");
    }

    function getMenusAllow() {
        return sessionGet(SESSION_KEY).menuAllow;
    }
    //ログインの利用者
    function loginData() {
        if (!chkSessionTimeOut())
            return sessionGet(SESSION_KEY);
    }

    //Token取得
    function getToken() {
        if (!chkSessionTimeOut())
            return sessionGet(SESSION_KEY).token;
    }

    //病院コード取得
    function getHospitalCd() {
        if (!chkSessionTimeOut())
            return sessionGet(SESSION_KEY).hospitalCd;
    }

    //基準日取得
    function getReferenceDt() {
        var now = moment().format("YYYY-MM-DD HH:mm:ss");
        return now;
    }

    //Tabulator 設定
    var _langs = {
        "jp": {
            "pagination": {
                "first": "最初へ", //text for the first page button
                "first_title": "最初へのページ", //tooltip text for the first page button
                "last": "最後",
                "last_title": "最後のページ",
                "prev": "前",
                "prev_title": "前のページ",
                "next": "次",
                "next_title": "次のページ",
            },
        }
    };
    var _layout = "fitColumns";//カラムコンテナに合わせる
    var _pagination = "local";
    var _paginationSize = 5;//5行でページング
    var _movableColumns = true;//カラムの移動を許可する
    var _locale = "jp";
    var _dateSetting = {
        format: "yyyy-mm-dd",
        autoclose: true,
        todayHighlight: true,
        inline: true,
        language: 'ja'
    }

    return {
        setEnterKeyAsTab: setEnterKeyAsTab,
        chkLoginStatus: chkLoginStatus,
        sessionSet: sessionSet,
        getMessageById: getMessageById,
        loginData: loginData,
        getToken: getToken,
        getHospitalCd: getHospitalCd,
        getReferenceDt: getReferenceDt,
        getMenusAllow: getMenusAllow,
        chkSessionTimeOut: chkSessionTimeOut,
        logout: logout,
        showMessageById: showMessageById,
        showMessage: showMessage,
        hideMessage: hideMessage,
        showSearchResult: showSearchResult,
        langs: _langs,
        layout: _layout,
        pagination: _pagination,
        paginationSize: _paginationSize,
        movableColumns: _movableColumns,
        locale: _locale,
        dateSetting: _dateSetting
    };

})();
