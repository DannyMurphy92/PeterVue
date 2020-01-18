const queue: any[] = []

export const initGa = () => {
  window['ga-disable-UA-155099216-1'] = false
  window.gtag('js', new Date())

  window.gtag('config', 'UA-155099216-1')
  processItemsInQueue()
}

export const disableTracking = () => {
  window['ga-disable-UA-155099216-1'] = true
}

export const trackPictureImpression = (label: string) => {
  pushToGa('event', 'impression', {
    event_category: 'picture',
    event_label: label,
  })
}

export const pageView = () => {
  pushToGa('pageview')
}

const processItemsInQueue = () => {
  while (queue.length > 0) {
    pushToGa(queue.shift())
  }
}

const pushToGa = (...args: any[]) => {
  if (window['ga-disable-UA-155099216-1'] === undefined || window['ga-disable-UA-155099216-1'] === true) {
    queue.push(args)
  } else {
    window.gtag(...args)
  }
}
