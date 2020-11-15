#!/bin/bash -xv
mkdir -p build
rm build/key*

zcat Postcodes___Local_Authorities_only_v01.csv.gz | cut -d ',' -f 6- | sort | uniq >build/key1

cat build/key1 | sort | grep -E "^E" >build/key2

cut -d ',' -f 1 <build/key2 | parallel ./extract_p.sh

cut -d ',' -f 1,2 <build/key3 | sed 's/ //g' >build/key4

