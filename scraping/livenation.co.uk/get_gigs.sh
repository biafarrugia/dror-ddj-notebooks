echo "name,startDate,endDate,locationName,offersName,offsetAvailability,offersValidFrom,description"
for page in `seq 5`; do
	curl -s "https://www.livenation.co.uk/event/allevents?location=birmingham&page=$page"
done \
	| grep "<script type='application/ld+json'>" \
	| xmllint --html --nocdata --xpath "//script/text()" - \
	| sed 's/<!\[CDATA\[//g' \
	| sed 's/\]\]>//g' \
	| sed 's/https:\/\/schema.org\///g' \
	| jq "." --slurp \
	| jq -r 'map(.name), map(.startDate), map(.endDate), map(.location.name), map(.offers.name), map(.offers.availability), map(.offers.validFrom), map(.description) | @csv ' \
	| csvtool transpose -
