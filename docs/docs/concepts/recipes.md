---
title: Recipes
sidebar_position: 2
---

To express how a model is stored and presented, we use a concept of recipes. Every blueprint can have two kind of recipes in the Data Modelling Tool.

A recipe is just a specific instance of a recipe blueprint, and Libraries, plugins and services can use these recipes to make decisions and therefore become easy to replace.

## Storage Recipe

A recipe for how to store the data for a blueprint.

Contained means the value is stored in-place, and all primitives are stored with default contained property. However, if a blueprint is referring to another blueprint, then that blueprint can be stored as own independent entity.

## UI Recipe

A recipe for how to present data.