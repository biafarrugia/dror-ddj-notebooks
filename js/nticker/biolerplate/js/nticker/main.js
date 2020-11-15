// nticker main module

// process post=loading tasks
function main_loaded() {

	hdb = new HeadingsDb(headingsData);
	hdb.init();

	board = $("#board");

	hboard = new HeadingsBoard(board, hdb.getSources());


	for (var i = 0 ; i < 4 ; i++ ) {

		var 	h = hdb.at(i);
		var		t = hboard.ticker(h.source);
		var		x = t.width() * 0.75;
		var		y = 0;

		var hs = new HeadingSprite(h);
		t.display(hs, x, y);

	}

	/*

	hs2 = new HeadingSprite(hdb.at(1));
	hs2.displayIn(board, 200, 200)

	window.setTimeout(function() {

		hs1.animateTo(board.width()/2, board.height()/2);
		hs2.animateTo(board.width()*0.25, board.height()*.1);
	}, 1000);
	*/

}