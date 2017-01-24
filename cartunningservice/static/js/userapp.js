var dpfoffservice_ui = angular.module("dpfoffservice.ui.layout", []).factory("layoutService", ["$timeout", "$rootScope", function() {
    var n = this;
    return n.bodyHeight = 0, n.navBarHeight = 0, n.pageWrapperHeight = 0, n.observerCallbacks = [], n.observerResizeCallbacks = [], n.rows = [], n.apply = function() {
        n.applyResize();
        n.applyInternal()
    }, n.applyInternal = function() {
        angular.forEach(n.observerCallbacks, function(n) {
            n()
        })
    }, n.applyResize = function() {
        angular.forEach(n.observerResizeCallbacks, function(n) {
            n()
        })
    }, n.registerObserverCallback = function(t) {
        n.observerCallbacks.push(t)
    }, n.registerObserverResizeCallback = function(t) {
        n.observerResizeCallbacks.push(t)
    }, n.addRow = function(t) {
        t != null && n.rows.push(t)
    }, n.clearRows = function() {
        n.rows = []
    }, n
}]).directive("layoutBody", ["layoutService", "$window", function(n, t) {
    return {
        restrict: "A",
        link: function(i) {
            i.calculate = function() {
                n.bodyHeight = t.innerHeight;
                n.applyInternal()
            };
            n.registerObserverResizeCallback(function() {
                i.calculate()
            });
            angular.element(t).bind("resize", function() {
                n.applyResize()
            });
            i.calculate()
        }
    }
}]).directive("layoutNavBar", ["layoutService", function(n) {
    return {
        restrict: "A",
        link: function(t, i) {
            t.calculate = function() {
                n.navBarHeight = i.outerHeight(!0);
                n.applyInternal()
            };
            n.registerObserverResizeCallback(function() {
                n.navBarHeight = i.outerHeight(!0)
            });
            t.calculate()
        }
    }
}]).directive("layoutPageWrapper", ["layoutService", function(n) {
    return {
        restrict: "A",
        link: function(t, i) {
            t.setHeight = function() {
                n.pageWrapperHeight = n.bodyHeight - n.navBarHeight - 20;
                i.css("min-height", n.pageWrapperHeight + "px")
            };
            t.setHeight();
            n.registerObserverCallback(function() {
                t.setHeight()
            })
        }
    }
}]).directive("layoutRow", ["layoutService", function(n) {
    return {
        restrict: "A",
        link: function(t, i) {
            t.calculate = function() {
                n.addRow(i);
                n.applyInternal()
            };
            t.calculate()
        }
    }
}]).directive("layoutFill", ["layoutService", function(n) {
    return {
        restrict: "A",
        link: function(t, i) {
            t.setHeight = function() {
                var t = 0;
                angular.forEach(n.rows, function(n) {
                    t = t + n.outerHeight(!0)
                });
                i.css("height", n.pageWrapperHeight - t + "px")
            };
            t.setHeight();
            n.registerObserverCallback(function() {
                t.setHeight()
            })
        }
    }
}]).directive("scrollableTable", ["layoutService", function(n) {
    return {
        restrict: "A",
        link: function(t, r, u) {
            t.recalculateColumns = function() {
                var n = [],
                    f, e, o;
                r.find("thead th").each(function(t, i) {
                    var r = $(i).attr("sc-width"),
                        u = $(i).attr("sc-min-width");
                    r == null && (r = 0);
                    u == null && (u = 0);
                    n.push({
                        w: parseInt(r),
                        mw: parseInt(u)
                    })
                });
                var t = 0,
                    u = 0,
                    s = 0,
                    h = 0;
                for (i = 0; i < n.length; i++) f = n[i], t = t + f.w, u = u + f.mw, f.w > 0 && (s = s + 1), f.mw > 0 && (h = h + 1);
                e = r.innerWidth();
                o = e - t - u;
                o >= 0 ? (r.find("thead th").each(function(i, r) {
                    if (i >= 0 && i < n.length) {
                        var f = n[i];
                        f.w > 0 ? $(r).css("width", f.w + "px") : $(r).css("width", (e - t) / u * f.mw + "px")
                    }
                }), r.find("tbody tr:first-child:not('.table-progress') td").each(function(i, r) {
                    if (i >= 0 && i < n.length) {
                        var f = n[i],
                            o = 0;
                        i == n.length - 1 && (o = 17);
                        f.w > 0 ? $(r).css("width", f.w - o + "px") : $(r).css("width", (e - t) / u * f.mw - o + "px")
                    }
                })) : (r.find("thead th").each(function(i, r) {
                    if (i >= 0 && i < n.length) {
                        var f = n[i],
                            e = f.w;
                        f.mw > 0 && (e = f.mw);
                        $(r).css("width", e + o / (t + u) * e + "px")
                    }
                }), r.find("tbody tr:first-child:not('.table-progress') td").each(function(i, r) {
                    var f, e, c;
                    i >= 0 && i < n.length && (f = n[i], e = f.w, f.mw > 0 && (e = f.mw), c = 0, i == n.length - 1 && (c = 17 - (s + h)), $(r).css("width", e + o / (t + u) * e - c + "px"))
                }))
            };
            n.registerObserverCallback(function() {
                t.recalculateColumns()
            });
            t.$watch(u.scrollableTable, function() {
                n.applyInternal()
            });
            t.recalculateColumns()
        }
    }
}]).directive("scrollBottom", function() {
    return {
        scope: {
            scrollBottom: "="
        },
        link: function(n, t) {
            n.$watchCollection("scrollBottom", function(n) {
                n && $(t).scrollTop($(t)[0].scrollHeight)
            })
        }
    }
}).filter("localTime", ["dpfoffservice.ui.Strings", function(n) {
    return function(t) {
        return t ? new Date(t).toLocaleDateString(n.Locale, {
            year: "numeric",
            month: n.MonthFormat,
            day: "numeric",
            hour: "numeric",
            minute: "numeric"
        }) : null
    }
}]).filter("yesNo", ["dpfoffservice.ui.Strings", function(n) {
    return function(t) {
        return typeof t != "undefined" && t != null && t == !0 ? n.Yes : n.No
    }
}]).filter("unsafe", ["$sce", function(n) {
    return function(t) {
        return typeof t != "undefined" && t != null ? n.trustAsHtml(t) : t
    }
}]);
angular.module("dpfoffservice.ui", ["dpfoffservice.ui.tpls", "dpfoffservice.ui.contextmenu", "dpfoffservice.ui.modal", "dpfoffservice.ui.pagination", "dpfoffservice.ui.custom"]);
angular.module("dpfoffservice.ui.tpls", ["uib/template/pagination/pagination.html"]);
angular.module("dpfoffservice.ui.contextmenu", []).directive("contextMenu", function() {
    var n = function(n, t, i) {
        var r, u, f, s;
        r || (r = angular.element);
        r(t.currentTarget).addClass("context");
        u = r("<div>");
        u.addClass("ui dropdown");
        f = r("<div>");
        f.addClass("ui menu");
        f.attr({
            role: "menu"
        });
        angular.forEach(i, function(i) {
            var e = null;
            if (i === null) e = r("<div>"), e.addClass("divider");
            else {
                e = r("<a>");
                e.addClass("item");
                e.attr({
                    tabindex: "-1",
                    href: "#"
                });
                e.text(typeof i[0] == "string" ? i[0] : i[0].call(n, n));
                e.on("click", function(f) {
                    f.preventDefault();
                    n.$apply(function() {
                        r(t.currentTarget).removeClass("context");
                        u.remove();
                        i[1].call(n, n)
                    })
                })
            }
            f.append(e)
        });
        u.append(f);
        s = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
        u.css({
            width: "100%",
            height: s + "px",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 9999
        });
        r(document).find("body").append(u);
        u.on("mousedown", function(n) {
            r(n.target).hasClass("dropdown") && (r(t.currentTarget).removeClass("context"), u.remove())
        }).on("contextmenu", function(n) {
            r(n.currentTarget).removeClass("context");
            n.preventDefault();
            u.remove()
        });
        var e = t.pageX,
            o = t.pageY,
            h = f.innerHeight(),
            c = f.innerHeight(),
            l = document.body.clientHeight,
            a = document.body.clientWidth;
        o > l - h && (o = l - h);
        e > a - c && (e = a - c);
        f.css({
            display: "block",
            position: "absolute",
            left: e + "px",
            top: o + "px"
        })
    };
    return function(t, i, r) {
        i.on("contextmenu", function(i) {
            t.$apply(function() {
                i.preventDefault();
                var u = t.$eval(r.contextMenu);
                if (u instanceof Array) n(t, i, u);
                else throw '"' + r.contextMenu + '" not an array';
            })
        })
    }
});
angular.module("dpfoffservice.ui.custom", []).directive("myEnter", function() {
    return function(n, t, i) {
        t.bind("keydown keypress", function(t) {
            t.which === 13 && (n.$apply(function() {
                n.$eval(i.myEnter)
            }), t.preventDefault())
        })
    }
});
angular.module("dpfoffservice.ui.modal", []).directive("modal", function() {
    return {
        restrict: "E",
        replace: !0,
        transclude: !0,
        require: "ngModel",
        template: '<div class="ui modal" ng-transclude><\/div>',
        link: function(n, t, i, r) {
            t.modal({
                onHide: function() {
                    r.$setViewValue(!1)
                }
            });
            n.$watch(function() {
                return r.$modelValue
            }, function(n) {
                t.modal(n ? "show" : "hide")
            });
            n.$on("$destroy", function() {
                t.modal("hide");
                t.remove()
            })
        }
    }
}).directive("smallmodal", function() {
    return {
        restrict: "E",
        replace: !0,
        transclude: !0,
        require: "ngModel",
        template: '<div class="ui small modal" ng-transclude><\/div>',
        link: function(n, t, i, r) {
            t.modal({
                onHide: function() {
                    r.$setViewValue(!1)
                }
            });
            n.$watch(function() {
                return r.$modelValue
            }, function(n) {
                t.modal(n ? "show" : "hide")
            });
            n.$on("$destroy", function() {
                t.modal("hide");
                t.remove()
            })
        }
    }
}).directive("smallnonclosablemodal", function() {
    return {
        restrict: "E",
        replace: !0,
        transclude: !0,
        require: "ngModel",
        template: '<div class="ui small modal" ng-transclude><\/div>',
        link: function(n, t, i, r) {
            t.modal({
                onHide: function() {
                    r.$setViewValue(!1)
                },
                closable: !1
            });
            n.$watch(function() {
                return r.$modelValue
            }, function(n) {
                t.modal(n ? "show" : "hide")
            });
            n.$on("$destroy", function() {
                t.modal("hide");
                t.remove()
            })
        }
    }
});
angular.module("dpfoffservice.ui.paging", []).factory("uibPaging", ["$parse", function(n) {
    return {
        create: function(t, i, r) {
            t.setNumPages = r.numPages ? n(r.numPages).assign : angular.noop;
            t.ngModelCtrl = {
                $setViewValue: angular.noop
            };
            t._watchers = [];
            t.init = function(n, u) {
                t.ngModelCtrl = n;
                t.config = u;
                n.$render = function() {
                    t.render()
                };
                r.itemsPerPage ? t._watchers.push(i.$parent.$watch(r.itemsPerPage, function(n) {
                    t.itemsPerPage = parseInt(n, 10);
                    i.totalPages = t.calculateTotalPages();
                    t.updatePage()
                })) : t.itemsPerPage = u.itemsPerPage;
                i.$watch("totalItems", function(n, r) {
                    (angular.isDefined(n) || n !== r) && (i.totalPages = t.calculateTotalPages(), t.updatePage())
                })
            };
            t.calculateTotalPages = function() {
                var n = t.itemsPerPage < 1 ? 1 : Math.ceil(i.totalItems / t.itemsPerPage);
                return Math.max(n || 0, 1)
            };
            t.render = function() {
                i.page = parseInt(t.ngModelCtrl.$viewValue, 10) || 1
            };
            i.selectPage = function(n, r) {
                r && r.preventDefault();
                var u = !i.ngDisabled || !r;
                u && i.page !== n && n > 0 && n <= i.totalPages && (r && r.target && r.target.blur(), t.ngModelCtrl.$setViewValue(n), t.ngModelCtrl.$render())
            };
            i.getText = function(n) {
                return i[n + "Text"] || t.config[n + "Text"]
            };
            i.noPrevious = function() {
                return i.page === 1
            };
            i.noNext = function() {
                return i.page === i.totalPages
            };
            t.updatePage = function() {
                t.setNumPages(i.$parent, i.totalPages);
                i.page > i.totalPages ? i.selectPage(i.totalPages) : t.ngModelCtrl.$render()
            };
            i.$on("$destroy", function() {
                while (t._watchers.length) t._watchers.shift()()
            })
        }
    }
}]);
angular.module("dpfoffservice.ui.pagination", ["dpfoffservice.ui.paging"]).controller("UibPaginationController", ["$scope", "$attrs", "$parse", "uibPaging", "uibPaginationConfig", function(n, t, i, r, u) {
    function e(n, t, i) {
        return {
            number: n,
            text: t,
            active: i
        }
    }

    function v(n, t) {
        var u = [],
            i = 1,
            r = t,
            c = angular.isDefined(f) && f < t,
            s, v, y, p, w, b, k, d;
        for (c && (h ? (i = Math.max(n - Math.floor(f / 2), 1), r = i + f - 1, r > t && (r = t, i = r - f + 1)) : (i = (Math.ceil(n / f) - 1) * f + 1, r = Math.min(i + f - 1, t))), s = i; s <= r; s++) v = e(s, a(s), s === n), u.push(v);
        return c && f > 0 && (!h || l || o) && (i > 1 && ((!o || i > 3) && (y = e(i - 1, "...", !1), u.unshift(y)), o && (i === 3 && (p = e(2, "2", !1), u.unshift(p)), w = e(1, "1", !1), u.unshift(w))), r < t && ((!o || r < t - 2) && (b = e(r + 1, "...", !1), u.push(b)), o && (r === t - 2 && (k = e(t - 1, t - 1, !1), u.push(k)), d = e(t, t, !1), u.push(d)))), u
    }
    var s = this,
        f = angular.isDefined(t.maxSize) ? n.$parent.$eval(t.maxSize) : u.maxSize,
        h = angular.isDefined(t.rotate) ? n.$parent.$eval(t.rotate) : u.rotate,
        l = angular.isDefined(t.forceEllipses) ? n.$parent.$eval(t.forceEllipses) : u.forceEllipses,
        o = angular.isDefined(t.boundaryLinkNumbers) ? n.$parent.$eval(t.boundaryLinkNumbers) : u.boundaryLinkNumbers,
        a = angular.isDefined(t.pageLabel) ? function(i) {
            return n.$parent.$eval(t.pageLabel, {
                $page: i
            })
        } : angular.identity,
        c;
    n.boundaryLinks = angular.isDefined(t.boundaryLinks) ? n.$parent.$eval(t.boundaryLinks) : u.boundaryLinks;
    n.directionLinks = angular.isDefined(t.directionLinks) ? n.$parent.$eval(t.directionLinks) : u.directionLinks;
    r.create(this, n, t);
    t.maxSize && s._watchers.push(n.$parent.$watch(i(t.maxSize), function(n) {
        f = parseInt(n, 10);
        s.render()
    }));
    c = this.render;
    this.render = function() {
        c();
        n.page > 0 && n.page <= n.totalPages && (n.pages = v(n.page, n.totalPages))
    }
}]).constant("uibPaginationConfig", {
    itemsPerPage: 10,
    boundaryLinks: !1,
    boundaryLinkNumbers: !1,
    directionLinks: !0,
    firstText: "First",
    previousText: "Previous",
    nextText: "Next",
    lastText: "Last",
    rotate: !0,
    forceEllipses: !1
}).directive("uibPagination", ["$parse", "uibPaginationConfig", function(n, t) {
    return {
        restrict: "E",
        scope: {
            totalItems: "=",
            firstText: "@",
            previousText: "@",
            nextText: "@",
            lastText: "@",
            ngDisabled: "="
        },
        require: ["uibPagination", "?ngModel"],
        controller: "UibPaginationController",
        controllerAs: "pagination",
        templateUrl: function(n, t) {
            return t.templateUrl || "uib/template/pagination/pagination.html"
        },
        replace: !0,
        link: function(n, i, r, u) {
            var e = u[0],
                f = u[1];
            f && e.init(f, t)
        }
    }
}]).directive("script", function() {
    return {
        restrict: "E",
        scope: !1,
        link: function(n, t, i) {
            if (i.type === "text/lazy") {
                var r = t.text(),
                    u = new Function(r);
                u()
            }
        }
    }
}).directive("scrollTop", function() {
    return {
        restrict: "A",
        link: function(n, t, i) {
            n.$watch(i.scrollTop, function() {})
        }
    }
});
angular.module("uib/template/pagination/pagination.html", []).run(["$templateCache", function(n) {
    n.put("uib/template/pagination/pagination.html", '<div class="ui right floated pagination menu">\n  <a ng-if="::boundaryLinks" ng-class="{disabled: noPrevious()||ngDisabled}" ng-click="selectPage(1, $event)" class="icon item"><i class="angle double left icon"><\/i><\/a>\n  <a ng-if="::directionLinks" ng-class="{disabled: noPrevious()||ngDisabled}" ng-click="selectPage(page - 1, $event)" class="icon item"><i class="angle left icon"><\/i><\/a>\n  <a ng-repeat="page in pages track by $index" ng-class="{active: page.active,disabled: ngDisabled&&!page.active}" ng-click="selectPage(page.number, $event)" class="item">{{page.text}}<\/a>\n  <a ng-if="::directionLinks" ng-class="{disabled: noNext()||ngDisabled}" ng-click="selectPage(page + 1, $event)" class="icon item"><i class="angle right icon"><\/i><\/a>\n  <a ng-if="::boundaryLinks" ng-class="{disabled: noNext()||ngDisabled}" ng-click="selectPage(totalPages, $event)" class="icon item"><i class="angle double right icon"><\/i><\/a>\n<\/div>\n')
}]);
dpfoffservice_ui.factory("dpfoffservice.ui.Strings", [function() {
    return {
        MonthFormat: "numeric",
        Locale: "ru-RU",
        Yes: "Да",
        No: "Нет"
    }
}]);
var mainApp = angular.module("mainApp", ["ngRoute", "appControllers", "ngFileUpload", "dpfoffservice.ui", "dpfoffservice.ui.layout", "appEditors"]),
    appControllers = angular.module("appControllers", []),
    appEditors = angular.module("appEditors", []);
