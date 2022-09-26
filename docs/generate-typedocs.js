const TypeDoc = require('typedoc')
const fs = require('fs')
const { exit } = require('process')

// Path to write the typedocs to
const typeDocsOutPath = './src/components/typedocs.json'
// Base directory of the MDX files read by Docusaurus
const mdxBaseDirectory = './docs/libraries'

// Which component types should have a 'live preview' of the example code
const codePreviewComponentTypes = ['Components']

// The libraries that should be documented
const libraries = {
    '@data-modelling-tool/core': {
        entryPoints: [
            './../web/packages/dmt-core/src/index.tsx',
        ],
        tsConfig: './../web/packages/dmt-core/tsconfig.json'
    },
}

/**
 * Generate a JSON structure representing the library using typedoc
 * 
 * @param {string[]} entryPoints A list of entrypoints (e.g. index.ts) for the given library
 * @param {string} tsConfig Path to the tsconfig.json for the given library
 */
async function generate_json(entryPoints, tsConfig) {
    const app = new TypeDoc.Application()

    // Add reader for tsconfig
    app.options.addReader(new TypeDoc.TSConfigReader())
    
    app.bootstrap({
        entryPoints: entryPoints,
        tsconfig: tsConfig,
        json: true,
    })

    try {
        const project = app.convert()
        if (project) {
            // Generate JSON output
            await app.generateJson(project, typeDocsOutPath)
        } else {
            throw new Error(`Failed to generate typedocs for '${entryPoints}'`)
        }
    } catch (err) {
        console.error(err)
        exit(1)
    }
}

/**
 * Create an mdx file for the component
 * 
 * @param {string} libraryName The name of the library to which this component belongs
 * @param {string} componentName The name of the component
 * @param {string} componentType The type of component. Affects the subdirectory in which the documentation is stored.
 * @param {string[]} scope Optional scope passed to React Live
 */
async function write_mdx_file(libraryName, componentName, componentType, scope=[]) {
    const codePreviewEnabled = codePreviewComponentTypes.includes(componentType)
    const mdxContent =
    `---
title: ${componentName}
---

import { ${componentName} } from '${libraryName}'
import { ComponentDoc } from '@site/src/components/ComponentDoc'

export const componentName = '${componentName}'
export const scope = { ${componentName} }

<ComponentDoc
    componentName={componentName}
    componentType='${componentType}'
    codeScope={scope}
    ${codePreviewEnabled ? 'codePreview={true} codeErrors={true}' : ''}
/>
`
    // File path to write the MDX file to
    const libraryDirectory = `${mdxBaseDirectory}/${libraryName}`
    const librarySubDirectory = `${libraryDirectory}/${componentType}`
    const mdxFilePath = `${librarySubDirectory}/${componentName}.mdx`

    // Ensure directories exist
    try {
        if (!fs.existsSync(librarySubDirectory)) fs.mkdirSync(librarySubDirectory, { recursive: true })
    } catch (e) {
        console.error(`An error occurred while creating the library directory:`)
        console.error(e)
    }

    // Write MDX to disk
    fs.writeFile(mdxFilePath, mdxContent, ((err) => {
        if (err) {
            console.warn(`An error occurred while writing '${mdxFilePath}' to disk:`)
            console.error(err)
        }
        console.log(`Wrote MDX for '${componentName}' to '${mdxFilePath}'`)
    }))
}

async function main() {
    for (library of Object.keys(libraries)) {
        console.log(`=== Generating docs for '${library}'...`)
        const entryPoints = libraries[library].entryPoints
        const tsConfig = libraries[library].tsConfig

        // Generate typedocs
        await generate_json(entryPoints, tsConfig).catch(console.error)
        // Check for presence of the generated JSON
        if (fs.existsSync(typeDocsOutPath)) {
            // Import the typeDocs JSON file
            const typeDocs = require(typeDocsOutPath)
            // Loop over each child
            typeDocs.children?.forEach((component) => {
                const componentName = component.name
                try {
                    if (!component.signatures && !component.comment) return

                    // Get the comment
                    const comment = component.comment ?? component.signatures[0]?.comment ?? {}

                    // Locate the blockTag with tag '@docs'
                    const docsBlockTag = comment.blockTags.find((blockTag) => blockTag.tag === '@docs')
                    if (!docsBlockTag) return

                    // Retrieve the string value of the @docs tag, representing the directory in which the component should be
                    const componentType = docsBlockTag.content.find((content) => content.kind === 'text')?.text
                    // Write the MDX to disk
                    write_mdx_file(library, componentName, componentType)
                } catch (e) {
                    return
                }
            })
        } else {
            console.warn(`The file '${typeDocsOutPath}' does not exist.`)
        }
    }
}

main()
