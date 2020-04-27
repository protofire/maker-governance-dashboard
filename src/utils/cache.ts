import localForage from 'localforage'
import saveFile from 'save-as-file'

const store = localForage.createInstance({
  name: 'maker-governace',
})

const myWindow: any = window

myWindow.exportCache = async () => {
  let cache = {}
  await store.iterate(function(value, key) {
    cache[key] = value
  })

  const fileName = `maker-governace-${(Date.now() / 1000).toFixed(0)}.json`
  const file = new File([JSON.stringify(cache)], fileName, { type: 'application/json' })
  saveFile(file, fileName)
}

export const getCache = (key: string) => store.getItem<any>(key)

export const setCache = async (key: string, data: any) => {
  await store.setItem(key, data)
  await store.setItem('last-update', (Date.now() / 1000).toFixed(0))
}

export default store
