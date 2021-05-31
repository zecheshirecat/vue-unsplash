"use strict";
/**
 * Unsplash API plugin for Vue.js
 *
 * @version 3.1.0
 * @author Charlie LEDUC <contact@graphique.io>
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsplashImageOrientation = exports.UnsplashOrderBy = void 0;
const _BASEURL_ = 'https://api.unsplash.com';
var UnsplashOrderBy;
(function (UnsplashOrderBy) {
    UnsplashOrderBy["Latest"] = "latest";
    UnsplashOrderBy["Oldest"] = "oldest";
    UnsplashOrderBy["Popular"] = "popular";
})(UnsplashOrderBy = exports.UnsplashOrderBy || (exports.UnsplashOrderBy = {}));
var UnsplashImageOrientation;
(function (UnsplashImageOrientation) {
    UnsplashImageOrientation["Landscape"] = "landscape";
    UnsplashImageOrientation["Portrait"] = "portrait";
    UnsplashImageOrientation["Squarish"] = "squarish";
})(UnsplashImageOrientation = exports.UnsplashImageOrientation || (exports.UnsplashImageOrientation = {}));
function _get(endpoint) {
    return new Promise((resolve, reject) => {
        if (window.fetch !== undefined) {
            fetch(_BASEURL_ + endpoint)
                .then((response) => {
                return response.json();
            })
                .then((json) => {
                resolve(json);
            })
                .catch((error) => {
                reject(error);
            });
        }
        else {
            const req = new XMLHttpRequest();
            req.open('GET', _BASEURL_ + endpoint, true);
            req.responseType = 'json';
            req.onload = (evt) => {
                resolve(req.response);
            };
            req.onerror = (evt) => {
                reject(evt);
            };
            req.send();
        }
    });
}
exports.default = {
    install: (app, options) => {
        var _a;
        const _accessKey = (_a = (options || {}).accessKey) !== null && _a !== void 0 ? _a : '';
        const _caches = {
            collections: {},
            images: []
        };
        app.provide('unsplash', _caches);
        app.config.globalProperties.$unsplash = {
            getPhotos(page, perPage, orderBy) {
                if (!page || isNaN(page))
                    page = 1;
                if (!perPage || isNaN(page))
                    perPage = 10;
                const orders = [
                    UnsplashOrderBy.Latest,
                    UnsplashOrderBy.Oldest,
                    UnsplashOrderBy.Popular
                ];
                if (!orderBy || orders.indexOf(orderBy) < 0)
                    orderBy = UnsplashOrderBy.Latest;
                return new Promise((resolve, reject) => {
                    _get(`/photos?page=${page}&per_page=${perPage}&order_by=${orderBy}&client_id=${_accessKey}`)
                        .then((results) => {
                        resolve(results);
                    })
                        .catch((e) => {
                        reject(e);
                    });
                });
            },
            getPhoto(id) {
                return new Promise((resolve, reject) => {
                    const i = _caches.images.findIndex((image) => image.id === id);
                    if (i > -1) {
                        resolve(_caches.images[i]);
                        return;
                    }
                    _get(`/photos/${id}?client_id=${_accessKey}`)
                        .then((result) => {
                        _caches.images.push(result);
                        resolve(result);
                    })
                        .catch((e) => {
                        reject(e);
                    });
                });
            },
            random(count, orientation) {
                if (!count || isNaN(count) || count > 30)
                    count = 1;
                const orientations = [
                    UnsplashImageOrientation.Landscape,
                    UnsplashImageOrientation.Portrait,
                    UnsplashImageOrientation.Squarish
                ];
                if (!orientations)
                    orientation = null;
                return new Promise((resolve, reject) => {
                    let params = `count=${count}`;
                    if (orientation !== null || orientation !== undefined)
                        params += `&orientation=${orientation}`;
                    _get(`/photos/random?${params}&client_id=${_accessKey}`)
                        .then((result) => {
                        resolve(result);
                    })
                        .catch((e) => {
                        reject(e);
                    });
                });
            },
            getCollection(id) {
                return new Promise((resolve, reject) => {
                    if (_caches.collections[id]) {
                        resolve(_caches.collections[id]);
                        return;
                    }
                    _get(`/collections/${id}/photos?client_id=${_accessKey}`)
                        .then((results) => {
                        _caches.collections[id] = results;
                        resolve(results);
                    })
                        .catch((e) => {
                        reject(e);
                    });
                });
            },
            randomFrom(list) {
                if (!list || !list.length) {
                    return null;
                }
                const i = Math.floor(Math.random() * Math.floor(list.length));
                return list[i];
            }
        };
    }
};
