export function poorMansUUID(length = 10) {
  const randomNumbers = new Uint8Array(length)
  window.crypto.getRandomValues(randomNumbers)
  // @ts-ignore
  return randomNumbers.reduce((a, b) => a.toString() + b.toString()).toString()
}
