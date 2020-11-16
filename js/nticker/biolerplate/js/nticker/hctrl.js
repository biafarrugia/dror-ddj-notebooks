// heading sprite
class BoardController {

	// constructor
	constructor(parent, hdb, hboard) {
		this.hdb = hdb;
		this.hboard = hboard;

		this.min = hdb.minTimestamp;
		this.max = hdb.maxTimestamp;
		this.curr = this.min;
		this.curr.setSeconds(0);
		this.stepMsec = 5*60*1000;
		this.tickMsec = 250;
		this.windowSec = 60*60*1000;

		var 	text = this.curr.toString();	
		var		width = 200;
		var		height = 50;
		var		x = (parent.width() - width) / 2;
		var		y = (parent.height() - height) / 2;

		// build div
		this.div = $("<div/>");
		this.div.css("position", "relative");
		this.div.css("left", x + 'px');
		this.div.css("top", y + 'px');
		this.div.css("width", width + 'px');
		this.div.css("height", height + 'px');
		this.div.css("background", "yellow");
		this.div.css("overflow", "hidden");

		// append to parent div
		parent.append(this.div);
	}

	updateText() {
		this.div.text(this.curr.toISOString());
	}

	updateCurr() {
		this.prevCurr = this.curr;
		this.curr = new Date(this.curr.getTime() + this.stepMsec);
		this.updateText();
		this.updateHeadlines();
	}

	updateHeadlines() {
		console.log(this.prevCurr, this.curr);
		var		headlines = hdb.getHeadlinesBetween(this.prevCurr, this.curr);
		console.log(headlines);
		for ( var h of headlines ) {
			var		t = this.hboard.ticker(h.source);
			var 	hs = new HeadingSprite(h);
			t.display(hs);
		}
		console.log()
	}

	doTick() {
		this.updateCurr();
		window.setTimeout(this.doTick.bind(this), this.tickMsec);
	}

}