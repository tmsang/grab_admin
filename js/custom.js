
/*********************************************************************
 *URLパラメータ解析
 *********************************************************************/
function getQueryString() {
    if (1 < document.location.search.length) {
        // 最初の1文字 (?記号) を除いた文字列を取得する
        var query = document.location.search.substring(1);

        // クエリの区切り記号 (&) で文字列を配列に分割する
        var parameters = query.split('&');

        var result = new Object();
        for (var i = 0; i < parameters.length; i++) {
            // パラメータ名とパラメータ値に分割する
            var element = parameters[i].split('=');

            var paramName = decodeURIComponent(element[0]);
            var paramValue = decodeURIComponent(element[1]);

            // パラメータ名をキーとして連想配列に追加する
            result[paramName] = decodeURIComponent(paramValue);
        }
        return result;
    }
    return null;
}
// ウィンドウがアクティブになった際に実行する関数
function play() {
    // 実行させる処理を記述
    console.log('ブラウザアクティブ');
}

// ウィンドウがアクティブでなくなった際に実行する関数
function pause() {
    // 実行させる処理を記述
    console.log('ブラウザノンアクティブ');
}

// ウィンドウをフォーカスしたら指定した関数を実行
window.addEventListener('focus', play, false);

// ウィンドウからフォーカスが外れたら指定した関数を実行
window.addEventListener('blur', pause, false);

// //htmlが読み込まれたら
// $(() => {
// });

