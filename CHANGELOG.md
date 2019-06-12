# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="2.6.2"></a>
## [2.6.2](https://github.com/coveo/platform-client/compare/v2.6.1...v2.6.2) (2019-06-12)


### Bug Fixes

* Add ejs loader to open source diff ([ed0964e](https://github.com/coveo/platform-client/commit/ed0964e))



<a name="2.6.1"></a>
## [2.6.1](https://github.com/coveo/platform-client/compare/v2.6.0...v2.6.1) (2019-06-11)


### Bug Fixes

* fix ejs file path ([2f5904d](https://github.com/coveo/platform-client/commit/2f5904d))



<a name="2.6.0"></a>
# [2.6.0](https://github.com/coveo/platform-client/compare/v2.5.1...v2.6.0) (2019-06-11)


### Bug Fixes

* Add allfieldvalues to extensions to ignore ([a5b786a](https://github.com/coveo/platform-client/commit/a5b786a))
* Adding mandatory params for source creation ([f151903](https://github.com/coveo/platform-client/commit/f151903))
* Delete source during graduation ([a527bdd](https://github.com/coveo/platform-client/commit/a527bdd))
* don't remove params to create sources ([efa5047](https://github.com/coveo/platform-client/commit/efa5047))
* Ignore leading space in command option (resolves [#25](https://github.com/coveo/platform-client/issues/25)) ([7451019](https://github.com/coveo/platform-client/commit/7451019))
* Ignore Salesforce specific keys (fix [#39](https://github.com/coveo/platform-client/issues/39)) ([efe44f0](https://github.com/coveo/platform-client/commit/efe44f0))
* Keep mapping order on source graduate ([#40](https://github.com/coveo/platform-client/issues/40)) ([43ae5f0](https://github.com/coveo/platform-client/commit/43ae5f0))
* Multiple corrections ([5a3bdf7](https://github.com/coveo/platform-client/commit/5a3bdf7)), closes [#32](https://github.com/coveo/platform-client/issues/32) [#31](https://github.com/coveo/platform-client/issues/31)
* Source diff html page ([775d6d1](https://github.com/coveo/platform-client/commit/775d6d1))
* source graduation-keep params on destination ([6f9cc1e](https://github.com/coveo/platform-client/commit/6f9cc1e))
* Update source diff logic ([#22](https://github.com/coveo/platform-client/issues/22) [#23](https://github.com/coveo/platform-client/issues/23)) ([793e755](https://github.com/coveo/platform-client/commit/793e755))
* Use raw API call for sources ([#31](https://github.com/coveo/platform-client/issues/31)) ([b7b09c9](https://github.com/coveo/platform-client/commit/b7b09c9))


### Features

* Add QA environment ([e02e7f9](https://github.com/coveo/platform-client/commit/e02e7f9))
* Add source diff html page ([65e3649](https://github.com/coveo/platform-client/commit/65e3649))



<a name="2.5.1"></a>
## [2.5.1](https://github.com/coveo/platform-client/compare/v2.5.0...v2.5.1) (2019-02-17)


### Bug Fixes

* Change log file default file extension (fixes [#27](https://github.com/coveo/platform-client/issues/27)) ([77f885e](https://github.com/coveo/platform-client/commit/77f885e))



<a name="2.5.0"></a>
# [2.5.0](https://github.com/coveo/platform-client/compare/v2.4.0...v2.5.0) (2019-01-04)


### Features

* make field diff more readable ([88b9da7](https://github.com/coveo/platform-client/commit/88b9da7))



<a name="2.4.0"></a>
# [2.4.0](https://github.com/coveo/platform-client/compare/v2.3.1...v2.4.0) (2019-01-04)


### Features

* Add question to manually select sources for field operations ([cb60f39](https://github.com/coveo/platform-client/commit/cb60f39))
* Specify to which sources fields are associated ([ef09198](https://github.com/coveo/platform-client/commit/ef09198))


<!--
<a name="2.3.1"></a>
## [2.3.1](https://github.com/coveo/platform-client/compare/v2.3.0...v2.3.1) (2018-12-27) 



<a name="2.3.0"></a>
# [2.3.0](https://github.com/coveo/platform-client/compare/v2.2.0...v2.3.0) (2018-12-27)



<a name="2.2.0"></a>
# [2.2.0](https://github.com/coveo/platform-client/compare/v2.1.0...v2.2.0) (2018-12-27)

 -->

<a name="2.1.0"></a>
# [2.1.0](https://github.com/coveo/platform-client/compare/v2.0.0...v2.1.0) (2018-12-27)


### Bug Fixes

* Fix command.sh script for windows (resolve [#14](https://github.com/coveo/platform-client/issues/14)) ([ec5d23a](https://github.com/coveo/platform-client/commit/ec5d23a))
* Ignore CaptureMetadata extension ([20b0fbd](https://github.com/coveo/platform-client/commit/20b0fbd))


### Features

* Add option to ignore extension in interactive mode ([1eaee7e](https://github.com/coveo/platform-client/commit/1eaee7e))
* Add option to ignore sources from diff and graduate operations ([d6920ed](https://github.com/coveo/platform-client/commit/d6920ed))
* Add sources to ignore options in interactive command ([c079e59](https://github.com/coveo/platform-client/commit/c079e59))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/coveo/platform-client/compare/v1.5.0...v2.0.0) (2018-12-11)


### Breaking Changes
* Remove --force option ([717173e](https://github.com/coveo/platform-client/commit/717173e))
* Change the command syntax to require only one API key. ([e04d4fb](https://github.com/coveo/platform-client/commit/e04d4fb))


### Bug Fixes

* Add more info on error message and diff-field command ([18f41e0](https://github.com/coveo/platform-client/commit/18f41e0))
* Do not graduate Allmetadatavalues extensions ([2c5870b](https://github.com/coveo/platform-client/commit/2c5870b))
* Fix typo in console help ([d609c7f](https://github.com/coveo/platform-client/commit/d609c7f))
* Limit the number of concurrent requests (fixes [#15](https://github.com/coveo/platform-client/issues/15)) ([9f260f2](https://github.com/coveo/platform-client/commit/9f260f2))
* Delete operation set to false by default (fixes [#19](https://github.com/coveo/platform-client/issues/19)) ([e04d4fb](https://github.com/coveo/platform-client/commit/e04d4fb))
* Prevent blacklisted extension from being diffed for source command ([ee2ce33](https://github.com/coveo/platform-client/commit/ee2ce33))
* Remove [object object] from the console logs ([d9c55ee](https://github.com/coveo/platform-client/commit/d9c55ee))
* strip ansi chars from meta objects in log file ([d2bce74](https://github.com/coveo/platform-client/commit/d2bce74))


### Features

* Add option to blacklist extensions (fixes [#17](https://github.com/coveo/platform-client/issues/17)) ([ee7908e](https://github.com/coveo/platform-client/commit/ee7908e))
* Add update notifier ([c4c75a9](https://github.com/coveo/platform-client/commit/c4c75a9))
* Limit the number of concurrent requests for extension operations ([7e2e530](https://github.com/coveo/platform-client/commit/7e2e530))
* Add more meaningful graduation warning message ([e04d4fb](https://github.com/coveo/platform-client/commit/e04d4fb))



<!-- <a name="1.5.0"></a>
# [1.5.0](https://github.com/coveo/platform-client/compare/v1.4.0...v1.5.0) (2018-12-05)
 -->


<a name="1.4.0"></a>
# [1.4.0](https://github.com/coveo/platform-client/compare/v1.3.1...v1.4.0) (2018-12-04)


### Bug Fixes

* Fix command.sh script for windows (resolve [#14](https://github.com/coveo/platform-client/issues/14)) ([ec5d23a](https://github.com/coveo/platform-client/commit/ec5d23a))
* Remove ansi from log files ([9bbf35e](https://github.com/coveo/platform-client/commit/9bbf35e)), closes [#13](https://github.com/coveo/platform-client/issues/13)


### Features

* Add diff-source to interactive command ([9157c3c](https://github.com/coveo/platform-client/commit/9157c3c))
