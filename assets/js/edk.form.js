Edk.Project = new Class({

	Implements: [Options],
	options: {},
	project: null,
	title: '',
	image: null,
	container: null,
	div: null,
	grid: null,
	puzzles: [],

	initialize: function(project, options, grid) {
		this.setOptions(options);
		this.container = project;
		this.grid = grid;
		var img = project.getElement('img'),
			size = img.getSize();
		this.image = img.get('src');
		this.title = project.getElement('h2').get('text');
		project.getElement('h2').destroy();
		this.div = this.createDiv();

		var cols = Number.random(this.options.form.range[0], this.options.form.range[1]),
			rows = Number.random(this.options.form.range[0], this.options.form.range[1]);

		if (cols*this.options.form.size>size.x.toInt())
			cols = Number.floor(size.x.toInt()/this.options.form.size);
		if (rows*this.options.form.size>size.y.toInt())
			rows = Number.floor(size.y.toInt()/this.options.form.size);
		
		this.project = {
			cols: cols,
			rows: rows,
			cut: {
				col: Number.random(Number.ceil(cols/4), Number.ceil(cols/2)),
				row: Number.random(Number.ceil(cols/4),Number.ceil(rows/2))
			}
		};

		this.addEvents();

		return this;

	},

	addEvents: function() {
		this.container.addEvent('mouseenter', this.changeScales.bind(this));
		//this.container.getElement('.close').addEvent('click', this.closeWithGrid.bind(this));
		this.changeScales();
		//this.changeScales.periodical(2000, this);
	},

	createDiv: function() {
		var url = 'url(' + this.image + ')',
			div = new Element('div.puzzle', {
				styles: {
					'background-image': url,
					//'background-color': 'black',
					'width': this.options.form.size,
					'height': this.options.form.size
				}
			});
		return div;

	},

	draw: function(div, form, grid, fn) {
		var i=0,
			initialCol=form.pick()%this.options.grid.cols,
			initialRow= Math.floor(form.pick()/this.options.grid.cols);

		form.each( function(space, idx) {
			var col = space%this.options.grid.cols,
				row = Math.floor(space/this.options.grid.cols),
				bgPos = '-{y}px -{x}px',
				divToInject = div.clone(),
				open = (function(event){
					var height = this.open(row+1, event);
					fn(row, height);
				}).bind(this);
			
			divToInject.setStyles({
				top: row * this.options.form.size,
				left: col * this.options.form.size,
				'background-position': bgPos.substitute({
					x: (row - initialRow) * this.options.form.size,
					y: (col - initialCol) * this.options.form.size
				})
			});
			divToInject.set('text', this.title[i]);
			//divToInject.addEvent('click', open);

			this.setRandomScale(divToInject);
			this.container.grab(divToInject);
			this.puzzles.push(divToInject);
			i++;
		}, this);
	},

	clearCut: function() {
		this.project.cut.col = this.project.cut.row = 0;
	},

	setRandomScale: function(div) {
		var scaleProp = Number.random(3, 20) / 10,
			scale = 'scale(' + scaleProp + ')';
		div.setStyles({
			'-moz-transform': scale,
			'-webkit-transform': scale,
			'-o-transform': scale,
			'transform': scale
		});
	}, 

	changeScales: function() {
		this.puzzles.each(function(puzzle){
			this.setRandomScale(puzzle);
		}, this);
	},

	open: function(row, event) {
		var project = this.container,
			content = project.getElement('.content'),
			inside = content.getElement('.inside'),
			height = inside.getSize().y,
			opened = document.getElement('.project.open');

		if (opened)
			this.close(opened);

		content.setStyles({
			height: height,
			top: row * this.options.form.size
		});

		project.addClass('open');
		
		return height;
	},

	close: function(container) {
		container.removeClass('open');
		container.getElement('.content').setStyle('height', 0);

		this.grid.close();
	},
	closeWithGrid: function() {
		this.close(this.container);
		this.grid.close();
	},
	preserve: function() {
		this.container.addClass('preserve');
	},

	destroy: function() {
		this.container.destroy();
	}
});

// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 30);
          };
})();


// usage:
// instead of setInterval(render, 16) ....

(function animloop(){
  requestAnimFrame(animloop);
})();
// place the rAF *before* the render() to assure as close to
// 60fps with the setTimeout fallback.
function render() {

}