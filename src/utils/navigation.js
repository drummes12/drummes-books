export const startViewTransition = () => {
  if (!checkIsNavigationSupported) return

  window.navigation.addEventListener('navigate', (event) => {
    const toUrl = new URL(event.destination.url)
      
    if (location.origin !== toUrl.origin) return

    event.intercept({
      async handler () {
        const { title, body } = await fetchPage(toUrl.pathname)
        document.startViewTransition(() => {
          document.title = title
          document.body.innerHTML = body
          document.documentElement.scrollTop = 0
        })

      }
    })
  })
  
}

const checkIsNavigationSupported = () => {
  return Boolean(document.startViewTransition)
}

const fetchPage = async (url) => {
  const response = await fetch(url)
  const html = await response.text()
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const title = doc.querySelector('title').textContent
  const body = doc.querySelector('body').innerHTML
  return {title,body}
}