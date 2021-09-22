# DEPRECATED
[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

**This is no longer supported, please consider using the official [Coveo CLI](https://www.npmjs.com/package/@coveo/cli) instead.**

- [DEPRECATED](#deprecated)
  - [Description](#description)
  - [Moving from `platformclient` CLI to `coveo` CLI.](#moving-from-platformclient-cli-to-coveo-cli)
    - [Authentication](#authentication)
      - [How to authenticate with the Coveo CLI](#how-to-authenticate-with-the-coveo-cli)
    - [Download commands](#download-commands)
      - [Example](#example)
        - [with the `platformclient` CLI](#with-the-platformclient-cli)
        - [with the `coveo` CLI](#with-the-coveo-cli)
    - [Diff commands](#diff-commands)
      - [Example for previewing only one resource type](#example-for-previewing-only-one-resource-type)
        - [with the `platformclient` CLI](#with-the-platformclient-cli-1)
        - [with the `coveo` CLI](#with-the-coveo-cli-1)
    - [Graduate commands](#graduate-commands)
        - [with the `platformclient` CLI](#with-the-platformclient-cli-2)
        - [with the `coveo` CLI](#with-the-coveo-cli-2)
    - [platformclient upload-<resourceType>](#platformclient-upload-resourcetype)


## Description
⛔️ **DEPRECATED** This repository contains a command line tool to perform administrative tasks in the Coveo Cloud V2 Platform. It also allows the automation of tasks that previously had to be done manually, like graduating the configuration from organizations in a different stage (e.g.: DEV, UAT, PROD).

## Moving from `platformclient` CLI to `coveo` CLI.

### Authentication
Unlike the `platformclient` CLI, the `Coveo` CLI supports Oauth. This means, you no longer need to enter API keys on every commands. Instead, you only need to authenticate once to the Coveo platform and the CLI will keep you authenticated as long as your API key has not expired. Otherwise, you will be asked to authenticate again.

#### How to authenticate with the Coveo CLI

```bash
coveo auth:login --organization=<organizationId>
```

### Download commands

The `platformclient download-<resourceType>` commands have been replaced with `coveo org:resources:pull --resourceTypes <resourceTypes>`.
Unlike the `platformclient` CLI, the `Coveo` CLI can pull all the organization resources if the `--resourceTypes` flag is not specified.
Once you have pulled your organization resources with the `coveo org:resources:pull` command, you can push them to any organization.

#### Example
How to pull/download all the fields available in your organization.

##### with the `platformclient` CLI
```bash
platformclient download-fields [options] <origin>
```

##### with the `coveo` CLI
```bash
coveo org:resources:pull --resourceTypes field
```

### Diff commands

The `platformclient diff-<resourceType>` commands have been replaced with `coveo org:resources:preview`.
Once you have pulled your resources with the `coveo org:resources:pull` command, you can preview the changes against any organization.
#### Example for previewing only one resource type

##### with the `platformclient` CLI
```bash
platformclient diff-fields [options] <origin> <destination>
```

##### with the `coveo` CLI
```bash
coveo org:resources:preview --target <destination>
```

### Graduate commands

The `platformclient graduate-<resourceType>` commands have been replaced with `coveo org:resources:push`.
Once you have pulled your resources with the `coveo org:resources:pull` command, you can push the changes to any organization.

##### with the `platformclient` CLI
```bash
platformclient diff-fields [options] <origin> <destination>
```

##### with the `coveo` CLI
```bash
coveo org:resources:push --target <destination>
```

### platformclient upload-<resourceType>

The `platformclient upload-<resourceType>` commands can also be replaced with `coveo org:resources:push`.
