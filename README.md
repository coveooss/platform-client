# Coveo-Platform-Client [![Build Status](https://api.travis-ci.org/coveo/platform-client.svg?branch=master)](https://travis-ci.org/coveo/platform-client) [![codecov](https://codecov.io/gh/coveo/platform-client/branch/master/graph/badge.svg)](https://codecov.io/gh/coveo/platform-client) [![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

A simple client to manage organizations in the Coveo Cloud Platform.
**The Coveo-Platform-Client is free to use, but is not an official Coveo product.**

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


## Using from the command line

### Interactive tool

To initiate the interactive mode, run the following command in your terminal:

```
platformclient interactive
```


<!-- ![Alt Text](https://raw.githubusercontent.com/coveo/platform-client/master/documentation/images/interactive.png) -->

### Commands

For automated help, use the `-h` (or `--help`) argument:

![](https://raw.githubusercontent.com/coveo/platform-client/master/documentation/images/help.png)

To get help regarding a specific command, run `platformclient <command> --help`.

![](https://raw.githubusercontent.com/coveo/platform-client/master/documentation/images/graduate-help.png)

```
platformclient <command> [options] <origin> <destination> <apiKey>
```

##### Description
1. `<command>`: Available `diff` and `graduate` commands
1. `[options]`: Command options
1. `<origin>`: The origin organization
1. `<destination>`: The destination organization
1. `<apiKey>`: An API key assigned to you by the Coveo Cloud Platform. You can view that api key if you connect to the [Coveo Cloud Platform](https://platform.cloud.coveo.com/) and open the developer console
![API key](https://raw.githubusercontent.com/coveo/platform-client/master/documentation/images/apiKey.png)

##### Coveo Cloud Platform environment
You can target any of the 3 Coveo Cloud environments by using the `--env` option.
1. [production](https://platform.cloud.coveo.com) (default)
1. [development](https://platformdev.cloud.coveo.com)
1. [qa](https://platformqa.cloud.coveo.com)

So if you want to diff sources within the https://platformdev.cloud.coveo.com environment, you would run:

```
platformclient diff-sources ... --env development
```

#### Diff
The diff commands will allow you to visualize changes between organizations without doing any modifications.

##### Examples

*In the following examples, we are diffing from `devOrg` to `prodOrg`*

Basic field diff.
```
platformclient diff-fields devOrg prodOrg myApiKey
```

Diff fields and only return fields for which the `facet` and `sort` properties have changed.
```
platformclient diff-fields devOrg prodOrg myApiKey --onlyKeys facet,sort
```

Diff extensions without taking into account the description property.
```
platformclient diff-extensions devOrg prodOrg myApiKey --ignoreKeys description
```

Diff all sources **but** `Source A` and `Source B`.
```
platformclient diff-sources devOrg prodOrg myApiKey -S "Source A,Source B"
```

#### Graduation
The graduate commands will deploy the changes from your origin organization to your destination organization. It is highly recommended to perform a `diff` prior to a `graduate` in order to make sure you know what you are graduating.

You also have the choice to create (`POST`), update (`PUT`) or/and delete (`DELETE`) resources during the graduation. If you don't specify the HTTP verb(s) with the `--methods` option, the graduation will only perform `POST` and `PUT` HTTP requests, meaning that nothing will be deleted unless you specify otherwise.

##### Examples

*In the following examples, we are graduating from `devOrg` to `prodOrg`*

Graduate fields by only performing `PUT` operations. This will only update exisiting fields. `POST` and `DELETE` arguments can be used for adding and deleting fields.
```
platformclient diff-extensions devOrg prodOrg myApiKey --methods PUT
```

Graduate extensions and prevent `my first extension` and `other extension` extensions from being graduated
```
platformclient diff-extensions devOrg prodOrg myApiKey --ignoreExtensions "my first extension, other extension"
```

#### Download

The dowload commands can be useful keep backups or snapshots of a resource in a given time.
For instance, you can create a script to automatically take a snapshot of the fields, sources and extensions of an organization.

```
#!/bin/sh

platformclient download-fields $COVEO_ORG_ID $COVEO_API_KEY ./backup/
platformclient download-sources $COVEO_ORG_ID $COVEO_API_KEY ./backup/
platformclient download-extensions $COVEO_ORG_ID $COVEO_API_KEY ./backup/
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
