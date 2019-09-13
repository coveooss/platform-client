#!/usr/bin/env bash

DEV_BRANCH_NAME=develop
nextNpmVersion=$(node get-next-version.js)

read -p "Are you sure deploy the version ${nextNpmVersion} (y/n)? " -n 1 -r
echo    # (optional) move to a new line
if [[ ! $REPLY =~ ^[Yy]$ ]];
then
  exit 1
fi

echo
echo "Checking status of current branch"
echo

# Making sure the directory is clean
if [ -z "$(git status --porcelain)" ]; then
  # Working directory clean
  echo 'The directory is clean. All good!'
else
  echo 'Uncommitted changes!'
  exit 1
fi

# Running some the Unit tests and exit if errors
echo 'Launching unit tests...'
npm run test-ci || exit 1


echo 'Start the deployment'
git flow release start ${nextNpmVersion}
npm run standard-version
git flow release finish ${nextNpmVersion}
echo "Pushing to master"
git push origin master
echo "Pushing to $DEV_BRANCH_NAME"
git push origin $DEV_BRANCH_NAME
echo "Pushing tags"
git push origin --tags
