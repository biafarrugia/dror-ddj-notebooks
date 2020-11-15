class HeadingsBoard {

	// constructor
	constructor(parent, sources) {

		// esablish dimensions
		var tickerHeight = parent.height() / sources.size;

		// create tickers
		this.tickers = new Object();
		var y = 0;
		for ( var s of sources ) {

			var t = new HeadingsTicker(parent, y, tickerHeight, s);
			this.tickers[s] = t;

			y += tickerHeight;
		}
	}

	// get ticker for a source
	ticker(s) {
		return this.tickers[s];
	}

}