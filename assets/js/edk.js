/*Edk = {};
height = 20;
width = 20;
grid = {
	width: 50,
	height: 30
};
gutter = 1;
range = {
	min: 10,
	max: 15
};
number_of_cut = 2;
angles = [
	'top right',
	'bottom right',
	'bottom left',
	'top left'
];

Edk.Grid = new Class({

	container: null,
	projects: null,

	initialize: function(container) {
		this.container = container;
		this.projects = container.getElements('.project');
		this.projects.each(function(project) {
			new Edk.Project(project);
		});
	}

});

Edk.Project = new Class({

	project: null,

	initialize: function(project) {
		this.project = project;
		var div = this.createDiv();
		this.draw(
			div, 
			this.getRandomForm()
		);
		this.addEvents();

	},

	addEvents: function() {
		//this.changeScales();
		//this.changeScales.periodical(1500, this);
	},

	buildRectangle: function(cols, rows, value) {
		var rectangle = [];
				
		for (i=rows;i>0;i--) {
			var row=[];
			for (j=cols;j>0;j--) {
				row.push(value);
			}
			rectangle.push(row);
		}
		return rectangle;
	},
	//
	// @param where: Str ['top right', 'bottom right', 'bottom left', 'top left']
	//
	truncate: function(base, toDelete, where) {
		var right = base.pick().length - toDelete.pick().length,
			bottom = base.length - toDelete.length,
			top = left = 0;
		
		switch (where) {
			case 'top right':
				var fromX = right,
					fromY = top;
				break;
			case 'bottom right':
				var fromX = right,
					fromY = bottom
				break;
			case 'bottom left':
				var fromX = left,
					fromY = bottom;
				break;
			case 'top left':
					fromX = left,
					fromY = top;
				break;
		}
		for (var x=fromX; x<(toDelete.pick().length+fromX); x++) {
			for (var y=fromY; y<(toDelete.length+fromY); y++) {
				base[y][x] = 0;
			}
		}

		return base;
	},

	getRandomForm: function() {
		var form = base = this.buildRectangle(grid.width, grid.height, 1),
			rangeCols = {
				min: range.min / 2,
				max: base.length / 2
			},
			rangeRows = {
				min: range.min / 2,
				max: base.pick().length / 2
			},
			nboc = number_of_cut;
		
		angles.each(function(value) {
			if (!nboc)
				return;
			if (Number.random(0,1)) {
				var cols = Number.random(rangeCols.min,rangeCols.max),
					rows = Number.random(rangeRows.min,rangeRows.max);
				form = this.truncate(form, this.buildRectangle(cols, rows, 0), value);
				nboc--;
			}
		}, this);
			
		return form;

	},

	createDiv: function() {
		var url = 'url({img})',
			bg = {
				img: this.project.getElement('img').get('src')
			},
			div = new Element('div.puzzle', {
				styles: {
					'background-image': url.substitute(bg),
					'width': width,
					'height': height
				}
			});
		return div;

	},

	draw: function(div, form) {
		form.each( function(row, idR) {
			row.each( function(col, idC) {
				if (col) {
					var pos = {
							x: idR * width,
							y: idC * height
						},
						bgPos = '-{y}px -{x}px';
					
					div.setStyles({
						top: pos.x,
						left: pos.y,
						'background-position': bgPos.substitute(pos)
					});
					this.setRandomScale(div);
					this.project.grab(div.clone());
				}
			}, this);
		}, this);
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
		this.project.getElements('.puzzle').each(function(puzzle){
			this.setRandomScale(puzzle);
		}, this);
	}
});*/