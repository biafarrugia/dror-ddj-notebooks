// heading sprite
class BoardController {

	// constructor
	constructor(parent, hdb, hboard) {

		this.crazy = false;

		this.hdb = hdb;
		this.hboard = hboard;

		this.min = hdb.minTimestamp;			// min time in database
		this.max = hdb.maxTimestamp;			// max time in datebase

		this.stepMsec = 10*60*1000;				// auto animation time to increment  (5m)
		this.tickMsec = 1000;					// how ofter to animate (0.25s)
		this.windowSec = 60*60*1000;			// how much is visible in the window (1h)

		if ( this.crazy ) {
			this.stepMsec = 10*60*1000;				// auto animation time to increment  (5m)
			this.tickMsec = 100;					// how ofter to animate (0.25s)
			this.windowSec = 3*60*1000;			// how much is visible in the window (1h)
		}


		this.curr = this.min - this.tickMsec;	// the current time pointer
		this.curr -= (this.curr % 60000);

		var 	text = this.curr.toString();	
		var		width = 600;
		var		height = 75;
		var		x = (parent.width() - width) / 2;
		var		y = (parent.height() - height) / 2;

		// build div
		this.div = $("<div/>");
		this.div.css("position", "relative");
		this.div.css("left", x + 'px');
		this.div.css("top", y + 'px');
		this.div.css("width", width + 'px');
		this.div.css("height", height + 'px');
		this.div.css("overflow", "hidden");
		this.div.addClass("clock");

		// append to parent div
		parent.append(this.div);

		// initialize ngram frequencies
		this.ngramFreq = new NgramFreq(1);
		this.ngramFreq2 = new NgramFreq(2);
		this.ngramFreq3 = new NgramFreq(3);
	}

	updateText() {
		var 	text = (new Date(this.curr)).toISOString().split("T")[1].split(".")[0];
		this.div.text(text);
	}

	updateCurr() {
		this.prevCurr = this.curr;
		this.curr = this.curr + this.stepMsec;
		this.updateText();
		this.updateHeadlines();
	}

	updateHeadlines() {

		// get new lines in
		var		headlines = hdb.getHeadlinesBetween(this.prevCurr, this.curr);
		for ( var h of headlines ) {

			// add sprites
			var		t = this.hboard.ticker(h.source);
			var 	hs = new HeadingSprite(h);
			t.display(hs, -0.25);

			// add to frequency accomulator
			var		toks = NgramFreq.split(h.title);
			this.ngramFreq.add(toks);
			this.ngramFreq2.add(toks);
			this.ngramFreq3.add(toks);
		}

		// update existing lines
		var that = this;
		this.hboard.animateTickers(function(h) {
			return that.calcXDepth(h);
		});

		// for now, print top ngrams
		//console.log(JSON.parse(JSON.stringify(this.ngramFreq.top(10))));
		//console.log(JSON.stringify(this.ngramFreq.top(10)));
		//console.log(JSON.stringify(this.ngramFreq2.top(10)));
		//console.log(JSON.stringify(this.ngramFreq3.top(10)));
	}

	doTick() {
		this.updateCurr();
		if ( this.curr < this.max )
			window.setTimeout(this.doTick.bind(this), this.tickMsec);
	}

	calcXDepth(h) {

		return (this.curr - h.timestamp) / this.windowSec;
	}

}