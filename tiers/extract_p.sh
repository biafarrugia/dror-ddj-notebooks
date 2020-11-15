zcat Postcodes___Local_Authorities_only_v01.csv.gz | grep $1 | sort -R | head -3 | cut -d ',' -f 1,6- >>build/key3
