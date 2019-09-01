#!/bin/bash
set -euxo pipefail

echo -e "\n# Prepare to do work"
cd $GITHUB_WORKSPACE
REPO="https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
TARGET_BRANCH="gh-pages"

echo -e "\n# Checkout the repo in the target branch"
git clone $REPO out -b $TARGET_BRANCH

echo -e "\n# Copy built site over"
rm -rf out/*
cp -r dist/* out

echo -e "\n# Commit and push"
cd out
git pull
git add --all .
git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git commit -m "Site build: ${GITHUB_SHA}" || true
git push origin $TARGET_BRANCH
