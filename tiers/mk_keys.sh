#!/bin/bash -xv
mkdir -p build
rm build/key*

gzcat Postcodes___Local_Authorities_only_v01.csv.gz | cut -d ',' -f 6- | sort | uniq -c >build/key1

cut -d ' ' -f 2- <build/key1 | sort | grep -E "^E" >build/key2

cut -d ',' -f 1 <build/key2 | parallel ./extract_p.sh

cut -d ',' -f 1,2 <build/key3 | sed 's/ //g' >build/key4

