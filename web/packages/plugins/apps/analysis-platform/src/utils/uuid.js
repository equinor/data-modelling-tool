export function poorMansUUID() {
  const randomNumbers = new Uint8Array(10)
  window.crypto.getRandomValues(randomNumbers)
  return randomNumbers.reduce((a, b) => a.toString() + b.toString()).toString()
}
