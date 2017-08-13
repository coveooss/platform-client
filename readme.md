# coveo-client
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

* `gulp default`: Builds the entire project (CSS, templates, TypeScript, etc.)
* `gulp compile`: Builds only the TypeScript code and generates its output in the `./bin` folder.
* `gulp css`: Builds only the Sass code and generates its output in the `./bin` folder.
<!-- * `gulp test`: Builds and runs the unit tests. -->
<!-- * `gulp doc`: Generates the documentation website for the project. -->
* `gulp dev`: Starts a nodemon dev server for the project.
<!-- * `gulp devTest`: Starts a webpack dev server for the unit tests. -->

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
To build the project, use "tsc coveo-client.ts" from the misc folder.
```
npm install -g gulp
npm install
gulp
```

## How-to run
- Make sure you were able to run gulp entirely without any errors first. Then, type "npm start" from the misc folder.


## Dev
```
gulp dev
```
This will start nodemon dev server instance.
Any time you hit Save in a source file, the bundle will be recompiled to the bin folder.

## Authors
- Jean-François Cloutier (https://github.com/ancientwinds)
- Yassine Lakhdar (https://github.com/y-lakhdar)

