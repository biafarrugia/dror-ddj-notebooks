// nticker main module

// process post=loading tasks
function main_loaded() {

	hdb = new HeadingsDb(headingsData);
	hdb.init();

	board = $("#board");
	hboard = new HeadingsBoard(board, hdb.getSources());

	ctrl = new BoardController($("#ctrl"), hdb, hboard);


	for (var i = 0 ; i < 0 ; i++ ) {

		var 	h = hdb.at(i);
		var		t = hboard.ticker(h.source);

		var hs = new HeadingSprite(h);
		t.display(hs);

	}

	ctrl.doTick();
}


// https://stackoverflow.com/questions/22697936/binary-search-in-javascript
function binarySearch(ar, el, compare_fn) {
    var m = 0;
    var n = ar.length - 1;
    while (m <= n) {
        var k = (n + m) >> 1;
        var cmp = compare_fn(el, ar[k]);
        if (cmp > 0) {
            m = k + 1;
        } else if(cmp < 0) {
            n = k - 1;
        } else {
            return k;
        }
    }
    return -m - 1;
}