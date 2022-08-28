# Contribution guide

Welcome! We are glad that you want to contribute to our project 💖

There are many ways to contribute, from improving the documentation, submitting bug reports and feature requests or writing code which can be incorporated into the template itself. 

This document outlines the process to help get your contribution accepted.

Thanks to everyone who has contributed!

## Ground Rules

A few general guidelines:

* For major changes, please open an issue first to discuss what you would like to change. 
  * Search for existing issues and pull requests on the [project development board](https://github.com/equinor/template-fastapi-react/projects/1) before creating your own.
* Contributors should fork the repository and work on fixes or enhancements on their own fork.
  * Use the [pull request feature](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork) to submit your changes to this  repository.
  * Please do not commit directly to main.
  * All pull requests should be rebased (with main) and commits squashed prior to the final merge process.
  * Use [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) formatting for commit messages, so that it's possible to auto-generate the changelogs.
  * Do not combine fixes for multiple issues into one branch. Use a separate branch for each issue you’re working on.
* Please include unit tests with all your code changes.
  * All unit tests must be 100% passing before the pull requests will be approved and merged.
  
## How to report a bug

Report something that is broken or not working as
intended [here](https://github.com/equinor/data-modelling-tool/issues/new?assignees=&labels=type%3A+%3Abug+bug&template=bug-report.md&title=).

## How to suggest a feature or enhancement

Ideas for a new feature or enhancement are always welcome.

For new features, please open an issue first to discuss what you would like to
add [here](https://github.com/equinor/data-modelling-tool/issues/new?assignees=&labels=type%3A+%3Abulb%3A+feature+request&template=feature-request.md&title=).

For enhancements please open an issue first to discuss what you would like to
change [here](https://github.com/equinor/data-modelling-tool/issues/new?assignees=&labels=type%3A+%3Awrench%3A+maintenance&template=code-maintenance.md&title=).

## Write documentation

This site was generated from the contents of your `docs` folder using https://docusaurus.io/ and we host it on GitHub Pages.

Documentation is important for users to understand the program and its features.
The documentation is written in markdown, a simple markup language. It can be found in the `docs` folder.

To start, please install yarn (<https://yarnpkg.com/getting-started/install>).

Get started by running:

```bash
cd docs
yarn install
yarn start
```

All stable documentation can be found in the `versioned_docs` folder.

Fork the project and create a pull request to add your documentation to the `main` branch.

## Getting started coding

If you’d like to work on a pull request and you’ve never submitted code before, follow these steps:

1. Set up a local development environment. 
   1. Please refer to
   the [manual](https://equinor.github.io/data-modelling-tool/docs/) for instructions on how to build, test, and run the template locally.
2. If you want to implement a breaking change or a change to the core, ensure there’s an issue that describes what you’re doing and the issue has been accepted. You can create a new issue or just indicate you’re working on an existing issue. 
   1. Bug fixes, documentation changes, and other pull requests do not require an issue up-front.

After that, you’re ready working with code.