// heading sprite
class HeadingSprite {

	// constructor
	constructor(heading) {
		this.h = heading;
		this.div = null; 
	}

	// display inside a div
	displayIn(parent, x, y) {

		// build div
		this.div = $("<div/>");
		this.div.append(this.h.title);
		this.div.prop("title", this.h.title)
		this.div.css("position", "absolute");
		this.div.css("left", x + 'px');
		this.div.css("top", y + 'px');
		this.div.css("width", '300px');
		this.div.css("height", '43px');
		this.div.css("background", "#A0A0A0");
		this.div.css("overflow", "hidden");


		// append to parent div
		parent.append(this.div);
	}

	// anomte to a new position
	animateTo(x, y) {
		this.div.animate({
			"left": x + 'px',
			"top": y + 'px'
		}, 250);
	}

}