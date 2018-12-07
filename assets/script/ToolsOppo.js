function openOppo() {
    toolsLog("-- openOppo 加载 oppo SDK --");
    var i, c = {},
        t = !(!window.android || !window.android.getImei),
        r = !1;
    t && ((i = window.android).downloadByPid || (r = !0));
    var e = {};

    function n(e) {
        var n = window.location.search,
            o = new RegExp("(^|&)" + e + "=([^&]*)(&|$)", "i"),
            a = n.substr(n.indexOf("?") + 1).match(o);
        return null != a ? a[2] : ""
    }
    c.setWebviewOrientation = function (e) {
        t && android.setWebViewOrientation ? android.setWebViewOrientation(e) : console.warn("native call failed:setWebViewOrientation")
    }, c.getIMEI = function () {
        return t ? (e.imei || (e.imei = i.getImei()), {
            imei: e.imei
        }) : {
            imei: "000000000000000"
        }
    }, c.makeToast = function (e) {
        t ? i.makeToast(e.msg) : alert(e.msg)
    }, c.forceLogin = function () {
        if (t) {
            i.callNativeApi(JSON.stringify({
                type: "reLoginAccount"
            }))
        } else console.warn("native call failed:force login")
    }, c.getNetworkType = function () {
        return t ? {
            network: i.getNetworkType()
        } : {
            network: "wifi"
        }
    }, c.getLoginInfo = function () {
        var e = "",
            n = "",
            o = "";
        if (t) {
            if (r) {
                var a = i.getLoginInfo();
                e = (a = a.split(";"))[0], n = a[1], o = a[2]
            } else e = i.getToken(), n = i.getMobileName();
            e = decodeURIComponent(e)
        }
        return {
            token: e,
            model: n,
            other: o
        }
    }, c.isLogin = function () {
        return t ? {
            login: "true" == i.isLogin().toLowerCase()
        } : "127.0.0.1" == location.hostname ? {
            login: !0
        } : {
            login: !1
        }
    }, c.doStartLogin = function () {
        t ? r ? i.doStartLogin(!0) : i.startLogin() : console.warn("native call failed:login")
    }, c.isInstalled = function (e) {
        return t ? e.package ? {
            install: "true" == i.isInstalled(e.package).toLowerCase()
        } : (toolsLog("no package for isInstalled"), null) : {
            install: !1
        }
    }, c.openAppDetail = function (e) {
        t ? r ? i.openActivity("oap://gc/dt?id=" + e.masterid) : i.openActivity("oap://mk/dt?id=" + e.masterid) : console.warn("native call failed::openActivity")
    }, c.openApp = function (e) {
        if (t) {
            if (!e.package) return void toolsLog("no package for openApp");
            r ? i.openGame(e.package) : i.openApp(e.package)
        } else console.warn("native call failed:openApp")
    }, c.openWebView = function (e) {
        t ? i.openWebView(e.title, e.url, e.type || 0) : window.location.assign(e.url)
    }, c.getAppVersion = function () {
        return t && i.getAppVersion ? i.getAppVersion() : t ? 1199 : (console.warn("native call failed::getAppVersion"), -1)
    }, c.setLoadingProgress = function (e) {
        t && i.setLoadingProgress ? i.setLoadingProgress(e) : console.warn("native call failed:setLoadingProgress")
    }, c.loadingComplete = function () {
        t && i.loadingComplete ? i.loadingComplete() : console.warn("native call failed::loadingComplete")
    }, c.closePage = function () {
        t ? i.closePage() : console.warn("native call failed:closePage")
    }, c.openRankPage = function () {
        t && android.openRankPage ? android.openRankPage() : console.warn("native call failed:openRankPage")
    }, c.updateGameRank = function (e) {
        t && android.updateGameRank ? android.updateGameRank(JSON.stringify(e)) : console.warn("native call failed:updateGameRank")
    };
    var o = {},
        a = 0,
        p = {
            imei: "000000000000000",
            model: "",
            token: "",
            osv: "",
            romv: "",
            av: "",
            netid: "wifi"
        },
        d = {
            androidVersionName: "",
            colorOsVersion: ""
        },
        l = "https://epoch.cdo.oppomobile.com",
        s = "/soporcollect/wapevent/v1/event";
    p.imei = c.getIMEI().imei, p.model = c.getLoginInfo().model, p.token = c.getLoginInfo().token, p.netid = c.getNetworkType().network, d.imei = p.imei, d.model = p.model;
    var g = "",
        m = n("oppoact"),
        u = n("oppopage"),
        k = {
            event: 2006,
            channelid: 2201,
            systemid: 1e3
        };

    function f(e, n) {
        var o = {
            event: k.event,
            tags: {
                name: e.action || 604,
                imei: p.imei,
                model: p.model,
                osv: p.osv,
                romv: p.romv,
                av: p.av,
                ch: k.channelid,
                sysid: k.systemid,
                netid: p.netid
            },
            timestamp: Date.now()
        };
        for (var a in n) o.tags[a] = n[a];
        var i = encodeURIComponent(JSON.stringify(o)),
            t = l + s + "?data=" + i + "&callback=_oppoReportLoad",
            c = document.createElement("script");
        c.src = t, c.onload = function () {
            document.head.removeChild(this)
        }, document.head.appendChild(c)
    }
    var v = !(window._oppoReportLoad = function (e) {
        toolsLog("ToolsOppo function(e) ", e);
    });

    function w(e) {
        f({
            action: 602
        }, {
            type: e,
            act_id: m,
            pkg: g
        })
    }

    function _(e) {
        f({
            action: 603
        }, {
            type: e,
            act_id: m,
            pkg: g,
            token: p.token
        })
    }

    function y(e, n) {
        var o = document.createElement("script");
        o.src = e, o.onload = function () {
            document.head.removeChild(this)
        }, o.onerror = function () {
            n({
                code: 999,
                msg: "接口调用失败"
            })
        }, document.head.appendChild(o)
    }

    function h() {
        return "oppo_callback_" + a++
    }

    function L(e) {
        var n = [];
        for (var o in e) n.push(o + "=" + encodeURIComponent(e[o]));
        return n.join("&")
    }

    function b() {
        setTimeout(function () {
            p.token = c.getLoginInfo().token, p.netid = c.getNetworkType().network
        }, 500)
    }
    o.checkPay = function (e) {
        e(c.isInstalled({
            package: "com.nearme.atlas",
            masterid: 10057477
        }).install)
    }, o.login = function (n) {
        if (g = n.packageName, v || (f({
                action: 601
            }, {
                type: 2,
                page_id: u,
                act_id: m,
                pkg: g
            }), v = !0), c.isLogin().login) {
            var e = h(),
                o = {
                    token: c.getLoginInfo().token,
                    pkgName: n.packageName
                };
            o.header = JSON.stringify(d), o.callback = e, window[e] = function (e) {
                200 == e.code ? (e.token = o.token, _(11)) : 1005 == e.code && (_(12), c.forceLogin(), b()), n.callback(e)
            }, w(21), y("https://play.open.oppomobile.com/instant-game-open/userInfo/tokenCheck?" + L(o), n.callback)
        } else w(22), c.doStartLogin(), b()
    }, o.pay = function (i) {
        if (c.isLogin().login) {
            g = i.packageName;
            var t = c.getLoginInfo().token,
                e = h(),
                n = {
                    token: t,
                    pkgName: i.packageName,
                    cpOrderId: i.orderId,
                    price: i.price,
                    productName: i.productName,
                    productDesc: i.productDesc,
                    cpCallbackUrl: i.callbackUrl,
                    appVersion: i.appVersion,
                    sdkVersion: "1.0"
                };
            n.header = JSON.stringify(d), n.callback = e, f({
                action: 602
            }, {
                type: 31,
                act_id: m,
                pkg: g,
                token: p.token
            }), window[e] = function (e) {
                var n, o, a;
                200 == e.code ? (_(21), n = {
                    notify_url: e.callBackUrl,
                    product_name: i.productName,
                    product_desc: i.productDesc,
                    channel_id: e.channel,
                    partner_id: e.channel,
                    source: i.appName,
                    package_name: i.packageName,
                    amount: (i.price / 100).toFixed(2),
                    order_id: e.orderId,
                    app_version: i.appVersion,
                    app_code: i.appVersion,
                    app_key: i.appKey,
                    token: t,
                    sign: e.sign
                }, o = document.createElement("iframe"), a = {
                    notify_url: n.notify_url,
                    product_name: n.product_name,
                    product_desc: n.product_desc,
                    package_name: n.package_name,
                    app_version: n.app_version,
                    source: n.source,
                    amount: n.amount,
                    channel_id: n.channel_id,
                    currency_name: "人民币",
                    exchange_ratio: "1.0",
                    partner_id: n.partner_id,
                    pay_type: "1",
                    partner_order: n.order_id,
                    app_code: n.app_code,
                    app_key: n.app_key,
                    token: n.token,
                    sign: n.sign
                }, o.style.display = "none", document.body.appendChild(o), o.src = "kekepay://nearme.atlas.com?" + L(a), setTimeout(function () {
                    document.body.removeChild(o), o = null
                }, 1e3), setTimeout(function () {
                    i.callback({
                        code: 200,
                        msg: ""
                    })
                }, 500)) : (_(22), 1005 == e.code && (c.forceLogin(), b()), i.callback(e))
            }, y("https://isdk.oppomobile.com/gamepay/h5/v1?" + L(n), i.callback)
        } else c.doStartLogin(), b()
    }, o.setWebviewOrientation = c.setWebviewOrientation, o.getAppVersion = c.getAppVersion, o.setLoadingProgress = c.setLoadingProgress, o.loadingComplete = c.loadingComplete, o.openRankPage = c.openRankPage, o.updateGameRank = c.updateGameRank, window.OPPO = o

    toolsLog("-- OPPO typeof --", typeof (OPPO));
};

