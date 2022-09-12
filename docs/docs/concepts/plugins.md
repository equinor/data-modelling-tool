---
title: Plugins
sidebar_position: 3
---

Add functionality and customize your applications using custom plugins.

Custom plugins are Node.js packages that implement the DMT APIs (interfaces).

There will be many types of custom plugins, but for now we support only UI plugins.


## What is a Plugin?

All plugins should be placed under the /custom-plugins folder.

Custom plugins are Node.js packages that implement DMT APIs (interfaces). For larger, more complex custom applications, plugins let you modularize your site customizations into site-specific functionality.

One of the best ways to add functionality to DMT applications is through the plugin system. DMT applications is designed to be extensible, which means plugins are able to extend and modify just about everything DMT does.

Of the many possibilities, plugins can:

* Show custom display for certain documents