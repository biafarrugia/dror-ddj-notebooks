#!/bin/bash -xv

cut -d ',' -f 6-< Postcodes___Local_Authorities_only_v01.csv | sort | uniq -c >key1

cut -d ' ' -f 2- <key1 | sort | grep -E "^E" >key2

cut -d ',' -f 1 <key2 | parallel ./extract_p.sh

cut -d ',' -f 1,2 <key3 | sed 's/ //g' >key4

cut -d ',' -f 1 <key4 | parallel ./postcode-lookup.sh >>key5

join -t ','  <(sort -t ',' -k 1 key4) <(sort -t ',' -k 1 key5) >key6

echo "areacode,postcode,tier,area" >tiers_`date +"%y%m%d"`.csv
join -t ',' -12 -22 <(sort -t ',' -k 2 key6) <(sort -t ',' -k 2 key3) | cut -d ',' -f 1,2,3,5 | sort | sed 's/"//g' | uniq >>output/tiers_`date +"%y%m%d"`.csv

