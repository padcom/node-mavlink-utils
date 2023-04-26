/**
 * A simple function that awaits for an event to happen within the given time
 *
 * @param source any object that implements the `once` interface
 * @param event event name to wait for
 * @param timeout timeout (1s by default)
 */
export async function waitForEvent<T>(
  source: { once: (event: string, cb: (data: T) => void) => void },
  event: string,
  timeout = 1000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutTimer = setTimeout(() => {
      cleanup()
      reject('Timeout')
    }, timeout)

    const cleanup = () => {
      clearTimeout(timeoutTimer)
    }

    source.once(event, (data: T) => {
      resolve(data)
      cleanup()
    })
  })
}

/**
 * Function for checking periodically if the given callback returned
 * a truthy value
 *
 * @param cb callback to call
 * @param timeout timeout
 * @param interval interval at which to call the callback
 * @returns a promise that resolves to the callback value once it is truthy
 */
export async function waitFor<T>(cb: () => T, timeout = 10000, interval = 100): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutTimer = setTimeout(() => {
      cleanup()
      reject('Timeout')
    }, timeout)

    const intervalTimer = setInterval(() => {
      const result = cb()
      if (result) {
        cleanup()
        resolve(result)
      }
    }, interval)

    const cleanup = () => {
      clearTimeout(timeoutTimer)
      clearTimeout(intervalTimer)
    }
  })
}

/**
 * Converts a buffer to a string of hex values
 *
 * @param buffer Buffer to convert
 * @returns stringified buffer
 */
export function buffer2hex(buffer: Buffer): string {
  return [...buffer].map(x => x.toString(16)).join('')
}
