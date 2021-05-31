/**
 * Unsplash API plugin for Vue.js
 *
 * @version 3.1.0
 * @author Charlie LEDUC <contact@graphique.io>
 */

const _BASEURL_ = 'https://api.unsplash.com'

export interface UnsplashOptions {
  accessKey?: string
}

export interface UnsplashLink {
  self?: string
  html?: string
  photos?: string
  likes?: string
  portfolio?: string
}

export interface UnsplashUrl {
  raw?: string
  full?: string
  regular?: string
  small?: string
  thumb?: string
}

export interface UnsplashUser {
  id?: string
  updated_at?: string
  username?: string
  name?: string
  portfolio_url?: string
  bio?: string
  location?: string
  total_likes?: number
  total_photos?: number
  total_collections?: number
  instagram_username?: string
  twitter_username?: string
  links?: { [key: string]: [value: string] }
}

export interface UnsplashImage {
  id?: string
  created_at?: string
  updated_at?: string
  width?: number
  height?: number
  color?: string
  blur_hash?: string
  download?: number
  likes?: number
  liked_by_user?: boolean
  alt?: string
  description?: string
  alt_description?: string
  exif?: { [key: string]: any }
  location?: { [key: string]: any }
  current_user_collections: any[]
  urls?: { [key: string]: [value: string] }
  links?: { [key: string]: [value: string] }
  tags?: { title: string }[]
  user?: { [key: string]: [value: string] }
}

export interface UnsplashCache {
  collections: { [key: string]: UnsplashImage[] }
  images: UnsplashImage[]
}

export enum UnsplashOrderBy {
  Latest = 'latest',
  Oldest = 'oldest',
  Popular = 'popular'
}

export enum UnsplashImageOrientation {
  Landscape = 'landscape',
  Portrait = 'portrait',
  Squarish = 'squarish'
}

type PromiseResolve<T> = (value?: T | PromiseLike<T>) => void
type PromiseReject = (error?: any) => void

function _get(endpoint: string): Promise<any> {
  return new Promise(
    (
      resolve: PromiseResolve<[key: string, value: string]>,
      reject: PromiseReject
    ) => {
      if (window.fetch !== undefined) {
        fetch(_BASEURL_ + endpoint)
          .then((response) => {
            return response.json()
          })
          .then((json) => {
            resolve(json)
          })
          .catch((error) => {
            reject(error)
          })
      } else {
        const req = new XMLHttpRequest()
        req.open('GET', _BASEURL_ + endpoint, true)
        req.responseType = 'json'
        req.onload = (evt: ProgressEvent) => {
          resolve(req.response)
        }
        req.onerror = (evt) => {
          reject(evt)
        }
        req.send()
      }
    }
  )
}

export default {
  install: (app: any, options?: UnsplashOptions) => {
    const _accessKey = (options || {}).accessKey ?? ''
    const _caches: UnsplashCache = {
      collections: {},
      images: []
    }
    app.provide('unsplash', _caches)

    app.config.globalProperties.$unsplash = {
      getPhotos(
        page: number,
        perPage: number,
        orderBy: UnsplashOrderBy
      ): Promise<UnsplashImage[]> {
        if (!page || isNaN(page)) page = 1
        if (!perPage || isNaN(page)) perPage = 10
        const orders = [
          UnsplashOrderBy.Latest,
          UnsplashOrderBy.Oldest,
          UnsplashOrderBy.Popular
        ]
        if (!orderBy || orders.indexOf(orderBy) < 0)
          orderBy = UnsplashOrderBy.Latest

        return new Promise((resolve, reject) => {
          _get(
            `/photos?page=${page}&per_page=${perPage}&order_by=${orderBy}&client_id=${_accessKey}`
          )
            .then((results: UnsplashImage[]) => {
              resolve(results)
            })
            .catch((e) => {
              reject(e)
            })
        })
      },

      getPhoto(id: string): Promise<UnsplashImage> {
        return new Promise((resolve, reject) => {
          const i = _caches.images.findIndex((image) => image.id === id)
          if (i > -1) {
            resolve(_caches.images[i])
            return
          }
          _get(`/photos/${id}?client_id=${_accessKey}`)
            .then((result: UnsplashImage) => {
              _caches.images.push(result)
              resolve(result)
            })
            .catch((e) => {
              reject(e)
            })
        })
      },

      random(
        count: number,
        orientation: UnsplashImageOrientation | null | undefined
      ): Promise<UnsplashImage> {
        if (!count || isNaN(count) || count > 30) count = 1

        const orientations = [
          UnsplashImageOrientation.Landscape,
          UnsplashImageOrientation.Portrait,
          UnsplashImageOrientation.Squarish
        ]
        if (!orientations) orientation = null

        return new Promise((resolve, reject) => {
          let params = `count=${count}`
          if (orientation !== null || orientation !== undefined)
            params += `&orientation=${orientation}`
          _get(`/photos/random?${params}&client_id=${_accessKey}`)
            .then((result: UnsplashImage) => {
              resolve(result)
            })
            .catch((e) => {
              reject(e)
            })
        })
      },

      getCollection(id: string): Promise<UnsplashImage[]> {
        return new Promise((resolve, reject) => {
          if (_caches.collections[id]) {
            resolve(_caches.collections[id])
            return
          }
          _get(`/collections/${id}/photos?client_id=${_accessKey}`)
            .then((results: UnsplashImage[]) => {
              _caches.collections[id] = results
              resolve(results)
            })
            .catch((e) => {
              reject(e)
            })
        })
      },

      randomFrom(list: UnsplashImage[]): UnsplashImage | null {
        if (!list || !list.length) {
          return null
        }
        const i = Math.floor(Math.random() * Math.floor(list.length))
        return list[i]
      }
    }
  }
}
