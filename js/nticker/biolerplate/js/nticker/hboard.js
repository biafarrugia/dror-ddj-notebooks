class HeadingsBoard {

	// constructor
	constructor(parent, sources) {

		this.multiTicker = false;

		// inits
		this.tickersBySource = new Object();
		this.tickers = [];
		var y = 0;
		var tickerHeight = parent.height();

		if ( this.multiTicker ) 
			tickerHeight /= sources.size;
		else
			sources = ["All"];

		// create tickers
		for ( var s of sources ) {

			var t = new HeadingsTicker(parent, y, tickerHeight, s);
			this.tickersBySource[s] = t;
			this.tickers.push(t);

			y += tickerHeight;
		}
	}

	// get ticker for a source
	ticker(s) {
		if ( this.multiTicker )
			return this.tickersBySource[s];
		else
			return this.tickers[0];
	}

	// animate all tickers
	animateTickers(xDepthFunc) {

		for ( var t of this.tickers ) 
			t.animateSprites(xDepthFunc);
	}

}