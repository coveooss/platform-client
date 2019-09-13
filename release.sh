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

# This checks if you have access to push
if [[ -z $(git push --dry-run | grep "Could not read from remote repository") ]]; then
    exit 1
fi

# Making sure the directory is clean
if [ -z "$(git status --porcelain)" ]; then
  # Working directory clean
  echo 'The directory is clean. All good!'
else
  echo 'Uncommitted changes!'
  exit 1
fi

 This checks your current branch for differences
if [[ -z $(git status -uno | grep "up to date") ]]; then
    echo "Your branch is *not* up-to-date with origin/$RELEASE_BRANCH"
    echo "You should either push or reset to what is at master."
    echo "If you are unsure, you most likely want to do git --reset hard origin/$RELEASE_BRANCH"
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
