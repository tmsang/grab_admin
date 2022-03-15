/***********************************************
HTML processing order (Chrome)
  * 1. Page loading starts
  * 2. HTML has finished loading
  * 3. $ (document) .ready is executed
  * 4. All contents including images have been loaded.
  * 5. $ (window) .load is executed
  
HTML processing order (Edge)
  * 1. Page loading starts
  * 2. HTML has finished loading
  * 3. $ (window) .load is executed
  * 4. All contents including images have been loaded.
  * 5. $ (document) .ready is executed
 ************************************************/ 
$(document).ready(function () {
    console.log('DOM is loaded');
    
    var param = getQueryString();
    var gid;
    if (null == param) {
        gid = null;
    } else {
        gid = param["gmid"];
    }

    if (navigator.userAgent.indexOf('iPhone') > 0
        || navigator.userAgent.indexOf('Android') > 0
        || navigator.userAgent.indexOf('Mobile') > 0) {
        // TODO: Mobile             
        console.log('This is Mobile');
        $(".hed-nav").empty();
        $(".hed-nav").load("view/common/headerNavi.html");

        if (GMAB021 !== gid)
            window.location.href = "./index.html?gmid=" + GMAB021;
        else {
            $(".m-content").empty();
            $(".m-content").load("view/sp/" + GMAB021 + ".html");
        }
        return;
    }
    else if (navigator.userAgent.indexOf('iPad') > 0
        || navigator.userAgent.indexOf('Android') > 0) {
        // TODO: IPad
    }
    else {
        // TODO: PC                
        $(".hed-nav").empty();
        if (COMMON.chkLoginStatus()) {
            if (null == gid) {
                gid = GMAA021;
            }

            $(".hed-nav").load("view/common/headerNavi.html");
            if ($("body").hasClass("signin-body")) {
                $("body").removeClass("signin-body");
            }

            var url = 'view/pc/' + gid + '.html';
            $(".m-content").empty();
            $(".m-content").load(url);
        }
        else {
            var url = 'view/pc/' + GMAA001 + '.html';
            $(".m-content").empty();
            $(".m-content").load(url);
        }
    }
});
