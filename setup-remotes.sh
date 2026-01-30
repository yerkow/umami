#!/bin/bash
git remote add origin git@github.com:yerkow/umami.git || true
git remote add upstream https://github.com/umami-software/umami.git || true
git fetch --all
echo "Remotes настроены!"
