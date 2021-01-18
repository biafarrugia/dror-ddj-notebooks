// word frequency accumulator class

class NgramFreq {

	// ignore list
	static ignoreToks = ["to", "is", "of", "a", "with", "and", "he", 
								"she", "-", "the", "that", "this", "in",
								"for", "on", "as", "are", "at"];

	// constructor
	constructor(ngramSize) {

		this.ngramSize = ngramSize;			// 1-single words, etc.
		this.freq = {}						// dictionary of ngrams and their counts
		this.count = 0;						// total count of ngrams
	}


	add(toks) {

		// loop on n-grams and accumulate
		for ( var i = 0 ; i <= toks.length - this.ngramSize ; i++ ) {

			// build ngram
			var		ngram = toks[i];
			for ( var j = 1 ; j < this.ngramSize ; j++ )
				ngram += " " + toks[i+j];

			// accumulate it
			if ( ngram in this.freq ) {
				this.freq[ngram]["count"] += 1;
			}
			else
				this.freq[ngram] = {"ngram": ngram, "count": 1};

			// add to total
			this.count += 1;
		}
	}

	top(topSize) {

		// get values
		var		values = $.map(this.freq, function(value, key) { return value });

		// sort (in descending order)
		var		sorted = values.sort(function(a, b){
			return b["count"] - a["count"];
		});

		// return top
		return sorted.slice(0, topSize);
	}

	static split(text) {

		// clean up
		var		text = text.replace(/[,.:]/g, "");

		// split on white space, filter out empty strings
		var 	toks = text.split(/\s+/).filter(Boolean);	

		// remove ignored and single character tokens
		toks = toks.filter(function(s) {
			return s.length > 1 && NgramFreq.ignoreToks.indexOf(s) < 0;
		})

		// to lower case - not sure about this yet
		toks = toks.map(function(s){return s.charAt(0).toUpperCase() + s.slice(1);})

		return toks;
	}
}