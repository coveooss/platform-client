# Coveo-Platform-Client [![Build Status](https://api.travis-ci.org/coveo/platform-client.svg?branch=master)](https://travis-ci.org/coveo/platform-client) [![codecov](https://codecov.io/gh/coveo/platform-client/branch/master/graph/badge.svg)](https://codecov.io/gh/coveo/platform-client) [![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A simple client to manage organizations in the Coveo Cloud Platform.

## Description
This repository contains a command line tool to perform administrative tasks in the Coveo Cloud Platform. It also allows automation of tasks that previously had to be done manually, like graduating the configuration from organizations in a different stage (ex.: dev, uat, prod).

## How-to build
You should have node 6.9.1 (or later) installed to build this project.

```
npm install -g gulp
npm install
gulp
```

## How-to run
In order to run the tool, you will need 2 things:
1. At least 2 organizations
2. API keys for each organizations with the proper privileges

> Make sure you were able to run gulp entirely without any errors first. Then, run `node client.js --help` from the `bin` folder. The help screen will be displayed and will list the available commands.

![](https://raw.githubusercontent.com/coveo/platform-client/master/documentation/images/help.png)

To get help regarding a specific command, run `node client.js <command_name> --help`, for example `node client.js graduate-fields --help`. You will get detailed help regarding the different parameters.

![](https://raw.githubusercontent.com/coveo/platform-client/master/documentation/images/graduate-help.png)

### Interactive Command

You can always run the interactive command with `node client.js interactive`

![Alt Text](https://raw.githubusercontent.com/coveo/platform-client/master/documentation/images/interactive.gif)

<!-- Parameters include, amongst others, a `Force` mode, a restriction on the http methods you can use (allows to prevent overiding existing values when graduating, for example) and a log level chooser. -->

Here is an exmaple of the field graduation between 2 orgs with the command `node client.js graduate-fields <org_1_id> <org_2_id> <org_1_key> <org_2_key> -l verbose`.

![](https://raw.githubusercontent.com/coveo/platform-client/master/documentation/images/graduate-fields.png)

<!-- The fields will also get graduated from organization 1 to organization 2. -->

## Important Gulp Tasks

* `gulp default`: Builds the entire project
* `gulp dev`: Starts a nodemon dev server for the project.
* `gulp devTest`: Starts a nodemon dev server for the tests.
* `gulp test`: Builds and runs the unit tests and saves the coverage.

## Dev
```
gulp dev
```
This will start nodemon dev server instance.
Any time you hit Save in a source file, the bundle will be recompiled to the bin folder.


### Tests

Tests are written using [MochaJS](https://mochajs.org/). You can use `npm run test` to run the tests.

If you wish to write new unit tests, you can do so by starting a new nodemon dev instance.

To start the server, run `gulp devTest`.

Every time you hit **Save** in a source file or in a test file, the dev server will reload and re-run your tests.

Code coverage will be reported in `./coverage`

## Available Coveo documentation
The code for the projects uses APIs, SDKs, and code from the Coveo Platform. You can use the following resources for more information and get started:

- Cloud Platform API general documentation: https://developers.coveo.com/display/public/CloudPlatform/Coveo+Cloud+V2+Home
- Cloud Platform Swagger: https://platform.cloud.coveo.com/docs?api=Platform (use the drop-down list to navigate the API categories, top-right of the page).
- PushAPI documentation: https://developers.coveo.com/display/public/CloudPlatform/Push+API+Usage+Overview
- Usage Analytics Swagger: https://usageanalytics.coveo.com/docs/
- Coveo Search UI Framework: https://github.com/coveo/search-ui

It's also built on nodejs/typescript.

## Contributing
- Branch
- Pull request to default putting at least 2 reviewers and at least 1 reviewer in coveo or ancientwinds.
- Simple as that!

The Coveo Team will look at your code and validate that :
- The guidelines are respected
- You didn’t forget any API key or password in it
- There is no malicious code

## Authors
- Jean-François Cloutier (https://github.com/ancientwinds)
- Yassine Lakhdar (https://github.com/coveo)
