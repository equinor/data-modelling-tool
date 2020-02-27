// based on jest-puppeteer CRA example.
// https://github.com/smooth-code/jest-puppeteer/tree/master/examples/create-react-app

module.exports = {
  // server: {
  // 	command: `yarn start`,
  // 	port: 80,
  // 	launchTimeout: 30000,
  // 	debug: true,
  // },
  launch: {
    dumpio: true,
    headless: process.env.HEADLESS !== 'false',
  },
}
