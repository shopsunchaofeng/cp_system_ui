var httpurl = "http://www.anlianduixiang.cn/sc-anlian-api/";
// var httpurl = "http://192.168.200.254:8080/";

//获取url传参
function parseUrl() {
    var url = location.href;
    var i = url.indexOf('?');
    if (i == -1) return;
    var querystr = url.substr(i + 1);
    var arr1 = querystr.split('&');
    var arr2 = new Object();
    for (i in arr1) {
        var ta = arr1[i].split('=');
        arr2[ta[0]] = ta[1];
    }
    return arr2;
}

function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return '';
}

function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) {
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
    }
}


function isNull(arg1) {
    return !arg1 && arg1 !== 0 && typeof arg1 !== "boolean" ? true : false;
}
var textTipLen = 0;
// 提示框
function textTip(str, t, callBack) {
    t = t || 2000;
    var span1 = document.createElement("span");
    span1.style.cssText = "width:auto;display:inline-block;height:100%;margin:0 auto;background-color:rgba(0,0,0,0.3);color:#fff;border-radius: 0.1rem;padding:0 .2rem;";
    span1.innerHTML = str;
    var dom = document.createElement("p");
    dom.setAttribute('class', 'text-tip texttip' + textTipLen);
    dom.appendChild(span1);
    document.body.appendChild(dom);
    var mytip = document.querySelector('.texttip' + textTipLen);
    mytip.style.display = "block";
    var tipHeight = mytip.offsetHeight;
    //文字两行或两行以上
    if ((tipHeight - 20) / 18 > 1) {
        mytip.style.width = "55%";
    }
    setTimeout(function () {
        mytip.style.display = "none";
        mytip.parentNode.removeChild(mytip);
        if (callBack) { callBack(); }
    }, t);
    textTipLen++;
}
function applink() {
    var shebei = currDevice();
    if (shebei.weixin) {
        openmask();
    } else if (shebei.iPhone) {
        window.location.href = `qiongyahaibo://memberid=`
    } else if (shebei.ios) {
        window.location.href = `qiongyahaibo://memberid=`
    } else if (shebei.android) {
        window.location = `qysealive://tomainpage?id=`;
    }
    var clickedAt = +new Date;
    setTimeout(function () {
        !window.document.webkitHidden && setTimeout(function () {
            if (+new Date - clickedAt < 2000) {
                downapp();
            }
        }, 500);
    }, 500)

}
function downapp() {
    var shebei = currDevice();
    if (shebei.weixin) {
        openmask();
    } else if (shebei.ios || shebei.iPhone) {
        $.ajax({ //获取验证码
            url: httpurl + 'api/appversion/getVersion',
            method: 'get',
            data: {
                type: 2
            },
            success: res => {
                console.log(res)
                if (res.code == "200") {
                    if (res.data.url == '') {
                        alert('暂无下载地址')
                    } else {
                        window.location.href = res.data.url
                    }
                } else {
                    textTip(res.msg);
                }
            }
        });
    } else if (shebei.android) {
        $.ajax({ //获取验证码
            url: httpurl + 'api/appversion/getVersion',
            method: 'get',
            data: {
                type: 1
            },
            success: res => {
                console.log(res)
                if (res.code == "200") {
                    if (res.data.url == '') {
                        alert('暂无下载地址')
                    } else {
                        window.location.href = res.data.url
                    }
                } else {
                    textTip(res.msg);
                }
            }
        });
    } else {
        alert("请使用移动设备");
    }
}
function currDevice() {
    var u = navigator.userAgent;
    var app = navigator.appVersion;// appVersion 可返回浏览器的平台和版本信息。该属性是一个只读的字符串。
    var browserLang = (navigator.browserLanguage || navigator.language).toLowerCase();    //获取浏览器语言

    var deviceBrowser = function () {
        return {
            trident: u.indexOf('Trident') > -1,  //IE内核
            presto: u.indexOf('Presto') > -1,  //opera内核
            webKit: u.indexOf('AppleWebKit') > -1,  //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,  //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/),  //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.Mac OS X/),  //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,  //android终端或者uc浏览器
            iPhone: u.indexOf('iPhone') > -1,  //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1,  //是否iPad
            webApp: u.indexOf('Safari') == -1,  //是否web应用程序，没有头部和底部
            weixin: u.indexOf('MicroMessenger') > -1,  //是否微信
            qq: u.match(/\sQQ/i) == " qq",  //是否QQ
        }
    }();

    return deviceBrowser;

}
function closemask() {
    $(".yindao").hide();
}
function openmask() {
    $(".yindao").show();
}


function pauseAll(videos, index) {
    for (var j = videos.length - 1; j >= 0; j--) {
        if (j != index) videos[j].pause();
    }
};