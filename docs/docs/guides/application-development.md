---
sidebar_position: 1
---

# Application development 

## Create a new data modelling app

To create a project, run:

```
npx create-dm-app my-app
cd my-app
npm start
```

:::note

npx on the first line is not a typo — it’s a package runner tool that comes with npm 5.2+.

:::

Create Dm App just creates a frontend, and you can connect it with any Data Modelling Storage Service (DMSS) you want. 

:::note

Under the hood, it uses Create React App, but you don’t need to know anything about them.

:::

Important app folders and files:

```
my-app/
|_ apps/ - List of apps included (blueprint, entities, and data sources)
  |_ demo-app/
    |_ data
    |_ data_sources/
      |_ settings.json
  |_ src
    |_ plugins.js - List of plugins that should be loaded
    |_ settings.json - App settings
```



## Configure the app

Then, change the `src/settings.json` to point to the DMSS that will be used:

```
{
  "name": "my-new-portal",
  "type": "System/SIMOS/portal",
  "dmssUrl": "localhost:5000",  
  "dataSourceId": "DemoDS"
}
```

See ...TODO... for how-to run DMSS locally for development.

### Upload blueprints and entities

To populate the configured DMSS with the blueprints and entities, run:

```
git clone git@github.com:equinor/dm-cli.git
cd dm-cli
python setup.py install 
dm --dir ../my-app/apps reset-app  
```

The --dir points to the folder where blueprint and entities are located, default is under `apps/`.

## Start running the app

To start the developer server, run:

```
yarn start
```

This will open the application at http://localhost:3000.