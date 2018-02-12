# Coveo-Client [![Build Status](https://api.travis-ci.org/y-lakhdar/coveo-client.svg?branch=master)](https://travis-ci.org/y-lakhdar/coveo-client) [![codecov](https://codecov.io/gh/y-lakhdar/coveo-client/branch/master/graph/badge.svg)](https://codecov.io/gh/y-lakhdar/coveo-client) [![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A simple client to manage organizations in the Coveo Cloud Platform.

## Description
This repository contains a command cline tool to perform administrative tasks in the Coveo Cloud Platform. It also allows automation of tasks that previously had to be done manually, like graduating the configuration from organizations in a different stage (ex.: dev, uat, prod).

## Available documentation
The code for the projects uses APIs, SDKs, and code from the Coveo Platform. You can use the following resources for more information and get started:

- Cloud Platform API general documentation: https://developers.coveo.com/display/public/CloudPlatform/Coveo+Cloud+V2+Home
- Cloud Platform Swagger: https://platform.cloud.coveo.com/docs?api=Platform (use the drop-down list to navigate the API categories, top-right of the page).
- PushAPI documentation: https://developers.coveo.com/display/public/CloudPlatform/Push+API+Usage+Overview
- Usage Analytics Swagger: https://usageanalytics.coveo.com/docs/
- Coveo Search UI Framework: https://github.com/coveo/search-ui

It's also built on nodejs/typescript.

## Important Gulp Tasks

* `gulp default`: Builds the entire project
* `gulp dev`: Starts a nodemon dev server for the project.
* `gulp devTest`: Starts a nodemon dev server for the tests.
* `gulp test`: Builds and runs the unit tests and saves the coverage.

> Note:
> Tests require the mock server to be running.
> To start the mock server, run `npm start`

## Contributing
- Branch
- Pull request to default putting at least 2 reviewers and at least 1 reviewer in y-lakhdar or ancientwinds.
- Simple as that!

The Coveo Team will look at your code and validate that :
- The guidelines are respected
- You didn’t forget any API key or password in it
- There is no malicious code

Files in this project are all located in misc, to follow the struture of the files in the coveo-labs.

## How-to build
```
npm install -g gulp
npm install
gulp
```

## How-to run
In order to run the tool, you will need 2 things: 
* At least 1 organization
* API keys for each organizations with the proper privileges

- Make sure you were able to run gulp entirely without any errors first. Then, run `node coveo-client.js --help` from the `bin` folder. The help screen will be displayed and will list the available commands.

INSERT SCREEN SHOT HERE

To get help regarding a specific command, run `node coveo-client.js <command_name> --help`, for example `node coveo-client.js graduate --help`. You will get detailed help regarding the different parameters.

INSERT SCREEN SHOT HERE

Parameters include, amongst others, a `Force` mode, a restriction on the http methods you can use (allows to prevent overiding existing values when graduating, for example) and a log level chooser.

When running a real command, for example when graduating fields between 2 orgs with the command `node coveo-client.js graduate -f -l verbose <org_1_id> <org_2_id> <org_1_key> <org_2_key>`, you will see the following output in the terminal.

INSERT SCREEN SHOT HERE

The fields will also get graduated from organization 1 to organization 2.

## Dev
```
gulp dev
```
This will start nodemon dev server instance.
Any time you hit Save in a source file, the bundle will be recompiled to the bin folder.

## Authors
- Jean-François Cloutier (https://github.com/ancientwinds)
- Yassine Lakhdar (https://github.com/y-lakhdar)
