#!/bin/bash
set -euxo pipefail

echo -e "\n# Prepare to do work"
cd $GITHUB_WORKSPACE
REPO="https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
TARGET_BRANCH="gh-pages"

echo -e "\n# Checkout the repo in the target branch"
git clone $REPO dist -b $TARGET_BRANCH

echo -e "\n# Build the site"
yarn build

echo -e "\n# Commit and push"
cd dist
git pull
git add --all .
git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git commit -m "Site build: ${GITHUB_SHA}" || true
git push origin $TARGET_BRANCH
