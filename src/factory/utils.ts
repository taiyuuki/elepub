// uuid
function getRandom(digit: number) {
  let result = ''
  for (let i = 1; i <= digit; i++) {
    result += Math.floor(Math.random() * 16).toString(16)
  }
  return result
}

export const genUuid = (): string => {
  let uuid = ''
  if (typeof Blob == 'undefined') {
    uuid = `${getRandom(8)}-${getRandom(4)}-${getRandom(4)}-${getRandom(
      4
    )}-${getRandom(12)}`
  }
  else {
    const url_uuid = URL.createObjectURL(new Blob())
    uuid = url_uuid.toString().substring(url_uuid.lastIndexOf('/') + 1)
    URL.revokeObjectURL(url_uuid)
  }
  return 'urn:uuid:' + uuid
}

export const getRandomName = (fileName?: string) => {
  if (fileName) {
    return getRandom(12) + fileName.substring(fileName.lastIndexOf('.'))
  }
  return getRandom(12)
}

export const isElectron = () => {
  if ('wepubApi' in window) {
    return true
  }
  return false
}

export const isEmptyObj = (obj: object) => {
  return Object.keys(obj).length === 0
}

export function throttle<T extends(...arg: unknown[]) => unknown>(
  func: T,
  timeFrame: number,
  immediately?: boolean
): T {
  let lastTime = 0
  let timer: NodeJS.Timeout
  immediately = immediately ?? false
  return function () {
    const now = Date.now()
    if (timer) {
      clearTimeout(timer)
    }
    if (now - lastTime >= timeFrame && immediately) {
      lastTime = now
      return func()
    }
    else {
      timer = setTimeout(func, timeFrame)
    }
  } as T
}