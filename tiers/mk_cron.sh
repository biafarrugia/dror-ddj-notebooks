#!/bin/bash -xv

cd "$(dirname "$0")"

git pull
./mk_daily.sh
git add output/*csv
git commit -a -m '`date +"%y%m%d_%H"`'
git push
