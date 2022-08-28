// var json2md = require("json2md");
const fs = require("fs");
const path = require("path");
const reactDocs = require("react-docgen-typescript");
var fsExtra = require('fs-extra');

// The React components to load
const componentFolder = "../web/packages/dmt-core/src/";
// Where the JSON file ends up
const componentJsonPath = "./src/components/components.json";
const componentData = {};


function pushComponent(component) {
    console.debug("Generated", component.shortname)
    componentData[component.shortname] = component
}

function createComponentFile() {
    const componentJsonArray = JSON.stringify(componentData, null, 2);
    fs.writeFile(componentJsonPath, componentJsonArray, "utf8", (err, data) => {
        if (err) {
            console.log("error", err);
            throw err;
        }
        console.log("Created component file");
    });
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
    };
    try {
        const componentInfo = reactDocs.parse(filename, options);
        const splitIndex = filename.indexOf("/src/");
        const shortname = filename.substring(splitIndex + 4);
        componentInfo.shortname = shortname;
        componentInfo.filename = filename;
        pushComponent(componentInfo);
    } catch (e) {
        console.log(e);
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
            console.log("error", err);
            throw err;
        }
        // Parse the component into JS object
        resolve(parseComponent(data, file));
    });
}

/**
 * Explores recursively a directory and returns all the filepaths and folderpaths in the callback.
 *
 * @see http://stackoverflow.com/a/5827895/4241030
 * @param {String} dir
 * @param {Function} done
 */
function filewalker(dir, done) {
    let results = [];
    fs.readdir(dir, async (err, list) => {
        if (err) return done(err);
        let pending = list.length;
        if (!pending) return done(null, results);
        list.forEach(file => {
            file = path.resolve(dir, file);
            fs.stat(file, async (err, stat) => {
                // If directory, execute a recursive call
                if (stat && stat.isDirectory()) {
                    filewalker(file, (err, res) => {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    // Check if is a Javascript file
                    // And not a story or test
                    if (
                        file.endsWith(".tsx") &&
                        !file.endsWith(".story.js") &&
                        !file.endsWith(".test.js")
                    ) {
                        await new Promise(resolve => {
                            loadComponent(file, resolve);
                        });
                        await results.push(file);
                    }
                    if (!--pending) done(null, results);
                }
            });
        });
    });
}


filewalker(componentFolder, (err, data) => {
    if (err) {
        console.log(err);
        throw err;
    }
    createComponentFile();
});
