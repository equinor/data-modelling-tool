// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const webpack = require('webpack')
const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const fs = require('fs');
const path = require("path");
const clientDir = path.join(__dirname, '..', 'client');

const LibrariesToTranspile = [
    'copy-text-to-clipboard',
    '@data-modelling-tool/core'
];

const LibrariesToTranspileRegex = new RegExp(
    LibrariesToTranspile.map((libName) => `(node_modules/${libName})`).join('|'),
);

function excludeJS(modulePath) {
    // Always transpile client dir
    if (modulePath.startsWith(clientDir)) {
        return false;
    }
    // Don't transpile node_modules except any docusaurus npm package
    return (
        modulePath.includes('node_modules') &&
        !/docusaurus(?:(?!node_modules).)*\.jsx?$/.test(modulePath) &&
        !LibrariesToTranspileRegex.test(modulePath)
    );
}

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Data Modelling Tool',
    tagline: 'An application for modelling, searching, and viewing domain models based on blueprints.',
    url: 'https://data-modelling-tool.app.radix.equinor.com/',
    baseUrl: '/data-modelling-tool/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    // favicon: 'img/favicon.ico',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'equinor', // Usually your GitHub org/user name.
    projectName: 'data-modelling-tool', // Usually your repo name.

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'en',
        locales: ['en'],
    },

    themes: ['@docusaurus/theme-live-codeblock'],

    plugins: [
        [
            '@docusaurus/plugin-content-docs',
            {
                id: 'community',
                path: 'community',
                routeBasePath: '/',
            },
        ],
        function (context, options) {
            return {
                name: 'webpack-configuration-plugin',
                configureWebpack(config, isServer, utils) {
                    config.plugins = config.plugins.filter(plugin => !(plugin instanceof ModuleScopePlugin));
                    let rule = config.module.rules[5]
                    // @ts-ignore
                    rule.exclude = excludeJS
                    config.resolve.roots = [
                        ...config.resolve.roots,
                        path.resolve(__dirname, '../web/packages/dmt-core')
                    ]
                    // @ts-ignore
                    rule.include = [
                        fs.realpathSync(path.join(__dirname)),
                        fs.realpathSync(path.join(__dirname, 'node_modules/@data-modelling-tool/core/src')),
                        fs.realpathSync(path.join(__dirname, '../web/packages/dmt-core')),
                    ]
                    config.resolve.alias["react"] = path.resolve(__dirname, './node_modules/react')
                    config.resolve.alias["react-dom"] = path.resolve(__dirname, './node_modules/react-dom')
                    config.plugins.push(
                        new webpack.ProvidePlugin({
                            process: 'process/browser'
                        })
                    )
                    return {
                        resolve: {
                            fallback: {
                                "path": require.resolve("path-browserify"),
                                fs: false
                            },
                            symlinks: true
                        },
                    }
                }
            };
        },
    ],

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    // editUrl:
                    //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
                },
                blog: false,
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: 'Data Modelling Tool',
                //logo: {
                //    alt: 'My Site Logo',
                //    src: 'img/logo.svg',
                //},
                items: [
                    {
                        type: 'doc',
                        docId: 'introduction',
                        position: 'left',
                        label: 'Docs',
                    },
                    {
                        type: 'doc',
                        docId: 'community',
                        docsPluginId: 'community',
                        position: 'left',
                        label: 'Community',
                    },
                    {
                        href: 'https://github.com/equinor/data-modelling-tool',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {
                                label: 'Getting started',
                                to: '/docs/getting-started',
                            },
                        ],
                    },
                    {
                        title: 'Community',
                        items: [
                            {
                                label: 'GitHub Issues',
                                href: 'https://github.com/equinor/data-modelling-tool/issues',
                            }
                        ],
                    },
                    {
                        title: 'More',
                        items: [
                            {
                                label: 'Community',
                                to: '/community',
                            },
                            {
                                label: 'GitHub',
                                href: 'https://github.com/equinor/data-modelling-tool',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Equinor`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
