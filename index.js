/**
 * Unsplash API plugin for Vue.js
 *
 * @version 1.0.0
 * @author Charlie LEDUC <contact@graphique.io>
 */

const _baseUrl = 'https://api.unsplash.com';

const _get = function (endpoint) {
  return new Promise((resolve, reject) => {
    if (window.fetch) {
      fetch(_baseUrl + endpoint).then(response => {
        return response.json();
      }).then(json => {
        resolve(json);
      }).catch(error => {
        reject(error);
      });
    } else {
      var req = new XMLHttpRequest();
      req.open('GET', _baseUrl + endpoint, true);
      req.responseType = 'json';
      req.onload = evt => {
        resolve(req.response);
      };
      req.onerror = evt => {
        reject(evt);
      };
      req.send();
    }
  });
};

export default {
  install(Vue, options) {
    Vue.unsplash = {
      _accessKey: '',
      _caches: {
        collections: {},
        images: []
      },
      setAccessKey: function (key) {
        if (typeof key === 'string') {
          if (key.length) {
            this._accessKey = key;
          }
        }
      }
    };

    Vue.prototype.$unsplash = {
      getPhotos: function (page, perPage, orderBy) {
        if (!page || isNaN(page)) page = 1;
        if (!perPage || isNaN(page)) perPage = 10;
        const orders = ['latest', 'oldest', 'popular'];
        if (!orderBy || orders.indexOf(orderBy) < 0) orderBy = 'latest';

        return new Promise((resolve, reject) => {
          _get(`/photos?page=${page}&per_page=${perPage}&order_by=${orderBy}&client_id=${Vue.unsplash._accessKey}`).then(json => {
            resolve(json);
          }).catch(e => {
            reject(e);
          });
        });
      },
      getPhoto: function (id) {
        return new Promise((resolve, reject) => {
          const i = Vue.unsplash._caches.images.findIndex(image => image.id === id);
          if (i > -1) {
            resolve(Vue.unsplash._caches.images[i]);
            return;
          }
          _get(`/photos/${id}?client_id=${Vue.unsplash._accessKey}`).then(json => {
            Vue.unsplash._caches.images.push(json);
            resolve(json);
          }).catch(e => {
            reject(e);
          });
        });
      },
      random: function (count, orientation) {
        if (!count || isNaN(count) || count > 30) count = 1;

        const orientations = ['landscape', 'portrait', 'squarish'];
        if (!orientations || orientations.indexOf(orientation) < 0) orientation = null;

        return new Promise((resolve, reject) => {
          var params = `count=${count}`;
          if (orientation) params += `&orientation=${orientation}`;
          _get(`/photos/random?${params}&client_id=${Vue.unsplash._accessKey}`).then(json => {
            resolve(json);
          }).catch(e => {
            reject(e);
          });
        });
      },
      getCollection: function (id) {
        return new Promise((resolve, reject) => {
          if (Vue.unsplash._caches.collections[id]) {
            resolve(Vue.unsplash._caches.collections[id]);
            return;
          }
          _get(`/collections/${id}/photos?client_id=${Vue.unsplash._accessKey}`).then(json => {
            Vue.unsplash._caches.collections[id] = json;
            resolve(json);
          }).catch(e => {
            reject(e);
          });
        });
      },
      randomFrom: function (list) {
        if (!list || !list.length) {
          return {};
        }
        var i = Math.floor(Math.random() * Math.floor(list.length));
        return list[i];
      }
    };
  }
};
