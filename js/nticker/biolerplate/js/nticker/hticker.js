

class HeadingsTicker {

	// constructor
	constructor(parent, y, height, source) {

		// build div
		this.div = $("<div/>");
		this.div.append(source);
		this.div.prop("title", source)
		this.div.css("position", "absolute");
		this.div.css("left", '0px');
		this.div.css("top", y + 'px');
		this.div.css("width", parent.width() + 'px');
		this.div.css("height", height + 'px');
		this.div.css("background", "#A0C00C");
		this.div.css("overflow", "hidden");
		this.div.addClass("hticker");


		// append to parent div
		parent.append(this.div);

	}

	width() {
		return this.div.width();
	}

	display(hs) {

		var		x = this.div.width() * Math.random();		
		hs.displayIn(this.div, x, 0);
	}

}