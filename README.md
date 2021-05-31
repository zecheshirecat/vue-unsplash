# vue-unsplash

A simple Unsplash API plugin for Vue.js

## Installation

```javascript
npm install vue-unsplash --save
```

## How to use

Default use in your main.js Vue project

```javascript
import Unsplash from 'vue-unsplash'
...
// Access Key is mandatory to use Unsplash API
createApp(App)
  .use(Unsplash, { accessKey: <string> })
...
```

## Setup Composition API

You can now use the instance methods `this.$unsplash` in your Vue template script.
In Vue 3.x, as an example to use in the setup composition API:

```javascript
import { getCurrentInstance, onMounted } from 'vue'
...
export default {
  name: 'MyComponent',

  setup(props, context) {
    const instance = getCurrentInstance()
    const globalProperties = instance.appContext.config.globalProperties

    onMounted(async () => {
      var image = await globalProperties.$unsplash.getPhoto('l3N9Q27zULw')
      var urls = image.urls || []
      var links = image.links || []
      var user = image.user || {}
      ...
    })
  }
}
...
```

## List photos

Returns a Promise

```javascript
var page = 1
var perPage = 10
var orderBy = 'popular'
this.$unsplash.getPhotos(page, perPage, orderBy)
  .then(results => {
    ...
  })
```

For more information, please refer to [API](https://unsplash.com/documentation#list-photos).

## Get a photo

Returns a Promise

```javascript
this.$unsplash.getPhoto('l3N9Q27zULw')
  .then(image => {
    var urls = image.urls || []
    var links = image.links || []
    var user = image.user || {}
    ...
  })
```

The result is cached to improve performance.
For more information, please refer to [API](https://unsplash.com/documentation#get-a-photo).

## Get a random photo

Returns a Promise

```javascript
var count = 1
var orientation = 'portrait'
this.$unsplash.random(count, orientation)
  .then(response => {
    ...
  })
```

For more information, please refer to [API](https://unsplash.com/documentation#get-a-random-photo).

## Get a collection’s photos

Returns a Promise

```javascript
this.$unsplash.getCollection('LBI7cgq3pbM')
  .then(results => {
    ...
  })
```

The results are cached to improve performance.
For more information, please refer to [API](https://unsplash.com/documentation#get-a-collections-photos).

## Get a random photo from collection

Retrieve a random photo from a fetched collection

```javascript
this.$unsplash.getCollection('LBI7cgq3pbM')
  .then(results => {
    var image = this.$unsplash.randomFrom(results)
    var urls = image.urls || []
    var links = image.links || []
    var user = image.user || {}
    ...
  })
```

For more information, please refer to [API](https://unsplash.com/documentation).

## License

[ISC](https://opensource.org/licenses/ISC)
