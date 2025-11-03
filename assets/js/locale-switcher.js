(function () {
    var config = window.milliariumLocaleConfig;
    if (!config || !config.locales) {
        return;
    }

    var storageKey = "milliarium::locale";
    var locales = config.locales;
    var supportedLocales = Object.keys(locales);
    if (supportedLocales.length === 0) {
        return;
    }

    var defaultLocale = config.defaultLocale && locales[config.defaultLocale] ? config.defaultLocale : supportedLocales[0];
    var currentLocale = config.currentLocale || defaultLocale;

    function normalizePath(path) {
        if (!path) {
            return "/";
        }
        if (path.length > 1 && path.slice(-1) === "/") {
            return path;
        }
        return path + "/";
    }

    function getLocaleFromPath() {
        var path = window.location.pathname || "/";
        var normalizedPath = normalizePath(path);
        for (var i = 0; i < supportedLocales.length; i += 1) {
            var locale = supportedLocales[i];
            var localePath = normalizePath(locales[locale].path || "/");
            if (localePath === "/") {
                if (normalizedPath === "/" || normalizedPath.indexOf("/ko/") !== 0) {
                    return locale;
                }
            } else if (normalizedPath.indexOf(localePath) === 0) {
                return locale;
            }
        }
        return defaultLocale;
    }

    var pathLocale = getLocaleFromPath();

    function persistLocale(locale) {
        try {
            window.localStorage.setItem(storageKey, locale);
        } catch (err) {
            // ignore storage errors
        }
    }

    function storedLocale() {
        try {
            return window.localStorage.getItem(storageKey);
        } catch (err) {
            return null;
        }
    }

    function localeFromLanguage(lang) {
        if (!lang) {
            return null;
        }
        var lowered = lang.toLowerCase();
        if (lowered.indexOf("ko") === 0) {
            return "ko";
        }
        if (lowered.indexOf("en") === 0) {
            return "en-US";
        }
        return null;
    }

    function fetchLocaleByGeolocation() {
        if (typeof fetch !== "function") {
            return Promise.resolve(null);
        }
        var controller;
        var hasAbort = typeof AbortController === "function";
        if (hasAbort) {
            controller = new AbortController();
        }
        var timeoutId = setTimeout(function () {
            if (controller) {
                controller.abort();
            }
        }, 2000);
        return fetch("https://ipapi.co/json/", {
            signal: controller ? controller.signal : undefined
        })
            .then(function (response) {
                clearTimeout(timeoutId);
                if (!response || !response.ok) {
                    return null;
                }
                return response.json();
            })
            .then(function (data) {
                if (data && data.country_code === "KR") {
                    return "ko";
                }
                return null;
            })
            .catch(function () {
                clearTimeout(timeoutId);
                return null;
            });
    }

    function determinePreferredLocale() {
        var queryMatch = window.location.search.match(/[?&]locale=([a-zA-Z-]+)/);
        if (queryMatch) {
            var queryLocale = queryMatch[1];
            if (locales[queryLocale]) {
                return Promise.resolve(queryLocale);
            }
        }

        var saved = storedLocale();
        if (saved && locales[saved]) {
            return Promise.resolve(saved);
        }

        if (Array.isArray(navigator.languages)) {
            for (var i = 0; i < navigator.languages.length; i += 1) {
                var langMatch = localeFromLanguage(navigator.languages[i]);
                if (langMatch && locales[langMatch]) {
                    return Promise.resolve(langMatch);
                }
            }
        }

        var browserLocale = localeFromLanguage(navigator.language || navigator.userLanguage);
        if (browserLocale && locales[browserLocale]) {
            return Promise.resolve(browserLocale);
        }

        return fetchLocaleByGeolocation().then(function (geoLocale) {
            if (geoLocale && locales[geoLocale]) {
                return geoLocale;
            }
            return defaultLocale;
        });
    }

    function updateDropdownLabel(locale) {
        var dropdowns = document.querySelectorAll(".locale-dropdown .dropdown-toggle");
        if (!dropdowns || dropdowns.length === 0) {
            return;
        }
        var label = locale === "ko" ? "한국어" : "ENG";
        for (var i = 0; i < dropdowns.length; i += 1) {
            dropdowns[i].textContent = label;
        }
    }

    function redirectToLocale(locale) {
        var target = locales[locale];
        if (!target) {
            return;
        }
        var targetPath = target.path || "/";
        var currentPath = window.location.pathname || "/";

        if (normalizePath(currentPath) === normalizePath(targetPath)) {
            return;
        }

        window.location.replace(targetPath);
    }

    function shouldRedirect(locale) {
        var path = window.location.pathname || "/";
        var normalizedPath = normalizePath(path);
        var targetPath = normalizePath((locales[locale] && locales[locale].path) || "/");
        var englishPath = normalizePath((locales["en-US"] && locales["en-US"].path) || "/");

        if (normalizedPath === targetPath) {
            return false;
        }

        if (normalizedPath === englishPath || normalizedPath === "/" || normalizedPath === "/index.html") {
            return true;
        }

        return normalizedPath === "/ko/" || normalizedPath === "/ko/index.html";
    }

    function setLocale(locale, options) {
        if (!locales[locale]) {
            locale = defaultLocale;
        }
        persistLocale(locale);
        updateDropdownLabel(locale);
        if (options && options.redirect && shouldRedirect(locale)) {
            redirectToLocale(locale);
        }
    }

    function bindLocaleMenu() {
        var links = document.querySelectorAll(".locale-menu [data-locale]");
        if (!links) {
            return;
        }
        for (var i = 0; i < links.length; i += 1) {
            links[i].addEventListener("click", function (event) {
                event.preventDefault();
                var locale = this.getAttribute("data-locale");
                setLocale(locale, { redirect: true });
            });
        }
    }

    document.addEventListener("DOMContentLoaded", function () {
        bindLocaleMenu();
        updateDropdownLabel(pathLocale);
        determinePreferredLocale().then(function (preferred) {
            if (!preferred) {
                preferred = defaultLocale;
            }
            setLocale(preferred);
            if (shouldRedirect(preferred)) {
                redirectToLocale(preferred);
            }
        });
    });
})();
