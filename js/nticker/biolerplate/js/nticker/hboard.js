class HeadingsBoard {

	// constructor
	constructor(parent, sources) {

		// esablish dimensions
		var tickerHeight = parent.height() / sources.size;

		// create tickers
		this.tickersBySource = new Object();
		this.tickers = [];
		var y = 0;
		for ( var s of sources ) {

			var t = new HeadingsTicker(parent, y, tickerHeight, s);
			this.tickersBySource[s] = t;
			this.tickers.push(t);

			y += tickerHeight;
		}
	}

	// get ticker for a source
	ticker(s) {
		return this.tickersBySource[s];
	}

	// animate all tickers
	animateTickers(xDepthFunc) {

		for ( var t of this.tickers ) 
			t.animateSprites(xDepthFunc);
	}

}