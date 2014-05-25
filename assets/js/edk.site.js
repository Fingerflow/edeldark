// Site
window.addEvent('load', function() {

	var body = document.getElement('body'),
		bodySize = body.getSize(),
		projectContainer = document.getElement('.project-container'),
		projectContainerSize = projectContainer.getSize(),
		nav = document.getElement('nav#mainnav'),
		projects = projectContainer.getElements('.project'),
		viewMore = document.getElement('#viewmore'),
		size = 30,
		baseRange = Number.floor(8 * 8/projects.length),
		baseRange = baseRange > 6 ? baseRange : 6,
		leftTab = document.id('leftTab'),
		viewmoreLegend = document.id('viewmoreLegend'),
		args = {
			grid: {
				cols: Number.floor(projectContainerSize.x/size)-1,
				rows: Number.floor((projectContainerSize.y?projectContainerSize.y:bodySize.y)/size)
			},
			form: {
				size: size,
				range: [baseRange, baseRange*1.5]
			}, 
			getMore: function() {
				console.log('test');
			}
		};
		console.log(projectContainerSize);
	nav.addEvents({
		'mouseenter': function(){
			body.addClass('show-menu');
		},
		'mouseleave': function(){
			body.removeClass('show-menu');
		}
	});
	
	if (viewMore) {
		body.addEvent('mousemove', function(event){
			console.log(bodySize.y - event.client.y);
			if (bodySize.y - event.client.y < 40) {
				body.addClass('viewmore');
			}
		});
		viewMore.addEvent('mouseleave', function(){
			body.removeClass('viewmore');
		});
	}

	new Edk.Grid(global, args);
	
});
