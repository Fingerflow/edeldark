/*******************************************************
|
|	TODO LIST
|
|	  x Form range depends on number of element to
|		build the grid with
|	  √ Reserve space in the grid
|	  √ Open grid to display project 
|	  x View more grow up grid
|
*******************************************************/


Edk = {};

Edk.Grid = new Class({

	Implements: [Options],
	options: {
		/*onClick*/
	},

	container: null,
	projects: null,
	lastFreeSpace: 0,
	grid: '',
	currentForm: [],
	currentProject: null,
	up: null,
	low: null,

	initialize: function(container, options) {
		this.setOptions(options);
		this.container = container;
		this.projects = container.getElements('.project');
		this.overElement = container.getElements('> *[class!=project]');

		this.grid = this.create();

		this.overElement.each(this.addOverElement.bind(this));
		this.projects.each(this.addProject.bind(this));

	}, 

	create: function(overElement) {
		var grid = [];
		for (var i=0; i<this.options.grid.cols * this.options.grid.rows; i++) {
			grid[i]=0;
		}
		return grid;

	},

	addOverElement: function(el) {
		var size = el.getSize(),
			cols = c = Math.floor(size.x / this.options.form.size),
			rows = r = Math.floor(size.y / this.options.form.size),
			top = el.get('data-edk-grid-top')
			left = el.get('data-edk-grid-left');

		if (top.match(/%/))
			top = Number.floor((this.options.grid.rows-1) * top.toInt() / 100);
		else
			top = Number.floor(top.toInt() / this.options.form.size);
		if (left.match(/%/))
			left = Number.floor(this.options.grid.cols * left.toInt() / 100);
		else
			left = Number.floor(left.toInt() / this.options.form.size);
		
		for (var t=top; t<top+rows; t++) {
			for (var l=left; l<left+cols; l++) {
				this.write(t*this.options.grid.cols + l);
			}
		}

		this.clearTemp();	

		el.setStyles({
			top: top * this.options.form.size + el.getStyle('top').toInt(),
			left: left * this.options.form.size
		});


	},

	addProject: function(proj) {
		var freeSpace = this.lastFreeSpace = this.findFreeSpace(),
			project = this.currentProject = new Edk.Project(proj, this.options, this),
			cols = c = project.project.cols,
			rows = r = project.project.rows;
		
		if (freeSpace!==false) {
			console.log(' ------------- NEW PROJECT');
			this.write(freeSpace);
			this.build(freeSpace, cols, rows);
			//if (!this.isBorderLeft(freeSpace))
			//	this.buildLeft(freeSpace, cols, rows);
			//if (cols && !this.isBorderRight(freeSpace))
				//this.buildRight(freeSpace, cols, rows);
			//if (!this.isBorderBottom(freeSpace)) "/"
			//	this.buildBottom(freeSpace, c, rows);
			
			project.draw(project.createDiv(), this.currentForm, this.grid, this.open.bind(this));

			this.clearTemp();	
		} else {
			project.preserve();
		}

	},
	/*
	1 1 1 0 1 1 
	1 1 0 0 1 1 
	1 1 0 0 0 0
	*/
	/**
	Resolve right detection when goes back 
	**/
	build: function(currentSpace, cols, rows) {
		// Si espace à droite et cols>1 => buildRight()
		var testLeft = ['?','?','?',
						 0,     2,
						 0, 0, 0],
			testRight = ['?','?','?',
				  		  2,      0,
				  		  0, 0, 0],
			testBottom = ['?',2, '?',
						  '?',  '?',
						  0, 0, 0];
		
		if ( cols>1) {
			currentSpace++;
			console.log('buildRight - ', cols, rows, currentSpace, this.testPlace(currentSpace, testRight));
			//if (this.testPlace(currentSpace, testRight) || this.isBorderLeft(currentSpace)) {
			if (this.testPlace(currentSpace, testRight)) {
				this.buildRight(currentSpace, cols, rows);
			} else {
				currentSpace-=2;
				console.log('buildLeft - ', cols, rows, currentSpace, this.testPlace(currentSpace, testLeft));
				if (this.testPlace(currentSpace, testLeft)) {
					this.buildLeft(currentSpace, cols, rows);
				} else {
					cols =  this.currentProject.project.cols;
					currentSpace+=(this.options.grid.cols+1);
					console.log('buildBottom 1 - ', cols, rows, currentSpace, this.testPlace(currentSpace, testBottom));
					if (this.testPlace(currentSpace, testBottom) && rows>1) {
						this.buildBottom(currentSpace, cols, rows);
					}
				}
			}
		} else {
			cols =  this.currentProject.project.cols;
			currentSpace+=this.options.grid.cols-cols+1;
			console.log('buildBottom 2 - ', cols, rows, currentSpace, this.testPlace(currentSpace, testBottom));
			if (this.testPlace(currentSpace, testBottom) && rows>1) {
				this.buildBottom(currentSpace, cols, rows);
			}
		}
	},

	buildLeft: function(currentSpace, cols, rows) {
		cols--;
		this.write(currentSpace);
		this.build(currentSpace, cols, rows);
	},
	
	buildRight: function(currentSpace, cols, rows) {
		
		cols--;
		this.write(currentSpace);
		this.build(currentSpace, cols, rows);
		
	},

	buildBottom: function(currentSpace, cols, rows) {
		
		rows--;
		this.write(currentSpace);
		this.build(currentSpace, cols, rows);
		
	},


	write: function(space) {
		this.grid[space]=2;
		this.currentForm.push(space);
	},

	findFreeSpace: function() {
		for (var i=this.lastFreeSpace; i<this.grid.length; i++) {
			var testPlace = this.testPlace(i,[0,0,0,0,0,0,0,0]);
			if (testPlace)
				return i;
		}
		return false;
	},

	testPlace: function(space, required) {
		
		var r = this.options.grid.rows,
			c = this.options.grid.cols,
			g = this.grid,
			env = [
				0,0,0,
				0,  0,
				0,0,0
			],
			compare = function() {
				var r = env.every(function(value,index){
					return value==required[index] || (required[index]=='?'&&value!=1);
				});
				return r;
			};

		if (g[space]==1)
			return false;
		// set defaults
		env[0]=g[space-c-1];
		env[1]=g[space-c];
		env[2]=g[space-c+1];
		env[3]=g[space-1];
		env[4]=g[space+1];
		env[5]=g[space+c-1];
		env[6]=g[space+c];
		env[7]=g[space+c+1];

		// border left
		if (this.isBorderLeft(space))
			env[0]=env[3]=env[5]=0;
		// border top
		if (this.isBorderTop(space))
			env[0]=env[1]=env[2]=0;
		// border right
		if (this.isBorderRight(space))
			env[2]=env[4]=env[7]=0;
		// border bottom
		if (this.isBorderBottom(space))
			env[5]=env[6]=env[7]=0;

		return compare();

	},

	isBorderLeft: function(space) {
		return space%this.options.grid.cols==0;
	},

	isBorderTop: function(space) {
		return space<this.options.grid.cols;
	},

	isBorderRight: function(space) {
		return space%this.options.grid.cols==this.options.grid.cols-1;
	},

	isBorderBottom: function(space) {
		return space>this.options.grid.cols*(this.options.grid.rows-1);
	},
	isBuildingRight: function(space) {
		var checker = [
			0, 2, 2,
			0,    0,
			0, 0, 0
		];
		return this.testPlace(space, checker);
	},

	clearTemp: function() {
		var rand = 1;//Number.random(3, 9);

		this.currentForm = [];
		this.grid = this.grid.map(function(item){
			if(item==2) return rand;
			else return item;
		});
	},

	open: function(row, height) {
		var limit = row * this.options.form.size,
			puzzles = this.container.getElements('.puzzle, > *[data-edk-grid-left]');

		puzzles.each( function(puzzle, idx){
			var top = puzzle.getStyle('top').toInt();
			puzzle.setStyle('margin-top', top>limit ? height : 0);
		}, this);

	}, 

	close: function() {
		var puzzles = this.container.getElements('.puzzle, >*[data-edk-grid-left');
		puzzles.setStyle('margin-top', 0);
	}

});