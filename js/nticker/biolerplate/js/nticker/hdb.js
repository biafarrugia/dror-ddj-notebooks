class HeadingsDb {

	// constructor
	constructor(data) {

		this.minTimestamp = 8640000000000000;
		this.maxTimestamp = -8640000000000000;
		this.sources = new Set();
		this.data = data;
	}

	init() {

		for ( var h of this.data) {

			h.timestamp = (new Date(h._timestamp.date)).getTime();
			delete h._timestamp;
			h.source = h._source.name;
			delete h._source;

			if ( h.timestamp < this.minTimestamp )
				this.minTimestamp = h.timestamp;
			if ( h.timestamp > this.maxTimestamp )
				this.maxTimestamp = h.timestamp;
			this.sources.add(h.source);

		}

		this.data.sort(HeadingsDb.hcompare);

		console.log(this.sources);
	}

	static hcompare(a, b) {
		return a.timestamp - b.timestamp;
	}

	// get a record by index
	at(i) {
		return this.data[i]
	}

	getSources() {
		return this.sources;
	}

	getHeadlinesBetween(from, to) {

		var		fromIndex = binarySearch(this.data, {timestamp: from}, HeadingsDb.hcompare);
		if ( fromIndex < 0 )
			fromIndex = -fromIndex - 1;

		var 	toIndex = binarySearch(this.data, {timestamp: to}, HeadingsDb.hcompare);
		if ( toIndex < 0 )
			toIndex = -toIndex - 1;

		return this.data.slice(fromIndex, toIndex);
	}

}

