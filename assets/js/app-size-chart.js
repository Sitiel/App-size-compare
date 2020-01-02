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
	
	// Define the div for the tooltip
	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);
	
	d3.json("data_social_network.json").then(function (apps) {
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
				.attr("xlink:href", appObject["icon"])
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
					tooltip.html(`${appName}<br/>${appObject["versions"][appObject["versions"].length-1]["date"]}: ${appObject["versions"][appObject["versions"].length-1]["size"]}`)
						.style("left", d3.event.pageX + "px")
						.style("top", d3.event.pageY + "px")
				})
				.on("mouseout", function(_) {
					tooltip
						.transition(defaultTransition)
						.duration(defaultTransitionDuration)
						.style("opacity", 0);
				});
			iter++;
		}
		drawSizeEvolutionChart(apps);
	});
});
