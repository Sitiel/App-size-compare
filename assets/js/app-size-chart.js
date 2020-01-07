$(document).ready(function() {
	let appSizeChartPlaceholder = d3.select("#app-size-chart-placeholder");
	let svg = d3.select("#app-size-chart-placeholder")
		.append("svg")
		.attr("width", "100%")
		.attr("height", "100%")
		.append("g");
	
	let jappSizeChartPlaceholder = $("#app-size-chart-placeholder");
	let width = jappSizeChartPlaceholder.width();
	let height = jappSizeChartPlaceholder.height();
	let leftMargin = 5;
	let rightMargin = 5;
	let topMargin = 5;
	let bottomMargin = 5;
	let defaultTransition = "easeQuad";
	let defaultTransitionDuration = 200;
	
	let defs = svg.append("defs");
	let apps_to_draw = []
	
	// Define the div for the tooltip
	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);
	
	d3.json("data_social_network.json").then(function (apps) {
        let Color = d3.scaleOrdinal()
        .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928","#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"])
        .domain(Object.keys(apps));


		console.log(apps);
		let appSize = width/4;
		iter = 0;
		for (let appName in apps) {
			let appObject = apps[appName];
			let appId = appName.replace(' ', '-');
			defs.append("pattern")
				.attr("id", appId)
				.attr("width", 1)
				.attr("height", 1)
				.attr("patternUnits", "objectBoundingBox")
				.append("image")
				.attr("xlink:href", appObject['icon'])
				.attr("width", appSize - (leftMargin + rightMargin))
				.attr("height", appSize - (topMargin + bottomMargin));
			
			svg.append("rect")
				.attr("width", appSize - (leftMargin + rightMargin))
				.attr("height", appSize - (topMargin + bottomMargin))
				.attr("x", (iter % 4) * appSize + leftMargin)
				.attr("y", (Math.floor(iter / 4)) * appSize + bottomMargin)
				.style("fill", `url(#${appId})`)
				.on("mouseover", function(_) {
					tooltip
						.transition(defaultTransition)
						.duration(defaultTransitionDuration)
						.style("opacity", .9);
					tooltip.html(`${appName}<br/>${appObject["versions"][appObject["versions"].length-1][0]}: ${appObject["versions"][appObject["versions"].length-1][1]}`)
						.style("left", d3.event.pageX + "px")
						.style("top", d3.event.pageY + "px")
				})
				.on("mouseout", function(_) {
					tooltip
						.transition(defaultTransition)
						.duration(defaultTransitionDuration)
						.style("opacity", 0);
				})
				.on("click", function(){
					console.log("This : ", this);
					let index = apps_to_draw.indexOf(appName);
					if(index === -1){
						d3.select(this)
							.attr("stroke-width", "0")
							.transition()
							.duration(300)
							.style("stroke", Color(appName))
							.attr("stroke-width", "5");

						apps_to_draw.push(appName);
					}
					else{
						d3.select(this)
							.transition()
							.duration(300)
							.attr("stroke-width", "0");
						apps_to_draw.splice(index, 1);
					}

					drawSizeEvolutionChart(apps, apps_to_draw)
				});
			iter++;
		}
		drawSizeEvolutionChart(apps, []);
		drawAppSizeComparison(apps);
	});
});
