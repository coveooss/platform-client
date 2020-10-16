# Coveo-Platform-Client

[![Build Status](https://api.travis-ci.org/coveooss/platform-client.svg?branch=master)](https://travis-ci.org/coveooss/platform-client)
[![codecov](https://codecov.io/gh/coveooss/platform-client/branch/master/graph/badge.svg)](https://codecov.io/gh/coveooss/platform-client)
[![TypeScript](https://badges.frapsoft.com/typescript/code/typescript.svg?v=101)](https://github.com/ellerbrock/typescript-badges/)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

**The Coveo-Platform-Client is free to use, but is not an official Coveo product.**

- [Coveo-Platform-Client](#coveo-platform-client)
  - [Description](#description)
  - [Installation](#installation)
  - [Using from the command line](#using-from-the-command-line)
    - [Interactive tool](#interactive-tool)
    - [Commands](#commands)
      - [Command parameters](#command-parameters)
      - [Coveo Cloud V2 Platform environment](#coveo-cloud-v2-platform-environment)
        - [Environments](#environments)
        - [Regions](#regions)
      - [Diff](#diff)
      - [Graduation](#graduation)
        - [Graduating sources with OAuth authorization protocol](#graduating-sources-with-oauth-authorization-protocol)
        - [Graduation Order](#graduation-order)
      - [Download](#download)
      - [Upload](#upload)
  - [Development](#development)
    - [Dev server](#dev-server)
    - [Tests](#tests)
    - [Run the interactive tool in local](#run-the-interactive-tool-in-local)
  - [Available Coveo documentation](#available-coveo-documentation)


## Description

This repository contains a command line tool to perform administrative tasks in the Coveo Cloud V2 Platform. It also allows the automation of tasks that previously had to be done manually, like graduating the configuration from organizations in a different stage (e.g.: DEV, UAT, PROD).

## Installation

Either through cloning with git or by using [npm](http://npmjs.org) (the recommended way):

```
npm install -g coveo-platform-client
```

And the Coveo Cloud V2 Platform client will be installed globally to your system path.

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

 | **Command**          | Access Level                                   |
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

You can deploy resources across environments and regions using the options `--platformUrlOrigin` and  `--platformUrlDestination`.

##### Environments
1. [production](https://platform.cloud.coveo.com) (default)
1. [development](https://platformdev.cloud.coveo.com)
1. [qa](https://platformqa.cloud.coveo.com)
1. [hipaa](https://platformhipaa.cloud.coveo.com) (beta)

##### Regions
1. [US](https://platform.cloud.coveo.com) (default)
2. [Europe](https://platform-eu.cloud.coveo.com)
3. [Australia](https://platform-au.cloud.coveo.com)

Example: To graduate sources from the US Data Center to the Australian Data Center, the command would be:

```
platformclient graduate-sources ... --platformUrlDestination https://platform-au.cloud.coveo.com.
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

The graduate commands will deploy the changes from your origin organization to your destination organization. It is highly recommended to perform a `diff` before a `graduate` to make sure you know what you are graduating.

You also have the choice to create (`POST`), update (`PUT`) or/and delete (`DELETE`) resources during the graduation. If you don't specify the HTTP verb(s) with the `--methods` option, the graduation will only perform `POST` and `PUT` HTTP requests, meaning that nothing will be deleted unless you specify otherwise.

> :warning: During the graduation, the source credentials (username, password, API keys, Client ID, Client Secret ...) are not transferred to the destination org. Make sure to configure them after the source has been created


##### Graduating sources with OAuth authorization protocol
Some sources require the user to initially perform a handshake against another environment. These sources include, but not limited to, Salesforce, Zendesk, SharePoint, Dropbox, Box, Gmail, Google Drive. It is therefore recommended that you initially create the source manually from the Coveo Cloud Platform and make sure it has the same name as the one you are trying to graduate from the lower environment.


##### Graduation Order

If you have to graduate sources, **make sure to first graduate fields and extensions**. Trying to graduate a source for which an extension does not exist in the destination organization will likely raise an error and prevent the graduation operation.

<!-- Trying to graduate a source containing mapping rules referencing fields that do not exist in the destination organization will cause to ... -->


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

This can be useful if you want to revert your organization to a previous state (assuming that you have first downloaded that state).
Note that the outputs of the `download` commands can be used for the `upload` commands.
TODO: should always be an array!

## Development

### Dev server

```
npm start
```

This will start nodemon dev server instance.
Any time you hit **Save** in a source file or a test file, the dev server will reload and re-run your tests.

### Tests

Tests are written using [MochaJS](https://mochajs.org/). You can use `npm run test` to run the tests.

Code coverage will be reported in `./coverage`

### Run the interactive tool in local

Run the following commands:

1. `npm run build`
2. `node ./bin/client-global.js`

## Available Coveo documentation

The code for the projects uses APIs, SDKs, and code from the Coveo Cloud V2 Platform. You can use the following resources for more information and get started:

- Cloud V2 Platform API general documentation: https://docs.coveo.com/en/151/cloud-v2-developers/coveo-cloud-v2-for-developers
- Cloud V2 Platform Swagger: https://platform.cloud.coveo.com/docs?api=Platform (use the drop-down list to navigate the API categories, top-right of the page).
- Push API documentation: https://docs.coveo.com/en/68/cloud-v2-developers/push-api
- Usage Analytics Swagger: https://usageanalytics.coveo.com/docs/
- Coveo Search UI Framework: https://github.com/coveooss/search-ui

It's also built on nodejs/typescript.
