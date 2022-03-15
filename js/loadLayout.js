/***********************************************
 *HTMLの処理順番(Chrome)
 *1.ページの読み込みが始まる
 *2.HTMLの読み込みが終わる
 *3.$(document).readyが実行
 *4.画像など含めすべてのコンテンツの読み込みが終わる
 *5.$(window).loadが実行
 *
 *HTMLの処理順番(Edge)
 *1.ページの読み込みが始まる
 *2.HTMLの読み込みが終わる
 *3.$(window).loadが実行
 *4.画像など含めすべてのコンテンツの読み込みが終わる
 *5.$(document).readyが実行
 ************************************************/
 var isLoading = false;
 $(document).ready(function(){
    console.log('DOM is loaded');
    //クエリパラメータを取得
    var param = getQueryString();
    var gid;
    if(null == param){
        gid = null;
    }else{
        gid = param["gmid"];
    }

    //ユーザーエージェントの確認
    if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0 || navigator.userAgent.indexOf('Mobile') > 0) {
        
        // スマートフォン向けの記述
        console.log('スマホ判定されました');
        //スマホ用コンテンツ読み込み

        //共通ヘッダー読み込み
        $(".hed-nav").empty();
        $(".hed-nav").load("view/common/headerNavi.html");

        //スマホメインレイアウト
        //クエリパラメータが無い場合は、index.htmlと同様にする
        if(GMAB021!==gid)
            window.location.href = "./index.html?gmid=" + GMAB021;
        else {
            //PCメインレイアウト読み込み
            $(".m-content").empty();
            //アラート通知画面
            $(".m-content").load("view/sp/" + GMAB021 + ".html");
        }
        return;
        
        // if(null == gid||GMAB021==gid){
        //     //PCメインレイアウト読み込み
        //     $(".m-content").empty();
        //     //アラート通知画面
        //     $(".m-content").load("view/sp/"+GMAB021+".html");
        //     return;
        // }
        // else{
        //     var url = 'view/sp/'+gid+'.html';
        //     //PCメインレイアウト読み込み
        //     $(".m-content").empty();
        //     //画面ID単位に読み込み
        //     $(".m-content").load(url);
        //     return;
        // }
    }
    else if (navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0) {
        // TODO タブレット向けの記述 現在なし
    }
    else{
        // PC向けの記述
        //console.log('pc判定されました');
        //共通ヘッダー読み込み
        $(".hed-nav").empty();

        
        if(COMMON.chkLoginStatus())
            {
                //クエリパラメータが無い場合は、検査結果画面を表示する
                if(null == gid){
                    gid = GMAA021;
                }

                //共通ヘッダ読み込み
                $(".hed-nav").load("view/common/headerNavi.html");
                //body編集
                if($("body").hasClass("signin-body")){
                    $("body").removeClass("signin-body");
                }
                var url = 'view/pc/'+gid+'.html';
                //PCメインレイアウト読み込み
                $(".m-content").empty();
                //画面ID単位に読み込み
                $(".m-content").load(url);
            }
            else 
            {
                var url = 'view/pc/' + GMAA001 + '.html';
                //PCメインレイアウト読み込み
                $(".m-content").empty();
                //画面ID単位に読み込み
                $(".m-content").load(url);
            }
        
    }
});


//ユーザーエージェント別にレイアウトを変更する
// export function userAgentLayout(){
//     $(() => {
//         console.log('DOM is loaded');
//         //クエリパラメータを取得
//         var param = getQueryString();
//         var gid;
//         if(null == param){
//             gid = null;
//         }else{
//             gid = param["gmid"];
//         }

//         //ユーザーエージェントの確認
//         if (navigator.userAgent.indexOf('iPhone') > 0 || navigator.userAgent.indexOf('Android') > 0 && navigator.userAgent.indexOf('Mobile') > 0) {

//             // スマートフォン向けの記述
//             console.log('スマホ判定されました');
//             //スマホ用コンテンツ読み込み

//             //共通ヘッダー読み込み
//             $(".hed-nav").empty();
//             $(".hed-nav").load("view/common/headerNavi.html");

//             //スマホメインレイアウト
//             //クエリパラメータが無い場合は、index.htmlと同様にする
//             if(null == gid||GM002==gid){
//                 //PCメインレイアウト読み込み
//                 $(".m-content").empty();
//                 //アラート通知画面
//                 $(".m-content").load("view/sp/GM002.html");
//                 return;
//             }
//             else{
//                 var url = 'view/sp/'+gid+'.html';
//                 //PCメインレイアウト読み込み
//                 $(".m-content").empty();
//                 //画面ID単位に読み込み
//                 $(".m-content").load(url);
//                 return;
//             }
//         }
//         else if (navigator.userAgent.indexOf('iPad') > 0 || navigator.userAgent.indexOf('Android') > 0) {
//             // TODO タブレット向けの記述 現在なし
//         }
//         else{
//             // PC向けの記述
//             //console.log('pc判定されました');
//             //共通ヘッダー読み込み
//             $(".hed-nav").empty();
            
            
//             if(COMMON.chkLoginStatus())
//             {
//                 //クエリパラメータが無い場合は、検査結果画面を表示する
//                 if(null == gid){
//                     gid = GMAA021;
//                 }

//                 //共通ヘッダ読み込み
//                 $(".hed-nav").load("view/common/headerNavi.html");
//                 //body編集
//                 if($("body").hasClass("signin-body")){
//                     $("body").removeClass("signin-body");
//                 }
//                 var url = 'view/pc/'+gid+'.html';
//                 //PCメインレイアウト読み込み
//                 $(".m-content").empty();
//                 //画面ID単位に読み込み
//                 $(".m-content").load(url);
//             }
//             else 
//             {
//                 var url = 'view/pc/' + GMAA001 + '.html';
//                 //PCメインレイアウト読み込み
//                 $(".m-content").empty();
//                 //画面ID単位に読み込み
//                 $(".m-content").load(url);
//             }
//             return;
                
//         }
//     });


// }