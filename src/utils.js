export function findProp (el, prop) {
  if (el.hasOwnProperty(prop)) return el[prop]
  return traverseKeys(el, prop)
}

export function randomTakes (len, num, collection = []) {
  const index = Math.floor(Math.random() * len)
  if (!collection.includes(index)) collection.push(index)
  return collection.length === num ? collection : randomTakes(len, num, collection)
}

function traverseKeys (obj, path, fallback) {
  if (!obj || typeof obj !== 'object') return typeof fallback === 'function' ? fallback() : fallback
  if (!path) return obj

  let o = Object.assign({}, obj)
  path = path.split('.')

  for (let i = 0; i < path.length; i++) {
    if (!o.hasOwnProperty(path[i])) return typeof fallback === 'function' ? fallback() : fallback
    o = o[path[i]]
    if (o !== Object(o) && i < path.length - 1) return typeof fallback === 'function' ? fallback() : fallback
  }

  return o
}
