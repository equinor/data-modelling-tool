// https://medium.com/better-programming/how-to-use-puppeteer-with-jest-typescript-530a139ffe40
module.exports = {
  preset: 'jest-puppeteer',
  testRegex: './*\\.e2e\\.ts$',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
}
