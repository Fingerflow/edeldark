// Site
window.addEvent('domready', function() {

	var body = document.getElement('body'),
		bodySize = body.getSize(),
		projectContainer = document.getElement('.project-container'),
		logo = document.getElement('#logo'),
		projects = projectContainer.getElements('.project'),
		viewMore = document.getElement('#viewmore'),
		size = 30,
		baseRange = Number.floor(8 * 8/projects.length),
		baseRange = baseRange > 6 ? baseRange : 6,
		leftTab = document.id('leftTab'),
		viewmoreLegend = document.id('viewmoreLegend'),
		args = {
			grid: {
				cols: Number.floor(bodySize.x/size)-1,
				rows: Number.floor(bodySize.y/size)-1
			},
			form: {
				size: size,
				range: [baseRange, baseRange*1.5]
			}, 
			getMore: function() {
				console.log('test');
			}
		};

	/*logo.addEvent('mouseenter', function(){
		body.addClass('menu');
	});
	leftTab.addEvent('mouseleave', function(){
		body.removeClass('menu');
	});*/
	if (viewMore) {
		viewMore.addEvent('mouseenter', function(){
			body.addClass('viewmore');
		});
		viewmoreLegend.addEvent('mouseleave', function(){
			body.removeClass('viewmore');
		});
	}

	new Edk.Grid(global, args);
	
});
