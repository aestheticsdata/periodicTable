$(function () {

	var cellsPos = [[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
					[1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
					[1,1,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
					[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

	var lookUpColors = {
		'ptm': [55,  155, 227],
		'tm' : [74,  202, 245],
		'nm' : [237, 120,  40],
		'am' : [249, 209,  47],
		'm'  : [165, 216,  48],
		'h'  : [231, 39,   69],
		'ng' : [190, 190, 190],
		'aem': [170, 194, 140],
		''   : [255, 255, 255]
	};

	var lookUpStates = {
		'gas'   : 'white',
		'liquid': 'yellow',
		'solid' : 'black'
	};

	var mf = $('#mouseFollower');
	mf.hide();
	

	var dbJSON;
	$.getJSON("data/data.json", function(data) {
		dbJSON = data;
		createCells();
		addZoomListener();
	});


	function createCells() {
		var cellContainer = $('#container');
		var index = 0;
		var cellWidth = 70,
			cellHeight = 70;

		for (var i=0; i<cellsPos.length; i++) {
			for (var j=0; j<cellsPos[i].length; j++) {
				var symbol = 'O';
				var bg = 'rgb(255,255,255)';
				var c = '#FFF';
				var imgRadio = '';
				var nbAtomique = '0';
				var elementName = '';
				if (cellsPos[i][j] === 1) {
					bg = lookUpColors[dbJSON.elements[index].category];
					c = lookUpStates[dbJSON.elements[index].state];
					symbol = dbJSON.elements[index].symbol;
					if (dbJSON.elements[index].radioactive === '1') {
						imgRadio = '<img src="./img/radioActive1.png" width="12px" style="left:3px; position:relative" ></img>';
					}
					nbAtomique = dbJSON.elements[index].nb;
					elementName = dbJSON.elements[index].name;
					index++;

				}
				var cell = $('<span elementName="'+elementName+'" symbol="'+symbol+'" nb="'+nbAtomique+'" id="cell.'+i+'x'+j+'">'+symbol+imgRadio+'<p style="font-size:10px">'+nbAtomique+'</p>'+'</span>');
				cell.addClass('cell')
					.css('background', 'rgb('+bg[0]+','+bg[1]+','+bg[2]+')')
					.css('color', c)
					.css('top', (i*cellHeight)+'px')
					.css('left', (j*cellWidth)+'px');
				
				cellContainer.append(cell);
			}
			cellContainer.append($('<br />'));
		}
	}

	function addZoomListener() { 
		var $zoom = $('#zoom');

		$('#container')
			.on('mouseenter', '.cell', function () {
				var $this = $(this);
				$this.fadeTo(100, 0.5, function () {});
				$zoom.text = $this.text;
				$zoom.css('background', $this.css('background-color'))
				     .css('color', $this.css('color'));
				$zoom.html('<h3>'+$this.attr('symbol')+'</h3>'+ 
					'<p id="zoomName">' + $this.attr('elementName') +
					'</p><p id="zoomNb">'+ $this.attr('nb') + '</p>'
				);
			})
			.on('mouseleave', '.cell', function () {
				$(this).fadeTo(100, 1, function () {});
				mf.hide();
			})
			.on('mousemove', '.cell', function (e) {
				if ($(this).attr('elementName') !== '') {
					mf.show();
					mf.css('left', e.clientX+20+'px')
					  .css('top',  e.clientY-30+'px')
					  .text($(this).attr('elementName'));
				} else {
					mf.hide();
					$zoom.css('background-color', '#000')
					      .css('color', '#000');
				}
			});
	}

});