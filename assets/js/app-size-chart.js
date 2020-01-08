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
	
	d3.json("data.json").then(function (apps) {
        var categories = []
        for (let appName in apps) {
            if (!(categories.includes(apps[appName]["categorie"]))) {
                categories.push(apps[appName]["categorie"])
            }
        }
        console.log(categories)
		console.log(apps);
        includedCategories = categories
        d3.selectAll(".filter_button").on("change", function() {
            // I *think* "inline" is the default.
            var update = false
            
            if(d3.selectAll(`#${this.id}`).property("checked") && !categories.includes(this.id)) {
                categories.push(this.id)
                update = true
            }
            if(!d3.selectAll(`#${this.id}`).property("checked") && categories.includes(this.id)) {
                categories.splice( categories.indexOf(this.id), 1 )
                update = true
            }
            console.log(categories) 
            if(update) {
                console.log(4242)
                defs.selectAll("pattern").remove()
                svg.selectAll("rect").remove()
                createMap(apps)
                apps_to_draw = []
                drawSizeEvolutionChart(apps, apps_to_draw)
            }
            });
        console.log("coucou")
		console.log(apps);
		function createMap(apps) {
            let appSize = width/4;
            iter = 0;
            for (let appName in apps) {
                let appObject = apps[appName];
                if(!includedCategories.includes(appObject["categorie"])) {
                    continue
                }
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
                        tooltip.html(`${appName}<br/>${appObject["versions"][appObject["versions"].length-1]["date"]}: ${appObject["versions"][appObject["versions"].length-1]["size"]}`)
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
                                .style("stroke", "red")
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
                        console.log(apps_to_draw)

                        drawSizeEvolutionChart(apps, apps_to_draw)
                    });
                iter++;
            }
            }
        createMap(apps)
        drawSizeEvolutionChart(apps, []);
		drawAppSizeComparison(apps);
	});
});
