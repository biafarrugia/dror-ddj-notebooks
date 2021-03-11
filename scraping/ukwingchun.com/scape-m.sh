curl -s "https://www.ukwingchun.com/branches/" | xmllint 2>/dev/null --html --xpath "//h3[@id]/../p" - | grep ":" | sed -e "s/<[^>]*>//g"  | sed 's/Instructor/\
Instructor/g' | grep ":"  | gawk -F: '
function ltrim(s) { sub(/^[ \t\r\n]+/, "", s); return s }
function rtrim(s) { sub(/[ \t\r\n]+$/, "", s); return s }
function trim(s) { return rtrim(ltrim(s)); }
BEGIN {
	print("[{");
}
END {
	print("\"end\":0}]")
}
{
	if ( $1 == "Instructor" )
		print("\"end\":0},{")
	printf("\"%s\": \"%s", trim($1), trim($2));
	for ( i = 3 ; i <= NF ; i++ )
		printf(":%s", trim($i))
	print("\",")
}
' | jq -r 'map(.Instructor),map(.Email),map(.Telephone),map(.Location) | @csv' |\
csvtool transpose -