mainApp.factory("fragmentService", [function() {
    var n = {};
    return n.getFragment = function() {
        return window.location.hash.indexOf("#/") == 0 ? n.parseQueryString(window.location.hash.substr(2)) : window.location.hash.indexOf("#") == 0 ? n.parseQueryString(window.location.hash.substr(1)) : {}
    }, n.getQueryStringFragment = function() {
        if (window.location.hash == null || window.location.hash == "") return {};
        var t = window.location.hash.indexOf("?");
        return t < 0 ? {} : n.parseQueryString(window.location.hash.substr(t + 1))
    }, n.parseQueryString = function(n) {
        var u = {},
            f, t, i, e, o, s, h, r;
        if (n == null) return u;
        for (f = n.split("&"), r = 0; r < f.length; r++) t = f[r], i = t.indexOf("="), i == -1 ? (e = t, o = null) : (e = t.substr(0, i), o = t.substr(i + 1)), s = decodeURIComponent(e), h = decodeURIComponent(o), u[s] = h;
        return u
    }, n
}]);
mainApp.factory("authInterceptor", ["$rootScope", "$q", "$location", "userLangService", "fragmentService", function(n, t, i, r, u) {
    var f = sessionStorage.getItem("accessToken"),
        e;
    return f || (e = u.getFragment(), e.access_token ? (i.url(e.state || "/"), f = e.access_token, sessionStorage.setItem("accessToken", f)) : window.location = "/account/authorize?client_id=control_panel&response_type=token&state=" + encodeURIComponent(i.url()) + "&lang=" + r.getLang()), {
        request: function(n) {
            return n.headers = n.headers || {}, f && (n.headers.Authorization = "Bearer " + f), n
        },
        response: function(n) {
            return n || t.when(n)
        },
        responseError: function(n) {
            return f && n.status == 401 && logout(), t.reject(n)
        }
    }
}]);
mainApp.factory("queryStringService", ["fragmentService", function(n) {
    var t = this;
    return t.getUrlParameter = function(t) {
        return n.getQueryStringFragment()[t]
    }, t
}]);
mainApp.config(["$httpProvider", function(n) {
    n.interceptors.push("authInterceptor")
}]);
mainApp.factory("errorHandler", function() {
    return {
        getHttpReason: function(n, t) {
            var r = t,
                i = n;
            return (typeof r == "undefined" || r == null) && (r = 404), typeof i == "undefined" || i == null ? i = {
                isError: !0,
                message: "Unknown Error"
            } : ((typeof i.message == "undefined" || i.message == null) && (r == 404 ? i.message = "Connection Error" : r == 400 ? i.message = "Bad Request" : r == 500 && (i.message = "Internal Server Error")), (typeof i.isError == "undefined" || i.isError == null) && (i.isError = !0)), {
                status: r,
                data: i
            }
        }
    }
});
mainApp.run(["$location", "$rootScope", "layoutService", "pageMenuService", function(n, t, i, r) {
    t.$on("$routeChangeSuccess", function(u, f) {
        t.title = f.$$route.title;
        t.$backPath = f.$$route.backPath;
        n.$$search = {};
        i.clearRows();
        i.apply();
        r.clear()
    })
}]);
mainApp.factory("notificationService", ["$timeout", function(n) {
    var t = this;
    return t.isInitialized = !1, t.initialize = function(i) {
        var r, f;
        if (!t.isInitialized) {
            if (typeof i.signalR != "function") throw new Error("SignalR: SignalR is not loaded. Please ensure jquery.signalR-x.js is referenced before ~/signalr/js.");
            r = i.signalR;

            function e(n, t) {
                return function() {
                    t.apply(n, i.makeArray(arguments))
                }
            }

            function u(n, t) {
                var f, r, u, o, s;
                for (f in n)
                    if (n.hasOwnProperty(f)) {
                        if (r = n[f], !r.hubName) continue;
                        s = t ? r.on : r.off;
                        for (u in r.client)
                            if (r.client.hasOwnProperty(u)) {
                                if (o = r.client[u], !i.isFunction(o)) continue;
                                s.call(r, u, e(r, o))
                            }
                    }
            }
            i.hubConnection.prototype.createHubProxies = function() {
                var n = {};
                return this.starting(function() {
                    u(n, !0);
                    this._registerSubscribedHubs()
                }).disconnected(function() {
                    u(n, !1)
                }), n.userNotificationHub = this.createHubProxy("userNotificationHub"), n.userNotificationHub.client = {}, n.userNotificationHub.server = {}, n
            };
            r.hub = i.hubConnection("/signalr", {
                useDefaultPath: !1
            });
            i.extend(r, r.hub.createHubProxies());
            f = i.connection.userNotificationHub;
            f.client.sendToUser = function(n) {
                typeof n != "undefined" && n != null && n.messageType == 1 && typeof t.taskStatusChanged != "undefined" && t.taskStatusChanged != null && t.taskStatusChanged(n)
            };
            i.connection.hub.disconnected(function() {
                n(i.connection.hub.start(), 1e3)
            });
            i.connection.hub.start();
            t.isInitialized = !0
        }
    }, t.taskStatusChanged = function() {}, t
}]);
mainApp.directive("notificationHub", ["notificationService", function(n) {
    return {
        restrict: "A",
        link: function() {
            n.initialize($)
        }
    }
}]);
mainApp.factory("downloadService", ["$window", function(n) {
    return {
        download: function(t) {
            n.open(t, "_self")
        }
    }
}]);
mainApp.factory("paymentService", ["$window", "userLangService", function(n, t) {
    return {
        getIcon: function(n) {
            var i = "/images/PaymentSources/" + t.getLang() + "/";
            return n == 1 ? i + "PayPal.png" : n == 2 ? i + "YandexMoney.png" : n == 3 ? i + "Cards.png" : n == 4 ? i + "WebMoney.png" : n == 5 ? i + "Cash.png" : n == 6 ? i + "SberbankOnline.png" : n == 7 ? i + "AlfaBank.png" : n == 8 ? i + "Promsvyazbank.png" : n == 9 ? i + "MasterPass.png" : ""
        },
        pay: function(i, r) {
            var u = "/" + t.getLang() + "/payment/do?";
            u = u + "paymentSourceID=" + escape(i);
            u = u + "&taskID=" + escape(r);
            u = u + "&location=" + escape(n.location.href);
            n.open(u, "_self")
        }
    }
}]);
mainApp.factory("uuid", [function() {
    return {
        "new": function() {
            var n = (new Date).getTime();
            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(t) {
                var i = (n + Math.random() * 16) % 16 | 0;
                return n = Math.floor(n / 16), (t == "x" ? i : i & 3 | 8).toString(16)
            })
        }
    }
}]);
mainApp.factory("pageMenuService", [function() {
    var n = this;
    return n.title = "", n.items = [], n.clear = function() {
        n.items = [];
        n.title = ""
    }, n
}]);
mainApp.config(["$routeProvider", "userLangServiceProvider", function(n, t) {
    n.caseInsensitiveMatch = !0;
    n.when("/", {
        templateUrl: function() {
            return "/" + t.getLang() + "/UserViews/Tasks"
        },
        controller: "tasksCtrl",
        reloadOnSearch: !1,
        title: "Tasks"
    }).when("/createtask", {
        templateUrl: function() {
            return "/" + t.getLang() + "/UserViews/CreateTask"
        },
        controller: "createTaskCtrl",
        title: "Create Task",
        backPath: "/"
    }).when("/viewtask/:taskID", {
        templateUrl: function() {
            return "/" + t.getLang() + "/UserViews/ViewTask"
        },
        controller: "viewTaskCtrl",
        title: "View Task",
        backPath: "/"
    }).when("/userprofile", {
        templateUrl: function() {
            return "/" + t.getLang() + "/UserViews/UserProfile"
        },
        controller: "userProfileController",
        title: "User Profile",
        backPath: "/"
    }).when("/settings", {
        templateUrl: function() {
            return "/" + t.getLang() + "/UserViews/Settings"
        },
        controller: "settingsController",
        title: "Settings",
        backPath: "/"
    }).when("/billing", {
        templateUrl: function() {
            return "/" + t.getLang() + "/UserViews/Billing"
        },
        controller: "billingController",
        title: "Billing",
        backPath: "/"
    }).when("/billingHistory/:accountID", {
        templateUrl: function() {
            return "/" + t.getLang() + "/UserViews/BillingHistory"
        },
        controller: "billingHistoryController",
        title: "Transaction History",
        backPath: "/"
    }).when("/remap", {
        templateUrl: function() {
            return "/" + t.getLang() + "/UserViews/RemapTasks"
        },
        controller: "remapTasksCtrl",
        title: "Chip Tuning",
        backPath: "/"
    }).when("/createRemapTask", {
        templateUrl: function() {
            return "/" + t.getLang() + "/UserViews/CreateRemapTask"
        },
        controller: "createRemapTaskCtrl",
        title: "Create Remap Task",
        backPath: "/"
    }).when("/viewRemapTask/:taskID", {
        templateUrl: function() {
            return "/" + t.getLang() + "/UserViews/ViewRemapTask"
        },
        controller: "viewRemapTaskCtrl",
        title: "View Remap Task",
        backPath: "/"
    }).otherwise({
        redirectTo: "/"
    })
}]);
mainApp.factory("dataService", ["$http", "$q", "Upload", "errorHandler", "userLangService", function(n, t, i, r, u) {
    return {
        autos: {
            vehicleTypes: function() {
                var i = t.defer();
                return n({
                    method: "GET",
                    url: "/api/autos/vehicleTypes",
                    params: {
                        lang: u.getLang()
                    }
                }).success(function(n) {
                    i.resolve(n)
                }).error(function(n, t) {
                    i.reject(r.getHttpReason(n, t))
                }), i.promise
            },
            brands: function(i) {
                var f = t.defer();
                return n({
                    method: "GET",
                    url: "/api/autos/brands",
                    params: {
                        vehicleTypeID: i,
                        lang: u.getLang()
                    }
                }).success(function(n) {
                    f.resolve(n)
                }).error(function(n, t) {
                    f.reject(r.getHttpReason(n, t))
                }), f.promise
            },
            models: function(i) {
                var f = t.defer();
                return n({
                    method: "GET",
                    url: "/api/autos/models",
                    params: {
                        brandID: i,
                        lang: u.getLang()
                    }
                }).success(function(n) {
                    f.resolve(n)
                }).error(function(n, t) {
                    f.reject(r.getHttpReason(n, t))
                }), f.promise
            },
            engines: function(i) {
                var f = t.defer();
                return n({
                    method: "GET",
                    url: "/api/autos/engines",
                    params: {
                        modelID: i,
                        lang: u.getLang()
                    }
                }).success(function(n) {
                    f.resolve(n)
                }).error(function(n, t) {
                    f.reject(r.getHttpReason(n, t))
                }), f.promise
            },
            ecus: function(i) {
                var f = t.defer();
                return n({
                    method: "GET",
                    url: "/api/autos/ecus",
                    params: {
                        engineID: i,
                        lang: u.getLang()
                    }
                }).success(function(n) {
                    f.resolve(n)
                }).error(function(n, t) {
                    f.reject(r.getHttpReason(n, t))
                }), f.promise
            }
        },
        tasks: {
            task: {
                create: function(n, r, f, e) {
                    var s = [f],
                        o;
                    return e && s.push(e), o = t.defer(), i.upload({
                        url: "/api/tasks/task/create",
                        file: s,
                        params: {
                            engineID: n,
                            ecuID: r,
                            lang: u.getLang()
                        },
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("accessToken")
                        }
                    }).progress(function(n) {
                        o.notify(n)
                    }).success(function(n) {
                        o.resolve(n)
                    }).error(function(n) {
                        o.reject(n)
                    }), o.promise
                },
                list: function(i, f, e) {
                    var o = t.defer();
                    return n({
                        method: "GET",
                        url: "/api/tasks/task/list",
                        params: {
                            page: i,
                            pageSize: f,
                            searchText: e,
                            lang: u.getLang()
                        }
                    }).success(function(n) {
                        o.resolve(n)
                    }).error(function(n, t) {
                        o.reject(r.getHttpReason(n, t))
                    }), o.promise
                },
                get: function(i) {
                    var f = t.defer();
                    return n({
                        method: "GET",
                        url: "/api/tasks/task/get",
                        params: {
                            taskID: i,
                            lang: u.getLang()
                        }
                    }).success(function(n) {
                        f.resolve(n)
                    }).error(function(n, t) {
                        f.reject(r.getHttpReason(n, t))
                    }), f.promise
                },
                process: function(i, f, e, o) {
                    var s = t.defer();
                    return n({
                        method: "POST",
                        url: "/api/tasks/task/process",
                        params: {
                            taskID: i,
                            lang: u.getLang()
                        },
                        data: {
                            actionGroups: f,
                            removeErrorCodes: e,
                            correctChecksum: o
                        }
                    }).success(function(n) {
                        s.resolve(n)
                    }).error(function(n, t) {
                        s.reject(r.getHttpReason(n, t))
                    }), s.promise
                },
                complete: function(i) {
                    var f = t.defer();
                    return n({
                        method: "POST",
                        url: "/api/tasks/task/complete",
                        params: {
                            taskID: i,
                            lang: u.getLang()
                        }
                    }).success(function(n) {
                        f.resolve(n)
                    }).error(function(n, t) {
                        f.reject(r.getHttpReason(n, t))
                    }), f.promise
                },
                checkAgain: function(i, f, e) {
                    var o = t.defer();
                    return n({
                        method: "POST",
                        url: "/api/tasks/task/checkAgain",
                        params: {
                            taskID: i,
                            lang: u.getLang()
                        },
                        data: {
                            engineID: f,
                            ecuID: e
                        }
                    }).success(function(n) {
                        o.resolve(n)
                    }).error(function(n, t) {
                        o.reject(r.getHttpReason(n, t))
                    }), o.promise
                },
                createChild: function(i) {
                    var f = t.defer();
                    return n({
                        method: "POST",
                        url: "/api/tasks/task/createChild",
                        params: {
                            taskID: i,
                            lang: u.getLang()
                        }
                    }).success(function(n) {
                        f.resolve(n)
                    }).error(function(n, t) {
                        f.reject(r.getHttpReason(n, t))
                    }), f.promise
                },
                "delete": function(i) {
                    var f = t.defer();
                    return n({
                        method: "POST",
                        url: "/api/tasks/task/delete",
                        params: {
                            lang: u.getLang()
                        },
                        data: i
                    }).success(function(n) {
                        f.resolve(n)
                    }).error(function(n, t) {
                        f.reject(r.getHttpReason(n, t))
                    }), f.promise
                },
                paymentSources: {
                    list: function(i) {
                        var f = t.defer();
                        return n({
                            method: "GET",
                            url: "/api/tasks/task/paymentSources/list",
                            params: {
                                taskID: i,
                                lang: u.getLang()
                            }
                        }).success(function(n) {
                            f.resolve(n)
                        }).error(function(n, t) {
                            f.reject(r.getHttpReason(n, t))
                        }), f.promise
                    }
                },
                payTaskFromAccount: function(i, f) {
                    var e = t.defer();
                    return n({
                        method: "POST",
                        url: "/api/tasks/task/payFromAccount",
                        params: {
                            lang: u.getLang()
                        },
                        data: {
                            taskID: i,
                            accountID: f
                        }
                    }).success(function(n) {
                        e.resolve(n)
                    }).error(function(n, t) {
                        e.reject(r.getHttpReason(n, t))
                    }), e.promise
                }
            },
            remapTask: {
                create: function(n, r) {
                    var f = t.defer();
                    return i.upload({
                        url: "/api/tasks/remapTask/create",
                        file: n,
                        fields: {
                            message: r
                        },
                        params: {
                            lang: u.getLang()
                        },
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("accessToken")
                        }
                    }).progress(function(n) {
                        f.notify(n)
                    }).success(function(n) {
                        f.resolve(n)
                    }).error(function(n) {
                        f.reject(n)
                    }), f.promise
                },
                list: function(i, f) {
                    var e = t.defer();
                    return n({
                        method: "GET",
                        url: "/api/tasks/task/list",
                        params: {
                            page: i,
                            pageSize: f,
                            lang: u.getLang()
                        }
                    }).success(function(n) {
                        e.resolve(n)
                    }).error(function(n, t) {
                        e.reject(r.getHttpReason(n, t))
                    }), e.promise
                },
                get: function(i) {
                    var f = t.defer();
                    return n({
                        method: "GET",
                        url: "/api/tasks/remapTask/get",
                        params: {
                            taskID: i,
                            lang: u.getLang()
                        }
                    }).success(function(n) {
                        f.resolve(n)
                    }).error(function(n, t) {
                        f.reject(r.getHttpReason(n, t))
                    }), f.promise
                }
            }
        },
        user: {
            userProfile: {
                get: function() {
                    var i = t.defer();
                    return n({
                        method: "GET",
                        url: "/api/user/userProfile/get",
                        params: {
                            lang: u.getLang()
                        }
                    }).success(function(n) {
                        i.resolve(n)
                    }).error(function(n, t) {
                        i.reject(r.getHttpReason(n, t))
                    }), i.promise
                },
                save: function(i, f, e) {
                    var o = t.defer();
                    return n({
                        method: "POST",
                        url: "/api/user/userProfile/save",
                        params: {
                            lang: u.getLang()
                        },
                        data: {
                            firstName: i,
                            lastName: f,
                            organizationName: e
                        }
                    }).success(function(n) {
                        o.resolve(n)
                    }).error(function(n, t) {
                        o.reject(r.getHttpReason(n, t))
                    }), o.promise
                }
            },
            settings: {
                get: function() {
                    var i = t.defer();
                    return n({
                        method: "GET",
                        url: "/api/user/settings/get",
                        params: {
                            lang: u.getLang()
                        }
                    }).success(function(n) {
                        i.resolve(n)
                    }).error(function(n, t) {
                        i.reject(r.getHttpReason(n, t))
                    }), i.promise
                },
                currency: {
                    save: function(i) {
                        var f = t.defer();
                        return n({
                            method: "POST",
                            url: "/api/user/settings/currency/save",
                            params: {
                                currencyID: i,
                                lang: u.getLang()
                            }
                        }).success(function(n) {
                            f.resolve(n)
                        }).error(function(n, t) {
                            f.reject(r.getHttpReason(n, t))
                        }), f.promise
                    }
                }
            },
            billing: {
                get: function() {
                    var i = t.defer();
                    return n({
                        method: "GET",
                        url: "/api/user/billing/get",
                        params: {
                            lang: u.getLang()
                        }
                    }).success(function(n) {
                        i.resolve(n)
                    }).error(function(n, t) {
                        i.reject(r.getHttpReason(n, t))
                    }), i.promise
                }
            },
            billingHistory: {
                list: function(i, f, e) {
                    var o = t.defer();
                    return n({
                        method: "GET",
                        url: "/api/user/billingHistory/list",
                        params: {
                            accountID: i,
                            page: f,
                            pageSize: e,
                            lang: u.getLang()
                        }
                    }).success(function(n) {
                        o.resolve(n)
                    }).error(function(n, t) {
                        o.reject(r.getHttpReason(n, t))
                    }), o.promise
                }
            }
        },
        messages: {
            message: {
                createForTask: function(i, f, e) {
                    var o = t.defer();
                    return n({
                        method: "POST",
                        url: "/api/messages/message/createForTask",
                        params: {
                            taskID: i,
                            lang: u.getLang()
                        },
                        data: {
                            text: f,
                            uniqueID: e
                        }
                    }).success(function(n) {
                        o.resolve(n)
                    }).error(function(n, t) {
                        o.reject(r.getHttpReason(n, t))
                    }), o.promise
                },
                getByTask: function(i) {
                    var f = t.defer();
                    return n({
                        method: "GET",
                        url: "/api/messages/message/getByTask",
                        params: {
                            taskID: i,
                            lang: u.getLang()
                        }
                    }).success(function(n) {
                        f.resolve(n)
                    }).error(function(n, t) {
                        f.reject(r.getHttpReason(n, t))
                    }), f.promise
                }
            }
        }
    }
}]);
appControllers.controller("billingController", ["$scope", "$location", "dataService", "layoutService", function(n, t, i, r) {
    n.loaded = !1;
    n.loadingError = !1;
    n.load = function() {
        i.user.billing.get().then(function(t) {
            n.billing = t;
            n.loaded = !0;
            n.loadingError = !1;
            r.apply()
        }, function() {
            n.billing = null;
            n.loadingError = !0;
            n.loaded = !0;
            r.apply()
        })
    };
    n.accountHistory = function(n) {
        t.path("/billingHistory/" + n)
    };
    n.load()
}]);
appControllers.controller("billingHistoryController", ["$scope", "$location", "$routeParams", "dataService", "layoutService", "queryStringService", function(n, t, i, r, u, f) {
    n.accountID = i.accountID;
    n.maxPages = 5;
    n.itemsInPage = 50;
    n.firstLoaded = !1;
    n.initialCurrentPage = f.getUrlParameter("page");
    typeof n.initialCurrentPage == "undefined" && (n.initialCurrentPage = 1);
    n.loaded = !1;
    n.loadingError = !1;
    n.anySelected = !1;
    n.load = function() {
        n.loaded = !1;
        n.loadingError = !1;
        n.allSelected = !1;
        n.anySelected = !1;
        var t = n.firstLoaded ? n.currentPage : n.initialCurrentPage;
        r.user.billingHistory.list(n.accountID, t - 1, n.itemsInPage, n.searchText).then(function(t) {
            n.requestList = t;
            n.loaded = !0;
            n.firstLoaded || (n.currentPage = n.initialCurrentPage);
            n.firstLoaded = !0;
            n.loadingError = !1;
            n.totalItems = n.requestList.totalCount;
            u.apply()
        }, function() {
            n.requestList = null;
            n.loadingError = !0;
            n.loaded = !0;
            u.apply()
        })
    };
    n.pageChanged = function() {
        n.firstLoaded && (t.search("page", n.currentPage), n.load())
    };
    n.isDebitStatus = function(n) {
        return n.amount <= 0
    };
    n.isCreditStatus = function(n) {
        return n.amount > 0
    };
    n.load()
}]);
appControllers.controller("createTaskCtrl", ["$scope", "$location", "dataService", "createTaskCtrlStrings", function(n, t, i, r) {
    n.submitted = !1;
    n.visibleMode = 1;
    n.progress = 0;
    n.vehicleTypes = [];
    n.selectedVehicleType = null;
    n.brands = [];
    n.selectedBrand = null;
    n.models = [];
    n.selectedModel = null;
    n.engines = [];
    n.selectedEngine = null;
    n.ecus = [];
    n.selectedEcu = null;
    n.secondFileExists = !1;
    n.selectedEcuFile2 = null;
    i.autos.vehicleTypes().then(function(t) {
        n.vehicleTypes = t
    });
    n.$watch("selectedVehicleType", function(t) {
        n.brands = [];
        n.selectedBrand = null;
        n.models = [];
        n.selectedModel = null;
        n.engines = [];
        n.selectedEngine = null;
        n.ecus = [];
        n.selectedEcu = null;
        n.secondFileExists = !1;
        n.selectedEcuFile2 = null;
        t && i.autos.brands(t.vehicleTypeID).then(function(t) {
            n.brands = t
        })
    });
    n.$watch("selectedBrand", function(t) {
        n.models = [];
        n.selectedModel = null;
        n.engines = [];
        n.selectedEngine = null;
        n.ecus = [];
        n.selectedEcu = null;
        n.secondFileExists = !1;
        n.selectedEcuFile2 = null;
        t && i.autos.models(t.brandID).then(function(t) {
            n.models = t
        })
    });
    n.$watch("selectedModel", function(t) {
        n.engines = [];
        n.selectedEngine = null;
        n.ecus = [];
        n.selectedEcu = null;
        n.secondFileExists = !1;
        n.selectedEcuFile2 = null;
        t && i.autos.engines(t.modelID).then(function(t) {
            n.engines = t
        })
    });
    n.$watch("selectedEngine", function(t) {
        n.ecus = [];
        n.selectedEcu = null;
        n.secondFileExists = !1;
        n.selectedEcuFile2 = null;
        t && i.autos.ecus(n.selectedEngine.engineID).then(function(t) {
            n.ecus = t
        })
    });
    n.$watch("selectedEcu", function(t) {
        t ? n.selectedEcu.secondFile ? (n.secondFileExists = !0, n.firstFileName = n.selectedEcu.secondFile.firstFileName, n.secondFileName = n.selectedEcu.secondFile.secondFileName, n.isSecondFileRequired = n.selectedEcu.secondFile.isSecondFileRequired) : (n.secondFileExists = !1, n.selectedEcuFile2 = null) : (n.secondFileExists = !1, n.selectedEcuFile2 = null)
    });
    n.selectedEcuFileName = null;
    n.selectedEcuFile = null;
    n.selectedEcuFileName2 = null;
    n.selectedEcuFile2 = null;
    n.allowEcuFileExtension = !0;
    n.allowEcuFile2Extension = !0;
    n.selectEcuFile = function(t, i) {
        n.selectedEcuFile = t;
        n.selectedEcuFileName = i;
        n.allowEcuFileExtension = !0;
        n.selectedEcuFileName && !n.isFileNameValid(n.selectedEcuFileName) && (n.allowEcuFileExtension = !1);
        n.$apply()
    };
    n.selectEcuFile2 = function(t, i) {
        n.selectedEcuFile2 = t;
        n.selectedEcuFileName2 = i;
        n.allowEcuFile2Extension = !0;
        n.selectedEcuFileName2 && !n.isFileNameValid(n.selectedEcuFileName2) && (n.allowEcuFile2Extension = !1);
        n.$apply()
    };
    n.getFileExtension = function(n) {
        return /[.]/.exec(n) ? /[^.]+$/.exec(n) : ""
    };
    n.isFileNameValid = function(t) {
        var i = (n.getFileExtension(t) + "").toUpperCase();
        return i === "ZIP" || i === "RAR" || i === "ARJ" || i === "7ZP" ? !1 : !0
    };
    n.sendFileClick = function() {
        n.submitted = !0;
        n.selectedBrand && n.selectedModel && n.selectedEngine && n.selectedEcu && n.selectedEcuFileName && n.selectedEcuFile && (!n.secondFileExists || !n.isSecondFileRequired || n.selectedEcuFileName2 && n.selectedEcuFile2) && n.allowEcuFileExtension && n.allowEcuFile2Extension && (n.progress = 0, n.visibleMode = 2, i.tasks.task.create(n.selectedEngine.engineID, n.selectedEcu.ecuID, n.selectedEcuFile, n.selectedEcuFile2).then(function(n) {
            t.path("/viewtask/" + n)
        }, function() {
            n.visibleMode = 3
        }, function(t) {
            n.progress = Math.round(100 * t.loaded / t.total)
        }))
    };
    n.backFromErrorClick = function() {
        n.visibleMode = 1
    };
    n.getSourceEcuFile = function() {
        return n.secondFileExists ? n.firstFileName : r.Source_ECU_file
    };
    n.getSourceEcuFile2 = function() {
        return n.secondFileExists ? n.secondFileName : r.Source_ECU_file
    }
}]);
appControllers.controller("settingsController", ["$scope", "dataService", "layoutService", "changeCurrencyEditorParams", function(n, t, i, r) {
    n.loaded = !1;
    n.loadingError = !1;
    n.selectedCurrency = null;
    t.user.settings.get().then(function(t) {
        n.settings = t;
        n.selectedCurrency = n.settings.billingCurrency;
        n.loaded = !0;
        n.loadingError = !1;
        i.apply()
    }, function() {
        n.loadingError = !0;
        n.loaded = !0;
        i.apply()
    });
    n.changeCurrency = function() {
        r.currencies = n.settings.allowedCurrencies;
        r.selectedCurrency = n.selectedCurrency;
        r.showModal = !0
    };
    n.$watch(function() {
        return r.selectedCurrency
    }, function(t) {
        n.selectedCurrency = t
    })
}]);
appControllers.controller("tasksCtrl", ["$scope", "$location", "dataService", "layoutService", "queryStringService", function(n, t, i, r, u) {
    n.maxPages = 5;
    n.itemsInPage = 50;
    n.firstLoaded = !1;
    n.initialCurrentPage = u.getUrlParameter("page");
    typeof n.initialCurrentPage == "undefined" && (n.initialCurrentPage = 1);
    n.searchText = u.getUrlParameter("searchText");
    typeof n.searchText == "undefined" && (n.searchText = null);
    n.loaded = !1;
    n.loadingError = !1;
    n.anySelected = !1;
    n.taskClick = function(n) {
        t.path("/viewtask/" + n)
    };
    n.load = function() {
        n.loaded = !1;
        n.loadingError = !1;
        n.allSelected = !1;
        n.anySelected = !1;
        var t = n.firstLoaded ? n.currentPage : n.initialCurrentPage;
        i.tasks.task.list(t - 1, n.itemsInPage, n.searchText).then(function(t) {
            n.taskList = t;
            n.loaded = !0;
            n.firstLoaded || (n.currentPage = n.initialCurrentPage);
            n.firstLoaded = !0;
            n.loadingError = !1;
            n.totalItems = n.taskList.totalCount;
            r.apply()
        }, function() {
            n.taskList = null;
            n.loadingError = !0;
            n.loaded = !0;
            r.apply()
        })
    };
    n.pageChanged = function() {
        n.firstLoaded && (t.search("page", n.currentPage), n.load())
    };
    n.isErrorStatus = function(n) {
        return n == 3 || n == 4 || n == 6 || n == 10 || n == 99 ? !0 : !1
    };
    n.isSuccessStatus = function(n) {
        return n == 9 ? !0 : !1
    };
    n.selectTask = function(t) {
        t.selected ? (t.selected = !1, n.allSelected = !1) : t.selected = !0;
        n.refreshAnySelected()
    };
    n.selectAllTasks = function() {
        n.allSelected ? (n.allSelected = !1, n.doSelectAllTasks(!1)) : (n.allSelected = !0, n.doSelectAllTasks(!0));
        n.refreshAnySelected()
    };
    n.doSelectAllTasks = function(t) {
        for (var i = 0; i < n.taskList.tasks.length; i++) n.taskList.tasks[i].selected = t
    };
    n.refreshAnySelected = function() {
        for (var i = !1, t = 0; t < n.taskList.tasks.length; t++)
            if (n.taskList.tasks[t].selected) {
                i = !0;
                break
            }
        n.anySelected = i
    };
    n.showDeleteTaskConfirmationModal = !1;
    n.deleteTasks = function() {
        n.taskDeleting = !1;
        n.taskDeletingErrorExist = !1;
        n.showDeleteTaskConfirmationModal = !0
    };
    n.deleteTaskOk = function() {
        var r, t, u;
        for (n.taskDeleting = !0, n.taskDeletingErrorExist = !1, r = [], t = 0; t < n.taskList.tasks.length; t++) u = n.taskList.tasks[t], u.selected && r.push(u.task.taskID);
        i.tasks.task.delete(r).then(function() {
            n.taskDeleting = !1;
            n.showDeleteTaskConfirmationModal = !1;
            n.load()
        }, function(t) {
            n.taskDeleting = !1;
            n.taskDeletingErrorMessage = t.data.message;
            n.taskDeletingErrorExist = !0
        })
    };
    n.search = function() {
        t.search("searchText", escape(n.searchText));
        n.currentPage = 1;
        n.load()
    };
    n.load()
}]);
appControllers.controller("userProfileController", ["$scope", "dataService", "layoutService", "changeUserProfileEditorParams", function(n, t, i, r) {
    n.loaded = !1;
    n.loadingError = !1;
    t.user.userProfile.get().then(function(t) {
        n.userProfile = t;
        n.loaded = !0;
        n.loadingError = !1;
        i.apply()
    }, function() {
        n.loadingError = !0;
        n.loaded = !0;
        i.apply()
    });
    n.changeUserProfile = function() {
        r.firstName = n.userProfile.firstName;
        r.lastName = n.userProfile.lastName;
        r.organizationName = n.userProfile.organizationName;
        r.showModal = !0
    };
    n.$watch(function() {
        return r.firstName
    }, function(t) {
        n.userProfile && (n.userProfile.firstName = t)
    });
    n.$watch(function() {
        return r.lastName
    }, function(t) {
        n.userProfile && (n.userProfile.lastName = t)
    });
    n.$watch(function() {
        return r.organizationName
    }, function(t) {
        n.userProfile && (n.userProfile.organizationName = t)
    })
}]);
appControllers.controller("viewTaskCtrl", ["$scope", "$http", "$routeParams", "$location", "dataService", "notificationService", "downloadService", "layoutService", "paymentService", "viewTaskCtrlStrings", function(n, t, i, r, u, f, e, o, s, h) {
    n.autoChanged = !1;
    n.submitted = !1;
    n.processingTaskID = i.taskID;
    n.loaded = !1;
    n.loadingError = !1;
    n.selectedVehicleType = null;
    n.selectedBrand = null;
    n.selectedModel = null;
    n.selectedEngine = null;
    n.selectedEcu = null;
    n.uiChanged = !1;
    n.paymentSources = null;
    n.paymentSourcesError = !1;
    n.loadTask = function() {
        u.tasks.task.get(n.processingTaskID).then(function(t) {
            n.taskDetail = t;
            n.uiChanged = !1;
            n.selectedVehicleType = n.taskDetail.task.vehicleType;
            n.selectedBrand = n.taskDetail.task.brand;
            n.selectedModel = n.taskDetail.task.model;
            n.selectedEngine = n.taskDetail.task.engine;
            n.selectedEcu = n.taskDetail.task.ecu;
            n.loaded = !0;
            n.loadingError = !1;
            o.apply()
        }, function() {
            n.loadingError = !0;
            n.loaded = !0;
            o.apply()
        })
    };
    f.taskStatusChanged = function(t) {
        t.taskID == n.processingTaskID && n.loadTask()
    };
    n.loadTask();
    n.selectActionGroup = function(t) {
        n.uiChanged = !0;
        t.selected = t.selected ? !1 : !0
    };
    n.removeErrorCodesChanged = function() {
        n.uiChanged = !0
    };
    n.getProcessButton = function(n) {
        return typeof n != "undefined" && n != null && (n.status == 5 || n.status == 6 || n.status == 9 || n.status == 10) ? h.Process_Again : h.Process
    };
    n.getExample = function(n) {
        return typeof n != "undefined" && n != null && n.numeralSystem == 16 ? "0470, 2080, 242F" : "0470, 2080, 2452"
    };
    n.getChecksumStatus = function(n) {
        if (n != null && n.checksumCheckupResult != null) {
            if (n.checksumCheckupResult == 1) return h.Is_Correct;
            if (n.checksumCheckupResult == 2) return h.Is_Not_Correct
        }
        return ""
    };
    n.lockUI = !1;
    n.startProcessChecked = !1;
    n.startProcess = function() {
        for (var t, e, o, r = [], f = [], i = 0; i < n.taskDetail.ruleActionGroups.length; i++) t = n.taskDetail.ruleActionGroups[i], t.selected && (r.push({
            groupID: t.groupID,
            type: t.type,
            selected: !0
        }), t.locked || f.push(t.groupID));
        e = n.taskDetail.numeralSystem == 16 ? "^( |\t)*([a-f]|[A-F]|[0-9]){1,4}(( |\t)*(,|;)( |\t)*([a-f]|[A-F]|[0-9]){1,4})*( |\t)*$" : "^( |\t)*[0-9]{1,5}(( |\t)*(,|;)( |\t)*[0-9]{1,5})*( |\t)*$";
        o = new RegExp(e);
        n.removeErrorsIsEmpty = n.taskDetail.removeErrorCodes == null || n.taskDetail.removeErrorCodes == "";
        n.removeErrorsCodeIsInvalid = !n.removeErrorsIsEmpty && !o.test(n.taskDetail.removeErrorCodes);
        n.selectedActionGroupsIsEmpty = f.length == 0;
        n.checksumIsEmpty = !n.taskDetail.correctChecksum;
        n.startProcessChecked = !0;
        n.removeErrorsCodeIsInvalid || n.selectedActionGroupsIsEmpty && n.removeErrorsIsEmpty && n.checksumIsEmpty || (n.lockUI = !0, n.errorMessage = null, n.prevStatus = n.taskDetail.task.status, n.taskDetail.task.status = n.taskDetail.task.status == 9 || n.taskDetail.task.status == 10 ? 12 : 8, u.tasks.task.process(n.processingTaskID, r, n.taskDetail.removeErrorCodes, n.taskDetail.correctChecksum).then(function() {
            n.lockUI = !1
        }, function(t) {
            n.lockUI = !1;
            n.taskDetail.task.status = n.prevStatus;
            n.errorMessage = t.data.message
        }))
    };
    n.startComplete = function() {
        n.lockUI = !0;
        n.errorMessage = null;
        n.prevStatus = n.taskDetail.task.status;
        n.taskDetail.task.status = 11;
        u.tasks.task.complete(n.processingTaskID).then(function() {
            n.lockUI = !1;
            n.loadTask()
        }, function(t) {
            n.lockUI = !1;
            n.taskDetail.task.status = n.prevStatus;
            n.errorMessage = t.data.message
        })
    };
    n.startDownload = function(t) {
        var i = "/download/task?taskID=" + n.taskDetail.task.task.taskID;
        t != null && (i = i + "&ordNo=" + t.ordNo);
        e.download(i)
    };
    n.$watch("selectedVehicleType", function(t, i) {
        n.taskDetail != null && i != null && (t == null || i.vehicleTypeID != t.vehicleTypeID) && (n.autoChanged = !0, n.taskDetail.brands = [], n.selectedBrand = {
            brandID: -1
        }, n.taskDetail.models = [], n.selectedModel = {
            modelID: -1
        }, n.taskDetail.engines = [], n.selectedEngine = {
            engineID: -1
        }, n.taskDetail.ecus = [], n.selectedEcu = {
            ecuID: -1
        }, t != null && t.vehicleTypeID > 0 && u.autos.brands(t.vehicleTypeID).then(function(t) {
            n.taskDetail.brands = t
        }))
    });
    n.$watch("selectedBrand", function(t, i) {
        n.taskDetail != null && i != null && (t == null || i.brandID != t.brandID) && (n.autoChanged = !0, n.taskDetail.models = [], n.selectedModel = {
            modelID: -1
        }, n.taskDetail.engines = [], n.selectedEngine = {
            engineID: -1
        }, n.taskDetail.ecus = [], n.selectedEcu = {
            ecuID: -1
        }, t != null && t.brandID > 0 && u.autos.models(t.brandID).then(function(t) {
            n.taskDetail.models = t
        }))
    });
    n.$watch("selectedModel", function(t, i) {
        n.taskDetail != null && i != null && (t == null || i.modelID != t.modelID) && (n.autoChanged = !0, n.taskDetail.engines = [], n.selectedEngine = {
            engineID: -1
        }, n.taskDetail.ecus = [], n.selectedEcu = {
            ecuID: -1
        }, t != null && t.modelID > 0 && u.autos.engines(t.modelID).then(function(t) {
            n.taskDetail.engines = t
        }))
    });
    n.$watch("selectedEngine", function(t, i) {
        n.taskDetail != null && i != null && (t == null || i.engineID != t.engineID) && (n.autoChanged = !0, n.taskDetail.ecus = [], n.selectedEcu = {
            ecuID: -1
        }, t != null && t.engineID > 0 && u.autos.ecus(t.engineID).then(function(t) {
            n.taskDetail.ecus = t
        }))
    });
    n.checkAgain = function() {
        n.selectedEngine != null && n.selectedEngine.engineID > 0 && n.selectedEcu != null && n.selectedEcu.ecuID > 0 ? (n.submitted = !1, n.lockUI = !0, n.errorMessage = null, n.prevStatus = n.taskDetail.task.status, n.taskDetail.task.status = 13, u.tasks.task.checkAgain(n.processingTaskID, n.selectedEngine.engineID, n.selectedEcu.ecuID).then(function() {
            n.lockUI = !1;
            n.autoChanged = !1;
            n.loadTask()
        }, function(t) {
            n.lockUI = !1;
            n.taskDetail.task.status = n.prevStatus;
            n.errorMessage = t.data.message
        })) : n.submitted = !0
    };
    n.selectChecksum = function() {
        n.uiChanged = !0;
        n.taskDetail.correctChecksum = n.taskDetail.correctChecksum ? !1 : !0
    };
    n.getAvailableCount = function() {
        var i = 0,
            t;
        if (n.taskDetail != null)
            for (t = 0; t < n.taskDetail.ruleActionGroups.length; t++) n.taskDetail.ruleActionGroups[t].selected || i++;
        return i
    };
    n.getPaymentSourceIcon = function(n) {
        return s.getIcon(n)
    };
    n.getSourceFileTitle = function(t) {
        if (n.taskDetail != null && n.taskDetail.secondFileMapping != null) {
            if (t.ordNo == 0) return n.taskDetail.secondFileMapping.firstFileName;
            if (t.ordNo == 1) return n.taskDetail.secondFileMapping.secondFileName
        }
        return h.Source_ECU_file
    };
    n.addAction = function() {
        n.createChildTaskSaving = !1;
        n.createChildTaskErrorExist = !1;
        n.showAddActionModal = !0
    };
    n.createChildTaskOk = function() {
        n.createChildTaskSaving = !0;
        n.createChildTaskErrorExist = !1;
        u.tasks.task.createChild(n.processingTaskID).then(function(t) {
            n.createChildTaskSaving = !1;
            n.showAddActionModal = !1;
            r.path("/viewtask/" + t)
        }, function(t) {
            n.createChildTaskSaving = !1;
            n.createChildTaskErrorMessage = t.data.message;
            n.createChildTaskErrorExist = !0
        })
    };
    n.loadPaymentSources = function() {
        n.paymentSources = null;
        n.paymentSourcesError = !1;
        u.tasks.task.paymentSources.list(n.processingTaskID).then(function(t) {
            n.paymentSources = t;
            o.apply()
        }, function() {
            n.paymentSourcesError = !0;
            o.apply()
        })
    };
    n.startPaymentFromAccount = function(t) {
        n.payFromAccountSaving = !1;
        n.payFromAccountErrorExist = !1;
        n.payFromAccountModal = !0;
        n.payFromAccountID = t;
        n.hidePayPopup()
    };
    n.startPayment = function(t) {
        n.payWaitModal = !0;
        n.hidePayPopup();
        s.pay(t, n.taskDetail.task.task.taskID)
    };
    n.payFromAccountOk = function() {
        n.payFromAccountSaving = !0;
        n.payFromAccountErrorExist = !1;
        u.tasks.task.payTaskFromAccount(n.processingTaskID, n.payFromAccountID).then(function() {
            n.payFromAccountModal = !1
        }, function(t) {
            n.payFromAccountSaving = !1;
            n.payFromAccountErrorMessage = t.data.message;
            n.payFromAccountErrorExist = !0
        })
    }
}]);
appControllers.factory("createTaskCtrlStrings", [function() {
    return {
        Source_ECU_file: "Исходный ECU файл"
    }
}]);
appControllers.factory("viewTaskCtrlStrings", [function() {
    return {
        Process_Again: "Обработать снова",
        Process: "Обработать",
        Is_Correct: "корректна",
        Is_Not_Correct: "не корректна",
        Source_ECU_file: "Исходный ECU файл"
    }
}]);
mainApp.provider("userLangService", [function() {
    var n = "ru";
    return {
        getLang: function() {
            return n
        },
        $get: function() {
            function t() {
                return n
            }
            return {
                getLang: t
            }
        }
    }
}]);
appEditors.directive("changeCurrencyEditor", ["$timeout", "userLangService", "changeCurrencyEditorParams", function(n, t, i) {
    return {
        restrict: "E",
        replace: !0,
        scope: {},
        templateUrl: function() {
            return "/" + t.getLang() + "/UserViews/ChangeCurrencyDialog"
        },
        controller: "changeCurrencyController",
        link: function(t, r) {
            r.modal({
                onHide: function() {
                    n(function() {
                        i.showModal = !1
                    })
                }
            });
            t.$watch(function() {
                return i.showModal
            }, function(n) {
                r.modal(n ? "show" : "hide")
            });
            t.$on("$destroy", function() {
                r.modal("hide");
                r.remove()
            })
        }
    }
}]);
appEditors.factory("changeCurrencyEditorParams", [function() {
    var n = this;
    return n.showModal = !1, n
}]);
appEditors.controller("changeCurrencyController", ["$scope", "$timeout", "changeCurrencyEditorParams", "dataService", function(n, t, i, r) {
    n.$watch(function() {
        return i.showModal
    }, function(t) {
        t && (n.currencies = i.currencies, n.selectedCurrency = i.selectedCurrency, n.changeCurrencySaving = !1, n.changeCurrencyErrorExist = !1)
    });
    n.changeCurrencyOk = function() {
        n.changeCurrencySaving = !0;
        n.changeCurrencyErrorExist = !1;
        r.user.settings.currency.save(n.selectedCurrency.currencyID).then(function() {
            n.changeCurrencySaving = !1;
            i.selectedCurrency = n.selectedCurrency;
            t(function() {
                i.showModal = !1
            })
        }, function(t) {
            n.changeCurrencySaving = !1;
            n.changeCurrencyErrorMessage = t.data.message;
            n.changeCurrencyErrorExist = !0
        })
    }
}]);
appEditors.directive("changeUserProfileEditor", ["$timeout", "userLangService", "changeUserProfileEditorParams", function(n, t, i) {
    return {
        restrict: "E",
        replace: !0,
        scope: {},
        templateUrl: function() {
            return "/" + t.getLang() + "/UserViews/ChangeUserProfileDialog"
        },
        controller: "changeUserProfileController",
        link: function(t, r) {
            r.modal({
                onHide: function() {
                    n(function() {
                        i.showModal = !1
                    })
                }
            });
            t.$watch(function() {
                return i.showModal
            }, function(n) {
                r.modal(n ? "show" : "hide")
            });
            t.$on("$destroy", function() {
                r.modal("hide");
                r.remove()
            })
        }
    }
}]);
appEditors.factory("changeUserProfileEditorParams", [function() {
    var n = this;
    return n.showModal = !1, n
}]);
appEditors.controller("changeUserProfileController", ["$scope", "$timeout", "changeUserProfileEditorParams", "dataService", function(n, t, i, r) {
    n.submitted = !1;
    n.$watch(function() {
        return i.showModal
    }, function(t) {
        t && (n.form.$submitted = !1, n.firstName = i.firstName, n.lastName = i.lastName, n.organizationName = i.organizationName, n.saving = !1, n.errorExist = !1)
    });
    n.submit = function() {
        n.form.$setSubmitted();
        n.form.$valid && n.save()
    };
    n.save = function() {
        n.saving = !0;
        n.errorExist = !1;
        r.user.userProfile.save(n.firstName, n.lastName, n.organizationName).then(function() {
            n.saving = !1;
            i.firstName = n.firstName;
            i.lastName = n.lastName;
            i.organizationName = n.organizationName;
            t(function() {
                i.showModal = !1
            })
        }, function(t) {
            n.saving = !1;
            n.errorMessage = t.data.message;
            n.errorExist = !0
        })
    }
}])