grep $1 Postcodes___Local_Authorities_only_v01.csv | sort -R | head -3 | cut -d ',' -f 1,6- >>key3
