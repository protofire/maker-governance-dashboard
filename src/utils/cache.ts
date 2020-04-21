import localForage from 'localforage'

const store = localForage.createInstance({
  name: 'maker-governace',
})

export default store
