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

## How-to run 
- After building it, type "npm start" from the misc folder.

## Dependencies 
- nodejs
- npm
- typescript

## Authors
- Jean-François Cloutier (https://github.com/ancientwinds)
- Yassine Lakhdar (https://github.com/y-lakhdar)

