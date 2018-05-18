# Coveo-Platform-Client [![Build Status](https://api.travis-ci.org/coveo/platform-client.svg?branch=master)](https://travis-ci.org/coveo/platform-client) [![codecov](https://codecov.io/gh/coveo/platform-client/branch/master/graph/badge.svg)](https://codecov.io/gh/coveo/platform-client) [![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

A simple client to manage organizations in the Coveo Cloud Platform.

## Description
This repository contains a command line tool to perform administrative tasks in the Coveo Cloud Platform. It also allows automation of tasks that previously had to be done manually, like graduating the configuration from organizations in a different stage (e.g.: DEV, UAT, PROD).

## Installation
Either through cloning with git or by using [npm](http://npmjs.org) (the recommended way) :

```
npm install -g coveo-platform-client
```

And the Coveo Platform client will be installed globally to your system path.

## Usage

In order to run the tool, you will need 2 things:
1. At least 2 organizations
2. API keys for each organization with the proper privileges (see [Available commands](https://github.com/coveo/platform-client#available-commands))

###### Interactive tool

The command line tool can be used in two different ways. The first one is by using the interactive tool :

```
platformclient interactive
```

![Alt Text](https://raw.githubusercontent.com/coveo/platform-client/master/documentation/images/interactive.gif)

###### Commands

For CLI options, use the -h (or --help) argument:

![](https://raw.githubusercontent.com/coveo/platform-client/master/documentation/images/help.png)

To get help regarding a specific command, run `platformclient <command_name> --help`, for example `platformclient graduate-fields --help`. You will get detailed help regarding the different parameters.

![](https://raw.githubusercontent.com/coveo/platform-client/master/documentation/images/graduate-help.png)

## Available Commands

### Graduate Fields - `graduate-fields`

Required API key privileges:

| Service |  Name  | View  | Edit  |
| :-----: | :----: | :---: | :---: |
| Content | Source |   ✔   |   ✔   |

---

### Graduate Extensions - `graduate-extensions`

Required API key privileges:

| Service |    Name    | View  | Edit  |
| :-----: | :--------: | :---: | :---: |
| Content | Extensions |   ✔   |   ✔   |

---

### Diff Fields - `diff-fields`

Required API key privileges:

| Service |  Name  | View  | Edit  |
| :-----: | :----: | :---: | :---: |
| Content | Source |   ✔   |       |

---

### Diff Extensions - `diff-extensions`

Required API key privileges:

| Service |    Name    | View  | Edit  |
| :-----: | :--------: | :---: | :---: |
| Content | Extensions |   ✔   |       |

---

## Dev
### Important Gulp Tasks

* `gulp default`: Builds the entire project
* `gulp dev`: Starts a nodemon dev server for the project.
* `gulp devTest`: Starts a nodemon dev server for the tests.
* `gulp test`: Builds and runs the unit tests and saves the coverage.

### Dev server
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
