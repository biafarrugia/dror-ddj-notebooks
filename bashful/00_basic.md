### Basic stuff

#### Get number of lines
```
$ wc data/ral_standard.csv 
     213    1358   22999 data/ral_standard.csv
$ wc data/ral_standard.csv | awk '{print $1}'
213     
```

#### Examine first line
```
$ head -1 data/ral_standard.csv 
RAL, RGB, HEX, German, English, French, Spanish, Italian, Nederlands
$ head -1 data/ral_standard.csv | tr "," "\n"| awk '{$1=$1;print}'
RAL
RGB
HEX
German
English
French
Spanish
Italian
Nederlands     
$ tail +2 data/ral_standard.csv | wc
     212    1349   22930
```

#### Row/Column access
```
$ tail +201 data/ral_standard.csv | head -1
RAL 9001,250-244-227,#FDF4E3,Cremeweiß,Cream,Blanc crème,Blanco crema,Bianco crema,Crèmewit
$ cut -d ',' -f 5 <data/ral_standard.csv  | grep -i purple
Purple red
$ awk -F, '{print $5}'  <data/ral_standard.csv  | grep -i purple
Purple red
Traffic purple
Purple violet
$ cut -d ',' -f 5 <data/ral_standard.csv  | tr " " "\n" | sort | uniq -c | sort -n | tail -5
  18 brown
  19 red
  24 green
  25 blue
  35 grey

```

####　Searching
```
$ tail +2 data/ral_standard.csv | cut -d ',' -f 5 | grep -i yellow | wc -l
      24
$ grep -E "^RAL 2000" <data/ral_standard.csv | cut -d ',' -f 2
237-118-014      
```

#### Get a random lines
```
$ tail +2 data/ral_standard.csv | sort -r | head -1
RAL 9023,130-130-130,#828282,Perldunkelgrau,Pearl dark grey,Gris fonçé nacré,Gris oscuro perlado,Grigio scuro perlato,Parelmoer-donkergrijs
$ tail +2 data/ral_standard.csv | grep -i yellow | sort -r | head -1
RAL 7034,143-139-102,#8F8B66,Gelbgrau,Yellow grey,Gris jaune,Gris amarillento,Grigio giallastro,Geelgrijs
```
