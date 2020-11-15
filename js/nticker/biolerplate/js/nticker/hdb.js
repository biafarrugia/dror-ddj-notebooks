class HeadingsDb {

	// constructor
	constructor(data) {

		this.minTimestamp = new Date(8640000000000000);
		this.maxTimestamp = new Date(-8640000000000000);
		this.sources = new Set();
		this.data = data;
	}

	init() {

		for ( var h of this.data) {

			h.timestamp = new Date(h._timestamp.date);
			delete h._timestamp;
			h.source = h._source.name;
			delete h._source;

			if ( h.timestamp < this.minTimestamp )
				this.minTimestamp = h.timestamp;
			if ( h.timestamp > this.maxTimestamp )
				this.maxTimestamp = h.timestamp;
			this.sources.add(h.source);

		}

		this.data.sort(function(a, b) {
			return a.timestamp - b.timestamp;
		});

		console.log(this.sources);
	}

	// get a record by index
	at(i) {
		return this.data[i]
	}

	getSources() {
		return this.sources;
	}

}

