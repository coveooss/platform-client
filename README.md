# Coveo-Platform-Client [![Build Status](https://api.travis-ci.org/coveo/platform-client.svg?branch=master)](https://travis-ci.org/coveo/platform-client) [![codecov](https://codecov.io/gh/coveo/platform-client/branch/master/graph/badge.svg)](https://codecov.io/gh/coveo/platform-client) [![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

A simple client to manage organizations in the Coveo Cloud Platform.

## Description
This repository contains a command line tool to perform administrative tasks in the Coveo Cloud Platform. It also allows automation of tasks that previously had to be done manually, like graduating the configuration from organizations in a different stage (e.g.: DEV, UAT, PROD).

## Installation
Either through cloning with git or by using [npm](http://npmjs.org) (the recommended way) :

```
npm install -g coveo-platform-client
```

And the Coveo Platform client will be installed globally to your system path.

_Alternatively_, if you are using **NPM 5.2+** you can [use `npx`](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) instead of installing globally:

```
npx coveo-platform-client
```

## Usage the command line tool

### Interactive tool

The command line tool can be used in two different ways. The first one is by using the interactive tool :

```
platformclient interactive
```

![Alt Text](https://raw.githubusercontent.com/coveo/platform-client/master/documentation/images/interactive.png)

### Commands

For CLI options, use the -h (or --help) argument:

![](https://raw.githubusercontent.com/coveo/platform-client/master/documentation/images/help.png)

To get help regarding a specific command, run `platformclient <command> --help`.

![](https://raw.githubusercontent.com/coveo/platform-client/master/documentation/images/graduate-help.png)

```
platformclient <command> [options] <origin> <destination> <apiKey>
```

#### Description
1. `<command>`: Available `diff` and `graduate` commands
1. `[options]`: Command options
1. `<origin>`: The origin organization
1. `<destination>`: The destination organization
1. `<apiKey>`: An API key assigned to you by the Coveo Cloud Platform. You can view that api key if you connect to the [Coveo Cloud Platform](https://platform.cloud.coveo.com/) and open the developer console
![API key](https://raw.githubusercontent.com/coveo/platform-client/master/documentation/images/apiKey.png)

#### Examples

Diff fields between the `devEnv` and `prodEnv` organizations.
```
platformclient diff-fields devEnv prodEnv myApiKey
```

Diff fields between the `devEnv` and `prodEnv` organizations and return only fields for which the `facet` and `sort` properties have changed.
```
platformclient diff-fields devEnv prodEnv myApiKey --onlyKeys facet,sort
```

Diff extensions between the `devEnv` and `prodEnv` organizations without taking into account the description property.
```
platformclient diff-extensions devEnv prodEnv myApiKey --ignoreKeys description
```

Graduate fields from the `devEnv` to the `prodEnv` organization by only performing `PUT` operations. This will only update exisiting fields. `POST` and `DELETE` arguments can be used for adding and deleting fields.
```
platformclient diff-extensions devEnv prodEnv myApiKey --methods PUT
```

Graduate extensions from the `devEnv` to the `prodEnv` organization without a particular set of extensions. This command will prevent `my first extension` and `other extension` from being graduated
```
platformclient diff-extensions devEnv prodEnv myApiKey --ignoreExtensions "my first extension, other extension"
```


## Development
### Important Gulp Tasks

* `gulp default`: Builds the entire project
* `gulp dev`: Starts a nodemon dev server as well as the tests.
* `gulp test`: Builds and runs the unit tests and saves the coverage.

### Dev server
```
gulp dev
```
This will start nodemon dev server instance.
Any time you hit **Save** in a source file or in a test file, the dev server will reload and re-run your tests.


### Tests

Tests are written using [MochaJS](https://mochajs.org/). You can use `gulp test` to run the tests.

Code coverage will be reported in `./coverage`

## Available Coveo documentation
The code for the projects uses APIs, SDKs, and code from the Coveo Platform. You can use the following resources for more information and get started:

- Cloud Platform API general documentation: https://developers.coveo.com/display/public/CloudPlatform/Coveo+Cloud+V2+Home
- Cloud Platform Swagger: https://platform.cloud.coveo.com/docs?api=Platform (use the drop-down list to navigate the API categories, top-right of the page).
- PushAPI documentation: https://developers.coveo.com/display/public/CloudPlatform/Push+API+Usage+Overview
- Usage Analytics Swagger: https://usageanalytics.coveo.com/docs/
- Coveo Search UI Framework: https://github.com/coveo/search-ui

It's also built on nodejs/typescript.
