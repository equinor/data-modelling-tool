import { configure } from '@storybook/react'
import requireContext from 'require-context.macro'

const req = requireContext('../src/stories', true, /\.stories\.js$/)
// automatically import all files ending in *.stories.js
function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
