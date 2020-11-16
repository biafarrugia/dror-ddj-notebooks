

class HeadingsTicker {

	// constructor
	constructor(parent, y, height, source) {

		this.landingZone = 0.75;				// how much width is dedicated on the heading landing zone
		this.sprites = [];						// sprites currently displayed
		this.yRota = 0;							// a rota for the y position
		this.yRotaSize = 2;						// number of positions on the rota
		this.yRotaTick = height / 2;			// size of each rota tick
		this.xScaleExp = true;					// scale x scale exponentially

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

	display(hs, xDepth) {

		var		x = this.div.width() * this.landingZone * (1 - this.scaleXDepth(xDepth));
		var		y = this.yRota * this.yRotaTick;
		hs.displayIn(this.div, x, y, this.yRotaTick);
		this.sprites.push(hs);

		if ( ++this.yRota >= this.yRotaSize )
			this.yRota = 0;
	}

	// animate sprites
	animateSprites(xDepthFunc) {

		for ( var hs of this.sprites ) {

			var		xDepth = xDepthFunc(hs.h);
			if ( xDepth < -0.25 )
				console.log(xDepth);
			var		x = this.div.width() * this.landingZone * (1 - this.scaleXDepth(xDepth));
			hs.animateTo(x, hs.y);
		
		}
	}

	// scale xDepth
	scaleXDepth(x) {
		if ( this.xScaleExp && x >= 0 && x < 2.0 ) {
			x = (1 - (1.0 / Math.pow(2, x))) / 0.70;
			console.log(x)
		} 
		return x;
	}

}