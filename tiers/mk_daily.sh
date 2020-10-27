#!/bin/bash -xv

cd "$(dirname "$0")"

cut -d ',' -f 1 <build/key4 | parallel ./postcode-lookup.sh >>build/key5

join -t ','  <(sort -t ',' -k 1 build/key4) <(sort -t ',' -k 1 build/key5) >build/key6

FILE=output/tiers_`date +"%y%m%d_%H"`.csv
echo "areacode,postcode,tier,area" >$FILE
join -t ',' -12 -22 <(sort -t ',' -k 2 build/key6) <(sort -t ',' -k 2 build/key3) \
			| cut -d ',' -f 1,2,3,5 | sort | sed 's/"//g' | uniq >>$FILE

