// heading sprite
class HeadingSprite {

	static colorMap = {
		"hc1": /(POTUS)|(Melania)|((Donald )?Trump)|(Republican)/gi,
		"hc2": /((Joe )?Biden)|(Democratic)/gi,
		"hc3": /(win)|(calls)|(called)|(electoral)|(state)|(count)|(vote)/gi
	}

	// constructor
	constructor(heading) {
		this.h = heading;
		this.div = null; 
	}

	// display inside a div
	displayIn(parent, x, y, height) {

		y += 75;

		this.x = x;
		this.y = y;

		// colorise text
		var		text = this.colorise(this.h.title);

		// build div
		//var color = getRandomColor(2) + "C0C0";
		this.div = $("<div/>");
		this.div.append('<span class="source">' + this.h.source + '</span>&nbsp;<span>' + text + '</span>');
		this.div.prop("title", this.h.title)
		this.div.css("left", x + 'px');
		this.div.css("top", y + 'px');
		this.div.css("width", '600px');
		this.div.css("height", height + 'px');
		this.div.addClass("hsprite");

		// append to parent div
		parent.append(this.div);
	}

	// anomte to a new position
	animateTo(x, y) {
		this.x = x;
		this.y = y;
		this.div.animate({
			"left": x + 'px',
			"top": y + 'px'
		}, 1000);
	}

	// colorise text
	colorise(text) {

		for ( var clazz in HeadingSprite.colorMap ) {

			text = text.replace(HeadingSprite.colorMap[clazz], '<span class="' + clazz + '">$&</span>');
		}

		return text;
	}
}