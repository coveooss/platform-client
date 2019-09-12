# Coveo-Platform-Client [![Build Status](https://api.travis-ci.org/coveooss/platform-client.svg?branch=master)](https://travis-ci.org/coveooss/platform-client) [![codecov](https://codecov.io/gh/coveooss/platform-client/branch/master/graph/badge.svg)](https://codecov.io/gh/coveooss/platform-client) [![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

A simple client to manage organizations in the Coveo Cloud V2 Platform.

**The Coveo-Platform-Client is free to use, but is not an official Coveo product.**

## Description

This repository contains a command line tool to perform administrative tasks in the Coveo Cloud V2 Platform. It also allows automation of tasks that previously had to be done manually, like graduating the configuration from organizations in a different stage (e.g.: DEV, UAT, PROD).

## Installation

Either through cloning with git or by using [npm](http://npmjs.org) (the recommended way):

```
npm install -g coveo-platform-client
```

And the Coveo Cloud V2 Platform client will be installed globally to your system path.

<!-- _Alternatively_, if you are using **NPM 5.2+** you can [use `npx`](https://medium.com/@maybekatz/introducing-npx-an-npm-package-runner-55f7d4bd282b) instead of installing globally:

```
npx coveo-platform-client
``` -->

## Using from the command line

### Interactive tool

The interactive tool makes it easier to build the command by answering questions, typing values or selecting options or items.

1. To initiate the interactive mode, run the following command in your terminal:

    ```
    platformclient interactive
    ```

2. Answer the questions, typing values or selecting options or items.
3. Manually run the command created by the tool (in the file for which you provided the filename).

<!-- ![Alt Text](https://raw.githubusercontent.com/coveooss/platform-client/master/documentation/images/interactive.png) -->

### Commands

For automated help, use the `-h` (or `--help`) argument:

![](https://raw.githubusercontent.com/coveooss/platform-client/master/documentation/images/help.png)

To get help regarding a specific command, run `platformclient <command> --help`.

![](https://raw.githubusercontent.com/coveooss/platform-client/master/documentation/images/graduate-help.png)

```
platformclient <command> [options] <origin> <destination> <apiKey...>
```

#### Command parameters

1. `<command>`: Available `diff` and `graduate` commands
1. `[options]`: Command options
1. `<origin>`: The origin organization
1. `<destination>`: The destination organization
1. `<apiKey...>`: You can either use a **master API Key** or 2 API keys specific to each Coveo organization. The **master API key** is assigned to you by the Coveo Cloud V2 Platform. You can view that API key by connecting to the [Coveo Cloud V2 Platform](https://platform.cloud.coveo.com/) then opening the developer console.

   ![API key](https://raw.githubusercontent.com/coveooss/platform-client/master/documentation/images/apiKey.png)

    However, the recommended approach is to use 2 API keys that you have first [created on the Coveo Cloud V2 Platform](https://docs.coveo.com/en/1718/cloud-v2-administrators/api-keys---page). If you are using this approach, make sure to provide the appropriate privileges to the API key based on the operation you want to execute (refer to the table below).

    **API Privileges table**

    | Command              | Access Level                                   |
    | :------------------- | :--------------------------------------------- |
    | download-fields      | Fields (View All)                              |
    | upload-fields        | Fields (Edit All)                              |
    | download-extensions  | Extensions (View All)                          |
    | upload-extensions    | Extensions (Edit All)                          |
    | download-sources     | Sources (View All)                             |
    | upload-sources       | Sources (Edit All)                             |
    | download-pages       | Search Pages (View All)                        |
    | upload-pages         | Search Pages (Edit All)                        |
    | diff-fields          | Fields (View All) _and_ Sources (View All)     |
    | diff-fields-file     | Fields (View All) _and_ Sources (View All)     |
    | diff-extensions      | Extensions (View All) _and_ Sources (View All) |
    | diff-extensions-file | Extensions (View All) _and_ Sources (View All) |
    | diff-sources         | Extensions (View All) _and_ Sources (View All) |
    | diff-sources-file    | Extensions (View All) _and_ Sources (View All) |
    | diff-pages           | Search Pages (View All)                        |
    | diff-pages-file      | Search Pages (View All)                        |
    | graduate-fields      | Fields (Edit All) _and_ Sources (View All)     |
    | graduate-extensions  | Extensions (Edit All) _and_ Sources (View All) |
    | graduate-sources     | Extensions (View All) _and_ Sources (Edit All) |
    | graduate-pages       | Search Pages (Edit All)                        |

#### Coveo Cloud V2 Platform environment

You can target any of the 3 Coveo Cloud environments by using the `--env` option.

1. [production](https://platform.cloud.coveo.com) (default)
1. [development](https://platformdev.cloud.coveo.com)
1. [qa](https://platformqa.cloud.coveo.com)
1. [hipaa](https://platformhipaa.cloud.coveo.com) (beta)

So if you want to diff sources within the https://platformdev.cloud.coveo.com environment, you would run:

```
platformclient diff-sources ... --env development
```

#### Diff

The diff commands will allow you to visualize changes between organizations without doing any modifications.

> **Examples**
>
> _In the following examples, we are diffing from `devOrg` to `prodOrg` using a master API key `myApiKey`_
>
> Basic field diff.
>
> ```
> platformclient diff-fields devOrg prodOrg myApiKey
> ```
>
> You can achieve the same result using 2 API keys
>
> ```
> platformclient diff-fields devOrg prodOrg devApiKey prodApiKey
> ```
>
> Diff fields and only return fields for which the `facet` and `sort` properties have changed.
>
> ```
> platformclient diff-fields devOrg prodOrg myApiKey --onlyKeys facet,sort
> ```
>
> Diff extensions without taking into account the description property.
>
> ```
> platformclient diff-extensions devOrg prodOrg myApiKey --ignoreKeys description
> ```
>
> Diff all sources **but** `Source A` and `Source B`.
>
> ```
> platformclient diff-sources devOrg prodOrg myApiKey -S "Source A,Source B"
> ```

You can also diff a resource in your organization against a local file. This can be useful to track changes after a given time.
For instance you can see how many fields have changed since the last time you ran a `download-fields` command.

> **Example**
>
> Diff fields from `YourOrg` against `YourLocalFile`.
>
> ```
> platformclient diff-fields-file YourOrg YourApiKey YourLocalFile
> ```

#### Graduation

The graduate commands will deploy the changes from your origin organization to your destination organization. It is highly recommended to perform a `diff` prior to a `graduate` in order to make sure you know what you are graduating.

You also have the choice to create (`POST`), update (`PUT`) or/and delete (`DELETE`) resources during the graduation. If you don't specify the HTTP verb(s) with the `--methods` option, the graduation will only perform `POST` and `PUT` HTTP requests, meaning that nothing will be deleted unless you specify otherwise.

> **Examples**
>
> _In the following examples, we are graduating from `devOrg` to `prodOrg` using a master api key `myApiKey`_
>
> Graduate fields by only performing `PUT` operations. This will only update existing fields. `POST` and `DELETE` arguments can be used for adding and deleting fields.
>
> ```
> platformclient graduate-extensions devOrg prodOrg myApiKey --methods PUT
> ```
>
> You can achieve the same result using 2 API keys
>
> ```
> platformclient graduate-extensions devOrg prodOrg devApiKey prodApiKey --methods PUT
> ```
>
> Graduate extensions and prevent `my first extension` and `other extension` extensions from being graduated
>
> ```
> platformclient graduate-extensions devOrg prodOrg myApiKey --ignoreExtensions "my first extension, other extension"
> ```

#### Download

The download commands can be useful to keep backups or snapshots of a resource in a given time.
For instance, you can create a script to automatically take a snapshot of the fields, sources and extensions of an organization.

```
#!/bin/sh

platformclient download-fields $COVEO_ORG_ID $COVEO_API_KEY ./backup/
platformclient download-sources $COVEO_ORG_ID $COVEO_API_KEY ./backup/
platformclient download-extensions $COVEO_ORG_ID $COVEO_API_KEY ./backup/
```

#### Upload

This can be useful if you want to revert back your organization to a previous state (assuming that you have first downloaded that state).
Note that the outputs of the `download` commands can be used for the `upload` commands.
TODO: should always be an array!

## Development

### Important Gulp Tasks

- `gulp default`: Builds the entire project
- `gulp dev`: Starts a nodemon dev server as well as the tests.
- `gulp test`: Builds and runs the unit tests and saves the coverage.

### Dev server

```
gulp dev
```

This will start nodemon dev server instance.
Any time you hit **Save** in a source file or in a test file, the dev server will reload and re-run your tests.

### Tests

Tests are written using [MochaJS](https://mochajs.org/). You can use `gulp test` to run the tests.

Code coverage will be reported in `./coverage`

### Run the interactive tool in local

Run the following commands:

1. `gulp`
2. `node ./bin/client-global.js`

## Available Coveo documentation

The code for the projects uses APIs, SDKs, and code from the Coveo Cloud V2 Platform. You can use the following resources for more information and get started:

- Cloud V2 Platform API general documentation: https://docs.coveo.com/en/151/cloud-v2-developers/coveo-cloud-v2-for-developers
- Cloud V2 Platform Swagger: https://platform.cloud.coveo.com/docs?api=Platform (use the drop-down list to navigate the API categories, top-right of the page).
- Push API documentation: https://docs.coveo.com/en/68/cloud-v2-developers/push-api
- Usage Analytics Swagger: https://usageanalytics.coveo.com/docs/
- Coveo Search UI Framework: https://github.com/coveooss/search-ui

It's also built on nodejs/typescript.