function openOpUnion() {
    var w = !(!window.android || !window.android.getDeviceInfo),
        e = !(!window.OppoWebPage || !window.OppoWebPage.getCommonBrowserInfo);
    toolsLog("-- opUnion.js 脚本开始执行 w -- " + w + " -- e -- " + e);
    toolsLog(window.android);
    toolsLog(window.OppoWebPage);
    toolsLog(typeof (Promise));
    if (window.android) {
        toolsLog("-- window.andorid 存在 --");
        toolsLog(typeof (window.android.getDeviceInfo));
        if (typeof (window.android.getDeviceInfo) == "function") {
            toolsLog(window.android.getDeviceInfo());
        }
    }
    if ((w || e) && Promise) {
        if (e)
            if (JSON.parse(window.OppoWebPage.getCommonBrowserInfo()).browserVersion.split(".").slice(0, 2).join(".") < 4.3) return toolsLog("不支持该环境");
        if (w)
            if (JSON.parse(window.android.getDeviceInfo()).androidReleaseVersion.split(".").slice(0, 2).join(".") < 4.4) return toolsLog("不支持该环境");
        var m = function () {
                for (var e = {}, o = 0; o < arguments.length; o++) {
                    var t = arguments[o];
                    for (var i in t) e[i] = t[i]
                }
                return e
            },
            o = function (t, i) {
                var n;
                return function () {
                    var e = this,
                        o = arguments;
                    clearTimeout(n), n = setTimeout(function () {
                        t.apply(e, o)
                    }, i)
                }
            },
            g = function (t, e, o) {
                if (null != o) n(e, o);
                else
                    for (var i in e) n(i, e[i]);

                function n(e, o) {
                    t = t.split(e).join(o)
                }
                return t
            },
            p = function (e, o) {
                for (var t = [], i = 0; i < e.length; i++) t.push(e[i][o]);
                return t
            },
            d = function () {
                var e = "";
                if (window.OppoWebPage && window.OppoWebPage.getCommonBrowserInfo) e = JSON.parse(window.OppoWebPage.getCommonBrowserInfo()).networkType;
                else if (window.android && window.android.getDeviceInfo) {
                    e = JSON.parse(window.android.getDeviceInfo()).netWorkType
                }
                return e
            },
            y = {
                reportIdArr: [],
                commonParams: {
                    imei: "",
                    ssoid: "",
                    model: "",
                    osVersion: "",
                    romVersion: "",
                    androidVersion: "",
                    sdkVersion: "",
                    channel: "",
                    systemId: "",
                    category: "",
                    appVersion: "",
                    networkId: "",
                    apiVersion: 2,
                    h5VC: 1e4
                },
                fields: {
                    "lm-click": "a,posId,adSource,adType,adId,contentSize,traceId,abtest,parEvtId,evtId,sourceTS,evtType,clsType,planId,uSdkVC,meterialId,carrier,valid,respId,adOwner,price,dealRs,downX,downY,upX,upY,downChannel,jumpRet,InstVer,InstSdkVer,avdType,scRespId,crtType,modId,labId,prmtId,phBrand,phMaker,bid,ocpcBid,costType,oprEnv",
                    "lm-expose": "a,posId,adSource,adType,adId,contentSize,traceId,abtest,parEvtId,evtId,planId,uSdkVC,meterialId,carrier,adOwner,valid,respId,avdType,scRespId,crtType,modId,labId,prmtId,phBrand,phMaker,oprEnv",
                    "lm-play": "a,posId,adSource,adId,traceId,abtest,parEvtId,evtId,planId,uSdkVC,meterialId,adOwner,valid,respId,avdType,scRespId,vPrs,vPlyPos,vDrt,vPlyRet,oprEnv"
                },
                iframeUrl: "https://data.ads.oppomobile.com/h5/unionpost.html",
                iframeHost: "https://data.ads.oppomobile.com",
                iframeLoaded: !1,
                createIframe: function (e, o) {
                    var t = document.createElement("iframe");
                    t.src = this.iframeUrl, t.name = "oppo_report_iframe", t.style.display = "none", document.body.appendChild(t), t.onload = e, t.onerror = o
                },
                reportData: function (e, o) {
                    if (e && o.adList && o.adList[0]) {
                        var t = o.adList[0].adId + e;
                        if ("play" === e && (t += o.video.vPrs), -1 === y.reportIdArr.indexOf(t)) {
                            y.reportIdArr.push(t);
                            for (var i = "lm-" + e, n = this.commonParams, a = [n.imei, n.ssoid, n.model, n.osVersion, n.romVersion, n.androidVersion, n.sdkVersion, n.channel, n.systemId, n.category, n.appVersion, n.networkId].join("\t") + "\t" + (new Date).getTime() + "\t\t\t" + i + "\t0\t1\t", r = (this.fields[i] || "").split(",") || [], d = [], s = o.adList[0].materialList[0], m = JSON.parse(s.transparent), c = 0; c < r.length; c++) {
                                var p = r[c];
                                switch (p) {
                                    case "adSource":
                                    case "respId":
                                        d.push(o[p] || "");
                                        break;
                                    case "adId":
                                    case "planId":
                                    case "posId":
                                        d.push(o.adList[0][p] || "");
                                        break;
                                    case "evtId":
                                        d.push((new Date).getTime());
                                        break;
                                    case "evtType":
                                        3 === s.actionType ? d.push("4") : d.push("1");
                                        break;
                                    case "clsType":
                                    case "carrier":
                                        d.push("");
                                        break;
                                    case "upX":
                                    case "upY":
                                    case "downX":
                                    case "downY":
                                        d.push(o.mouseClient && void 0 !== o.mouseClient[p] ? o.mouseClient[p] : "");
                                        break;
                                    case "vPrs":
                                    case "vPlyPos":
                                    case "vDrt":
                                    case "vPlyRet":
                                        d.push(o.video && void 0 !== o.video[p] ? o.video[p] : "");
                                        break;
                                    case "traceId":
                                    case "meterialId":
                                    case "downChannel":
                                        d.push(s[p] || "");
                                        break;
                                    case "oprEnv":
                                        d.push(w ? 1 : 0);
                                        break;
                                    case "uSdkVC":
                                        d.push(y.commonParams.h5VC);
                                        break;
                                    default:
                                        d.push(m[p] || "")
                                }
                            }
                            a += d.join(",");
                            var l = [{
                                headers: {
                                    evtTime: (new Date).getTime(),
                                    dataType: i,
                                    evtId: ""
                                },
                                body: a
                            }];
                            y.iframeLoaded ? window.frames.oppo_report_iframe.postMessage(JSON.stringify(l), this.iframeHost) : this.createIframe(function () {
                                window.frames.oppo_report_iframe.postMessage(JSON.stringify(l), this.iframeHost), y.iframeLoaded = !0
                            });
                            var u = {
                                $os$: "android",
                                $ov$: n.osVersion,
                                $m$: n.model,
                                $im$: n.imei || "",
                                $w$: window.screen.width * window.devicePixelRatio,
                                $h$: window.screen.height * window.devicePixelRatio,
                                $pkg$: "com.android.browser",
                                $av$: n.appVersion,
                                $nt$: n.networkId,
                                $ca$: "0",
                                $ua$: navigator.userAgent || "",
                                $rf$: "",
                                $progress$: o.video && void 0 !== o.video.vPrs ? o.video.vPrs : "",
                                $lon$: "",
                                $lat$: "",
                                $ct$: "",
                                $dx$: o.mouseClient && void 0 !== o.mouseClient.downX ? o.mouseClient.downX : "",
                                $dy$: o.mouseClient && void 0 !== o.mouseClient.downY ? o.mouseClient.downY : "",
                                $ux$: o.mouseClient && void 0 !== o.mouseClient.upX ? o.mouseClient.upX : "",
                                $uy$: o.mouseClient && void 0 !== o.mouseClient.upY ? o.mouseClient.upY : ""
                            };
                            for (c = 0; c < s.trackingList.length; c++) {
                                var f = s.trackingList[c];
                                if (1 == f.trackingEvent && "click" === e || 2 == f.trackingEvent && "expose" === e || 10010 == f.trackingEvent && "play" === e && 0 == o.video.vPrs || 10011 == f.trackingEvent && "play" === e && 100 == o.video.vPrs)
                                    for (var h = 0; h < f.trackUrls.length; h++) {
                                        var v = g(f.trackUrls[h], u);
                                        this.sendRequest(v)
                                    }
                            }
                        }
                    }
                },
                sendRequest: function (e) {
                    try {
                        if (!e) return;
                        var o = new Image;
                        o.src = e, o.onload = o.onerror = function () {
                            o = null
                        }
                    } catch (e) {}
                },
                init: function () {
                    if (window.OppoWebPage && window.OppoWebPage.getCommonBrowserInfo) {
                        var e = JSON.parse(window.OppoWebPage.getCommonBrowserInfo());
                        this.commonParams.imei = e.uuid, this.commonParams.model = e.mobileName, this.commonParams.osVersion = e.colorOsVersion, this.commonParams.romVersion = e.mobileRomVersion, this.commonParams.androidVersion = e.androidReleaseVersion, this.commonParams.appVersion = e.browserVersion, this.commonParams.networkId = e.networkType
                    } else if (window.android && window.android.getDeviceInfo) {
                        e = JSON.parse(window.android.getDeviceInfo());
                        this.commonParams.imei = e.uuid, this.commonParams.model = e.mobileName, this.commonParams.osVersion = e.colorOsVersion, this.commonParams.romVersion = e.mobileRomVersion, this.commonParams.androidVersion = e.androidReleaseVersion, this.commonParams.networkId = e.netWorkType, this.commonParams.appVersion = window.android && window.android.getAppVersion && window.android.getAppVersion()
                    }
                    this.createIframe(function () {
                        y.iframeLoaded = !0
                    })
                }
            };
        y.init();
        var s = {
            exposeIdArr: [],
            exposeData: function (e, o) {
                if (e) {
                    var t = e.getBoundingClientRect();
                    0 !== t.height && 0 !== t.width && t.top <= document.documentElement.clientHeight && 0 <= t.bottom && t.left <= document.documentElement.clientWidth && 0 <= t.right && (o || (o = e.adData || {}), y.reportData("expose", o))
                }
            },
            init: function () {
                window.addEventListener("scroll", o(function () {
                    for (var e = document.querySelectorAll("iframe[_opunionexpose]"), o = 0; o < e.length; o++) s.exposeData(e[o])
                }, 1e3)), window.addEventListener("orientationchange", o(function () {
                    if (0 === window.orientation || 180 === window.orientation)
                        for (var e = document.querySelectorAll("iframe[_opunionexpose]"), o = 0; o < e.length; o++) s.exposeData(e[o])
                }, 300))
            }
        };
        s.init();
        var c = function (e, o, t, i) {
                if (0 !== e)
                    if (1 !== e) {
                        if (2 !== e)
                            if (3 !== e);
                            else if (o) {
                            if (-1 !== o.indexOf("mp/app/union")) o = "https://adsfs.oppomobile.com/mp/app/union/B" + ("N" === o.split("/index.html")[0].substr(-1) ? "N" : "") + "/index.html?" + o.split("?")[1] + (i ? "&dl=true" : "");
                            w ? setTimeout(function () {
                                window.location.href = o
                            }, 200) : window.open(o)
                        }
                    } else {
                        if (t) {
                            var n = document.createElement("iframe");
                            n.src = t, n.style.display = "none", document.body.appendChild(n), window.setTimeout(function () {
                                document.body.removeChild(n)
                            }, 300)
                        }
                        w ? setTimeout(function () {
                            window.location.href = o
                        }, 200) : window.open(o)
                    }
            },
            l = {
                wifi: 2,
                cellular: 3,
                "2g": 4,
                "3g": 5,
                "4g": 6,
                "5g": 7
            },
            t = function (e, o) {
                var t = "";
                return t = window.android && window.android.getGamePkgName ? window.android.getGamePkgName() || "com.oppo.mobaddemo" : window.location.host, {
                    apiVersion: y.commonParams.apiVersion,
                    media: {
                        id: e.mediaId || "",
                        bundle: t
                    },
                    pos: {
                        id: e.posId,
                        posType: o
                    },
                    device: {
                        ua: window.navigator.userAgent || "",
                        deviceType: 1,
                        model: y.commonParams.model || "",
                        os: "Android",
                        osv: y.commonParams.androidVersion,
                        colorOsv: y.commonParams.osVersion,
                        romv: y.commonParams.romVersion,
                        h: window.screen.height,
                        w: window.screen.width,
                        ppi: window.devicePixelRatio,
                        connectionType: l[y.commonParams.networkId.toLowerCase()] || 6,
                        did: y.commonParams.imei || "",
                        carrier: "unknown",
                        geo: e.geo,
                        ori: window.orientation
                    },
                    h5VC: y.commonParams.h5VC,
                    oprEnv: w ? 1 : 0
                }
            },
            i = [];
        n.prototype.load = function () {
            var e = d();
            if (y.commonParams.networkId = e, this.opt.req.device.connectionType = l[e.toLowerCase()] || 6, !this.iframe) {
                var o = document.getElementById(this.opt.id);
                o || (this.opt.id = "_" + Math.random().toString(36).slice(2), (o = document.createElement("div")).id = this.opt.id, document.body.appendChild(o)), this.banner = o;
                var t = document.createElement("iframe");
                t.src = "https://adsfs.oppomobile.com/mp/app/union/h5/banner.html", t.style.height = 0, t.style.border = "none", t.style.width = "100%", t.setAttribute("_opunionExpose", !0), this.iframe = t, o.appendChild(t);
                var i = this;
                t.onload = function () {
                    var e = {
                        type: "oup_bannerLoad",
                        opt: i.opt,
                        size: {
                            height: document.documentElement.clientHeight,
                            width: document.documentElement.clientWidth
                        }
                    };
                    this.contentWindow.postMessage(JSON.stringify(e), "*")
                }
            }
        }, n.prototype.bindEvent = function () {
            var r = this,
                e = window.getComputedStyle(r.banner, null).display;

            function d() {
                document.documentElement.clientHeight > document.documentElement.clientWidth ? (r.banner.style.display = e, r.iframe.contentWindow.postMessage(JSON.stringify({
                    type: "oup_bannerResize",
                    size: {
                        height: document.documentElement.clientHeight,
                        width: document.documentElement.clientWidth
                    }
                }), "*")) : r.banner.style.display = "none"
            }
            window.addEventListener("resize", d), d(), window.addEventListener("message", function e(o) {
                if (o.data) {
                    var t = "string" == typeof o.data ? JSON.parse(o.data) : o.data,
                        i = r.opt || {};
                    if (i.id && i.id === t.id) {
                        var n = t.type;
                        if ("ouc_bannerLoaded" === n) r.iframe.adData = t.adData, t.adData.imei && (y.commonParams.imei = t.adData.imei, r.opt.req.device.did = t.adData.imei), s.exposeData(r.iframe), r.loadCb && r.loadCb();
                        else if ("ouc_bannerClick" === n) {
                            y.reportData("click", m({
                                mouseClient: t.mouseClient
                            }, r.iframe.adData));
                            var a = r.iframe.adData.adList[0].materialList[0];
                            c(a.actionType, a.targetUrl, a.deepLink, a.immediateDL)
                        } else "ouc_bannerClose" === n ? (r.banner.parentNode.removeChild(r.banner), window.removeEventListener("message", e), window.removeEventListener("resize", d)) : "ouc_bannerChange" === n ? r.iframe.style.height = t.size + "px" : "ouc_bannerError" === n && r.errorCb && r.errorCb({
                            code: t.code,
                            msg: t.msg
                        })
                    }
                }
            })
        }, n.prototype.onLoad = function (e) {
            this.loadCb = e
        }, n.prototype.offLoad = function (e) {
            this.loadCb = null
        }, n.prototype.onError = function (e) {
            this.errorCb = e
        }, n.prototype.offError = function (e) {
            this.errorCb = null
        }, a.prototype.bindEvent = function () {
            var a = this;
            window.addEventListener("resize", function () {
                a.iframe.contentWindow.postMessage(JSON.stringify({
                    type: "ouc_modalResize",
                    size: {
                        height: document.documentElement.clientHeight,
                        width: document.documentElement.clientWidth
                    }
                }), "*")
            }), window.addEventListener("message", function (e) {
                if (e.data) {
                    var o = "string" == typeof e.data ? JSON.parse(e.data) : e.data,
                        t = a.opt || {};
                    if (t.id && t.id === o.id) {
                        var i = o.type;
                        if ("ouc_modalClose" === i) a.closeCb && a.closeCb(), a.modal.style.display = "none";
                        else if ("ouc_modalLoaded" === i) a.iframe.adData = o.adData, o.adData.imei && (y.commonParams.imei = o.adData.imei, a.opt.req.device.did = o.adData.imei), a.loadCb && a.loadCb();
                        else if ("ouc_modalError" === i) a.errorCb && a.errorCb({
                            code: o.code,
                            msg: o.msg
                        });
                        else if ("ouc_modalClick" === i) {
                            y.reportData("click", m({
                                mouseClient: o.mouseClient
                            }, a.iframe.adData));
                            var n = a.iframe.adData.adList[0].materialList[0];
                            c(n.actionType, n.targetUrl, n.deepLink, n.immediateDL)
                        }
                    }
                }
            })
        }, a.prototype.load = function () {
            var e = d();
            if (y.commonParams.networkId = e, this.opt.req.device.connectionType = l[e.toLowerCase()] || 6, this.iframe) {
                var o = {
                    type: "oup_modalLoad",
                    opt: this.opt,
                    size: {
                        height: document.documentElement.clientHeight,
                        width: document.documentElement.clientWidth
                    }
                };
                this.iframe.contentWindow.postMessage(JSON.stringify(o), "*")
            } else {
                var t = document.createElement("div");
                t.style.display = "none", t.style.position = "fixed", t.style.left = 0, t.style.right = 0, t.style.top = 0, t.style.bottom = 0, this.modal = t;
                var i = document.createElement("iframe");
                i.style.border = "none", i.style.width = "100%", i.style.height = "100%", i.style.background = "rgba(0, 0, 0, .7)", i.src = "https://adsfs.oppomobile.com/mp/app/union/h5/modal.html", this.iframe = i, t.appendChild(i), document.body.appendChild(t);
                var a = this;
                i.onload = function () {
                    var e = {
                        type: "oup_modalLoad",
                        opt: a.opt,
                        size: {
                            height: document.documentElement.clientHeight,
                            width: document.documentElement.clientWidth
                        }
                    };
                    this.contentWindow.postMessage(JSON.stringify(e), "*")
                }
            }
            var r = [],
                n = new Promise(function (e, o) {
                    r = [e, o]
                });
            a = this;
            return window.addEventListener("message", function e(o) {
                if (o.data) {
                    var t = "string" == typeof o.data ? JSON.parse(o.data) : o.data,
                        i = a.opt || {};
                    if (i.id && i.id === t.id) {
                        var n = t.type;
                        "ouc_modalLoaded" === n ? (r[0] && r[0](), window.removeEventListener("message", e)) : "ouc_modalError" === n && (r[1] && r[1]({
                            code: t.code,
                            msg: t.msg
                        }), window.removeEventListener("message", e))
                    }
                }
            }), n
        }, a.prototype.show = function () {
            var a = [],
                e = new Promise(function (e, o) {
                    a = [e, o]
                });
            this.iframe.contentWindow.postMessage(JSON.stringify({
                type: "oup_modalShow"
            }), "*");
            var r = this;
            return window.addEventListener("message", function e(o) {
                if (o.data) {
                    var t = "string" == typeof o.data ? JSON.parse(o.data) : o.data,
                        i = r.opt || {};
                    if (i.id && i.id === t.id) {
                        var n = t.type;
                        "ouc_modalCanShow" === n ? (r.modal.style.display = "block", s.exposeData(r.iframe), a[0] && a[0](), window.removeEventListener("message", e)) : "ouc_modalError" === n && (a[1] && a[1]({
                            code: t.code,
                            msg: t.msg
                        }), window.removeEventListener("message", e))
                    }
                }
            }), e
        }, a.prototype.onLoad = function (e) {
            this.loadCb = e
        }, a.prototype.offLoad = function (e) {
            this.loadCb = null
        }, a.prototype.onClose = function (e) {
            this.closeCb = e
        }, a.prototype.offClose = function (e) {
            this.closeCb = null
        }, a.prototype.onError = function (e) {
            this.errorCb = e
        }, a.prototype.offError = function (e) {
            this.errorCb = null
        }, r.prototype.bindEvent = function () {
            var r = this;
            window.addEventListener("resize", function () {
                r.iframe.contentWindow.postMessage(JSON.stringify({
                    type: "oup_videoResize",
                    size: {
                        height: document.documentElement.clientHeight,
                        width: document.documentElement.clientWidth
                    }
                }), "*")
            }), window.addEventListener("message", function (e) {
                if (e.data) {
                    var o = "string" == typeof e.data ? JSON.parse(e.data) : e.data,
                        t = r.opt || {};
                    if (t.id && t.id === o.id) {
                        var i = o.type;
                        if ("ouc_videoClose" === i) r.closeCb && r.closeCb({
                            isEnded: o.isEnded
                        }), r.video.style.display = "none";
                        else if ("ouc_videoEnd" === i);
                        else if ("ouc_videoLoaded" === i) r.iframe.adData = o.adData, o.adData.imei && (y.commonParams.imei = o.adData.imei, r.opt.req.device.did = o.adData.imei), r.loadCb && r.loadCb();
                        else if ("ouc_videoError" === i) r.errorCb && r.errorCb({
                            code: o.code,
                            msg: o.msg
                        });
                        else if ("ouc_videoClick" === i) {
                            y.reportData("click", m({
                                mouseClient: o.mouseClient
                            }, r.iframe.adData));
                            var n = r.iframe.adData.adList[0].materialList[0];
                            c(n.actionType, n.targetUrl, n.deepLink, n.immediateDL)
                        } else if ("ouc_videoProcess" === i && (y.reportData("play", m({
                                video: o.video
                            }, r.iframe.adData)), 100 === o.video.vPrs)) {
                            var a = (n = r.iframe.adData.adList[0].materialList[0]).landingPageUrl;
                            if (a) {
                                if (-1 !== a.indexOf("mp/app/union")) a = "https://adsfs.oppomobile.com/mp/app/union/B" + ("N" === a.split("/index.html")[0].substr(-1) ? "N" : "") + "/index.html?" + a.split("?")[1] + (n.immediateDL ? "&dl=true" : "");
                                w ? window.location.href = a : window.open(a)
                            }
                        }
                    }
                }
            })
        }, r.prototype.load = function () {
            var e = d();
            if (y.commonParams.networkId = e, this.opt.req.device.connectionType = l[e.toLowerCase()] || 6, this.iframe) {
                var o = {
                    type: "oup_videoLoad",
                    opt: this.opt,
                    size: {
                        height: document.documentElement.clientHeight,
                        width: document.documentElement.clientWidth
                    }
                };
                this.iframe.contentWindow.postMessage(JSON.stringify(o), "*")
            } else {
                var t = document.createElement("div");
                t.style.display = "none", t.style.position = "fixed", t.style.left = 0, t.style.right = 0, t.style.top = 0, t.style.bottom = 0, this.video = t;
                var i = document.createElement("iframe");
                i.style.border = "none", i.style.width = "100%", i.style.height = "100%", i.style.background = "#000", i.src = "https://adsfs.oppomobile.com/mp/app/union/h5/video.html", this.iframe = i, t.appendChild(i), document.body.appendChild(t);
                var a = this;
                i.onload = function () {
                    var e = {
                        type: "oup_videoLoad",
                        opt: a.opt,
                        size: {
                            height: document.documentElement.clientHeight,
                            width: document.documentElement.clientWidth
                        }
                    };
                    this.contentWindow.postMessage(JSON.stringify(e), "*")
                }
            }
            var r = [],
                n = new Promise(function (e, o) {
                    r = [e, o]
                });
            a = this;
            return window.addEventListener("message", function e(o) {
                if (o.data) {
                    var t = "string" == typeof o.data ? JSON.parse(o.data) : o.data,
                        i = a.opt || {};
                    if (i.id && i.id === t.id) {
                        var n = t.type;
                        "ouc_videoLoaded" === n ? (r[0] && r[0](), window.removeEventListener("message", e)) : "ouc_videoError" === n && (r[1] && r[1]({
                            code: t.code,
                            msg: t.msg
                        }), window.removeEventListener("message", e))
                    }
                }
            }), n
        }, r.prototype.show = function () {
            var a = [],
                e = new Promise(function (e, o) {
                    a = [e, o]
                });
            this.iframe.contentWindow.postMessage(JSON.stringify({
                type: "oup_videoShow"
            }), "*");
            var r = this;
            return window.addEventListener("message", function e(o) {
                if (o.data) {
                    var t = "string" == typeof o.data ? JSON.parse(o.data) : o.data,
                        i = r.opt || {};
                    if (i.id && i.id === t.id) {
                        var n = t.type;
                        "ouc_videoCanShow" === n ? (r.video.style.display = "block", s.exposeData(r.iframe), a[0] && a[0](), window.removeEventListener("message", e)) : "ouc_videoError" === n && (a[1] && a[1]({
                            code: t.code,
                            msg: t.msg
                        }), window.removeEventListener("message", e))
                    }
                }
            }), e
        }, r.prototype.onLoad = function (e) {
            this.loadCb = e
        }, r.prototype.offLoad = function (e) {
            this.loadCb = null
        }, r.prototype.onClose = function (e) {
            this.closeCb = e
        }, r.prototype.offClose = function (e) {
            this.closeCb = null
        }, r.prototype.onError = function (e) {
            this.errorCb = e
        }, r.prototype.offError = function (e) {
            this.errorCb = null
        };
        var u = {};
        f.prototype.load = function () {
            var e = d();
            if (y.commonParams.networkId = e, this.opt.req.device.connectionType = l[e.toLowerCase()] || 6, this.iframe) {
                var o = {
                    type: "oup_nativeLoad",
                    opt: this.opt,
                    size: {
                        height: document.documentElement.clientHeight,
                        width: document.documentElement.clientWidth
                    }
                };
                this.iframe.contentWindow.postMessage(JSON.stringify(o), "*")
            } else {
                var t = document.createElement("div");
                t.style.display = "none", this.native = t;
                var i = document.createElement("iframe");
                i.src = "https://adsfs.oppomobile.com/mp/app/union/h5/native.html", this.iframe = i, t.appendChild(i), document.body.appendChild(t);
                var m = this;
                i.onload = function () {
                    var e = {
                        type: "oup_nativeLoad",
                        opt: m.opt,
                        size: {
                            height: document.documentElement.clientHeight,
                            width: document.documentElement.clientWidth
                        }
                    };
                    this.contentWindow.postMessage(JSON.stringify(e), "*")
                }
            }
            var c = [],
                n = new Promise(function (e, o) {
                    c = [e, o]
                });
            m = this;
            return window.addEventListener("message", function e(o) {
                var t = o.data || {},
                    i = m.opt || {};
                if (i.id && i.id === t.id) {
                    var n = t.type;
                    if ("ouc_nativeLoaded" === n) {
                        for (var a = {
                                list: [],
                                code: t.adData.code
                            }, r = 0; r < t.adData.adList.length; r++) {
                            var d = t.adData.adList[r],
                                s = d.materialList[0];
                            a.list.push({
                                title: s.title,
                                desc: s.desc,
                                creativeType: s.creativeType,
                                logo: d.logoFile.url,
                                img: p(s.fileList, "url")
                            })
                        }
                        c[0] && c[0](a), window.removeEventListener("message", e)
                    } else "ouc_nativeError" === n && (c[1] && c[1]({
                        code: t.code,
                        msg: t.msg
                    }), window.removeEventListener("message", e))
                }
            }), n
        }, f.prototype.bindEvent = function () {
            var s = this;
            window.addEventListener("resize", function () {
                s.iframe.contentWindow.postMessage(JSON.stringify({
                    type: "ouc_nativeResize",
                    size: {
                        height: document.documentElement.clientHeight,
                        width: document.documentElement.clientWidth
                    }
                }), "*")
            }), window.addEventListener("message", function (e) {
                if (e.data) {
                    var o = "string" == typeof e.data ? JSON.parse(e.data) : e.data,
                        t = s.opt || {};
                    if (t.id && t.id === o.id) {
                        var i = o.type;
                        if ("ouc_nativeLoaded" === i) {
                            u[t.id] = o.adData, o.adData.imei && (y.commonParams.imei = o.adData.imei, s.opt.req.device.did = o.adData.imei);
                            for (var n = {
                                    list: [],
                                    code: o.adData.code
                                }, a = 0; a < o.adData.adList.length; a++) {
                                var r = o.adData.adList[a],
                                    d = r.materialList[0];
                                n.list.push({
                                    title: d.title,
                                    desc: d.desc,
                                    creativeType: d.creativeType,
                                    logo: r.logoFile.url,
                                    img: p(d.fileList, "url")
                                })
                            }
                            s.loadCb && s.loadCb(n)
                        } else if ("ouc_nativeError" === i) s.errorCb && s.errorCb({
                            code: o.code,
                            msg: o.msg
                        });
                        else if ("ouc_nativeClick" === i) {
                            y.reportData("click", m({
                                mouseClient: o.mouseClient
                            }, u[s.opt.id]));
                            d = u[s.opt.id].adList[0].materialList[0];
                            c(d.actionType, d.targetUrl, d.deepLink, d.immediateDL)
                        }
                    }
                }
            })
        }, f.prototype.onLoad = function (e) {
            this.loadCb = e
        }, f.prototype.offLad = function (e) {
            this.loadCb = null
        }, f.prototype.onError = function (e) {
            this.errorCb = e
        }, f.prototype.offError = function (e) {
            this.errorCb = null
        }, f.prototype.doClick = function (e) {
            if (e && !isNaN(+e.index)) {
                var o = u[this.opt.id].adList[e.index],
                    t = m({}, u[this.opt.id], {
                        adList: [o]
                    });
                y.reportData("click", m({
                    mouseClient: e && e.mouse
                }, t));
                var i = o.materialList[0];
                c(i.actionType, i.targetUrl, i.deepLink, i.immediateDL)
            }
        }, f.prototype.doExpose = function (e) {
            if (e && !isNaN(+e.index)) {
                var o = document.getElementById(e.containerId),
                    t = u[this.opt.id].adList[e.index],
                    i = m({}, u[this.opt.id], {
                        adList: [t]
                    });
                s.exposeData(o, i)
            }
        }, window.opUnion = {
            createBannerAd: function (e) {
                return new n(e)
            },
            createInterstitialAd: function (e) {
                return new a(e)
            },
            createVideoAd: function (e) {
                return new r(e)
            },
            createNativeAd: function (e) {
                return new f(e)
            }
        }
    } else toolsLog("不支持该环境");

    function n(e) {
        var o = t(e, 1); - 1 === i.indexOf(e.containerId) && (i.push(e.containerId), y.commonParams.systemId = e.mediaId || "", this.opt = {
            id: e.containerId,
            req: o
        }, this.load(), this.bindEvent())
    }

    function a(e) {
        var o = t(e, 2);
        this.opt = {
            id: "_" + Math.random().toString(36).slice(2),
            req: o
        }, y.commonParams.systemId = e.mediaId || "", this.load().catch(function () {}), this.bindEvent()
    }

    function r(e) {
        var o = t(e, 64);
        this.opt = {
            id: "_" + Math.random().toString(36).slice(2),
            req: o
        }, y.commonParams.systemId = e.mediaId || "", this.load().catch(function () {}), this.bindEvent()
    }

    function f(e) {
        var o = t(e, 8);
        y.commonParams.systemId = e.mediaId || "", this.opt = {
            id: "_" + Math.random().toString(36).slice(2),
            req: o
        }, this.bindEvent()
    }
};