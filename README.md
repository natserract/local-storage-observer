# LocalStorage Observer

Called **localStorageObserver** this is a simple storage library for JavaScript, get inspire from **localForage** but running as **Observer**. This library support TypeScript, and EasyTo-Use.

Problems why created this library:

```js
window.addEventListener('storage', () => {})
```

> This won't work on the same page that is making the changes — it is really a way for other pages on the domain using the storage to sync any changes that are made. Pages on other domains can't access the same storage objects. [https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event](https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event)

## How to use

To use localStorageObserver, just drop a single line into your app:

```ts
import localStorageObserver from 'localstorage-observer'
```

See more [real example]().

Download the [latest localStorageObserver from GitHub](https://github.com/natserract/localstorage-observer), or install with npm:

```terminal
npm install localstorage-observer
```

## Configuration

You can set several configuration with the `config()` method. Avalaible options `description`, `storeName`, and `version` (use for future, currently isn't some affect in your app).

Example:

```ts
localStorageObserver.config({
  storeName: 'localstorage_observer',
})
```

Note: you must call `config()` before you interact with your data. This means calling `config()` before using `get$()`, or `set$()`.

## Get Item

Gets an item from the local storage and supplies the result to a subscriber. If the key does not exist, get\$() will return `null`.

```ts
localStorageObserver.get$(key).subscribe((next) => {
  console.log('Result', JSON.parse(next))
})
```

> Note: localStorageObserver doesn't store the value null / undefined.

## Set Item

Saves data to local storage.

```ts
localStorageObserver.set$(key, values).subscribe((next) => {
  console.log('Step two, set$', next)
})
```

You can store the following types of JavaScript objects:

- `Array`
- `String`
- `Number`
- `Object`

## Remove Item

Removes the value of a key from the local storage.

```ts
localStorageObserver.remove$(key).subscribe({
  next: (message) => console.log('Message: ', message),
  error: (error) => console.error('Error: ', error),
})
```

## Clear Item

Removes the value of a key from the local storage.

```ts
localStorageObserver.clear$().subscribe((message) => {
  console.log('Message: ', message)
})
```

## Unsubscribe

Cleanup a subscription

```tsx
useEffect(() => {
  ...

  return () => {
    localStorageObserver.destroySubscription$()
  }
}, [])
```

## License

This program is free software; it is distributed under an [MIT License](https://github.com/natserract/localstorage-observer/blob/master/LICENSE.md).
