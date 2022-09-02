/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
var json2md = require('json2md')
const fs = require('fs')
const path = require('path')
const reactDocs = require('react-docgen-typescript')
var fsExtra = require('fs-extra')

// The React components to load
const componentFolder = './src/components/'
// Where the JSON file ends up
const componentJsonPath = './docs/components.json'
const componentDataArray = []
const docsPath = './docs/'

function pushComponent(component) {
  componentDataArray.push(component)
}

function createComponentFile() {
  const componentJsonArray = JSON.stringify(componentDataArray, null, 2)
  fs.writeFile(componentJsonPath, componentJsonArray, 'utf8', (err, data) => {
    if (err) {
      console.log('error', err)
      throw err
    }
    console.log('Created component file')
  })
}

/**
 * Use React-Docgen to parse the loaded component
 * into JS object of props, comments
 *
 * @param {File} component
 * @param {String} filename
 */
function parseComponent(component, filename) {
  const options = {
    // savePropValueAsString: true,
  }
  try {
    const componentInfo = reactDocs.parse(filename, options)
    console.log(componentInfo)
    const splitIndex = filename.indexOf('/src/')
    console.log(splitIndex)
    const shortname = filename.substring(splitIndex + 4)
    console.log(shortname)
    componentInfo.shortname = shortname
    componentInfo.filename = filename
    pushComponent(componentInfo)
  } catch (e) {
    console.log(e)
  }
}

/**
 * Loads a component file, then runs parsing callback
 * @param {String} file
 * @param {Promise} resolve
 */
function loadComponent(file, resolve) {
  fs.readFile(file, (err, data) => {
    if (err) {
      console.log('error', err)
      throw err
    }
    // Parse the component into JS object
    resolve(parseComponent(data, file))
  })
}

/**
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
 *
 * @see http://stackoverflow.com/a/5827895/4241030
 * @param {String} dir
 * @param {Function} done
 */
function filewalker(dir, done) {
  let results = []
  fs.readdir(dir, async (err, list) => {
    if (err) return done(err)
    let pending = list.length
    if (!pending) return done(null, results)
    list.forEach((file) => {
      file = path.resolve(dir, file)
      fs.stat(file, async (err, stat) => {
        // If directory, execute a recursive call
        if (stat && stat.isDirectory()) {
          filewalker(file, (err, res) => {
            results = results.concat(res)
            if (!--pending) done(null, results)
          })
        } else {
          // Check if is a Javascript file
          // And not a story or test
          if (
            file.endsWith('.tsx') &&
            !file.endsWith('.story.js') &&
            !file.endsWith('.test.js')
          ) {
            await new Promise((resolve) => {
              loadComponent(file, resolve)
            })
            await results.push(file)
          }
          if (!--pending) done(null, results)
        }
      })
    })
  })
}

function writeMarkdown() {
  const componentJsonArray = JSON.stringify(componentDataArray, null, 2)
  componentDataArray.forEach((component) => {
    let componentData = component[0]

    if (componentData !== undefined && 'displayName' in componentData) {
      const splitIndex = componentData.filePath.indexOf('/src/')
      const shortPath = componentData.filePath.substring(splitIndex + 5)
      console.log(shortPath)
      const data = json2md([
        { h1: componentData.displayName },
        { blockquote: shortPath },
        { h4: componentData.description },
        { h2: 'Props' },
        {
          table: {
            headers: ['Name', 'Type', 'Description'],
            rows: Object.keys(componentData.props).map((key) => {
              let prop = componentData.props[key]
              return {
                Name: prop['name'],
                Type: typeof prop['type'],
                Description: prop['description'],
              }
            }),
          },
        },
      ])

      const file = shortPath.split('.')
      console.log(file)
      const componentPath = `${file[0]}.md`
      fsExtra.outputFile(componentPath, data, 'utf8', (err, data) => {
        if (err) {
          console.log('error', err)
          throw err
        }
        console.log('Created component file')
      })
    }
  })
}

filewalker(componentFolder, (err, data) => {
  if (err) {
    console.log(err)
    throw err
  }
  // createComponentFile();
  writeMarkdown()
})

console.log(componentDataArray)

console.log(
  json2md([
    { h1: 'JSON To Markdown' },
    { blockquote: 'A JSON to Markdown converter.' },
    {
      img: [
        { title: 'Some image', source: 'https://example.com/some-image.png' },
        {
          title: 'Another image',
          source: 'https://example.com/some-image1.png',
        },
        {
          title: 'Yet another image',
          source: 'https://example.com/some-image2.png',
        },
      ],
    },
    { h2: 'Features' },
    {
      ul: [
        'Easy to use',
        'You can programatically generate Markdown content',
        '...',
      ],
    },
    { h2: 'How to contribute' },
    {
      ol: ['Fork the project', 'Create your branch', 'Raise a pull request'],
    },
  ])
)
