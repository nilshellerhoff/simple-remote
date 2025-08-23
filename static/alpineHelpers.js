/**
 * Safely define a persistent Alpine store.
 * @param defaultObj Default values of the store, e.g. { darkMode: true, fontSize: 20 }
 */
const definePersistentStore = (defaultObj) => {
  document.addEventListener('alpine:init', () => {
    Alpine.store('settings', defaultObj)
  })

  // Alpine.$persist is only available after 'initialized'
  document.addEventListener('alpine:initialized', () => {
    const persistentDefaultKeyValues = Object.entries(defaultObj).map(([key, value]) => [key, Alpine.$persist(value)])
    const persistentDefault = Object.fromEntries(persistentDefaultKeyValues)

    Alpine.store('settings', persistentDefault)
  })
}