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
	
	var os = "android"
	
	// Define the div for the tooltip
	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);
	
	d3.json("data.json").then(function (apps) {
        var Color = d3.scaleOrdinal()
        .range(["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928","#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02","#a6761d","#666666"])
        .domain(Object.keys(apps));


        var categories = []
        for (let appName in apps) {
            if (!(categories.includes(apps[appName]["categorie"]))) {
                categories.push(apps[appName]["categorie"])
            }
        }
        
        const getAppId = function(appName) {
        	return appName.replace(/ /g, '-');
        };
        
        const onAppClicked = function(appName, force_select = false, force_deselect = false, commit = true) {
        	if (force_select && force_deselect)
        		throw new EvalError("force_select and force_deselect cannot be true at the same time.");
	        let index = apps_to_draw.indexOf(appName);
	        if(force_select || (index === -1 && !force_deselect)) {
	        	console.log("d3.select('#' + getAppId(appName) + \"-app\"):", d3.select('#' + getAppId(appName) + "-app"));
		        d3.select('#' + getAppId(appName) + "-app")
			        .attr("stroke-width", "0")
			        .transition()
			        .duration(300)
			        .style("stroke", Color(appName))
			        .attr("stroke-width", "5");
		
		        if (!apps_to_draw.includes(appName))
		            apps_to_draw.push(appName);
	        }
	        else{
		        d3.select('#' + getAppId(appName) + "-app")
			        .transition()
			        .duration(300)
			        .attr("stroke-width", "0");
		        
		        if (index !== -1)
			        apps_to_draw.splice(index, 1);
	        }
			
	        if (commit)
		        drawSizeEvolutionChart(apps, apps_to_draw)
        };
        const deselectAllApps = function(commit = true) {
	        apps_to_draw = [];
	        if (commit)
		        drawSizeEvolutionChart(apps, apps_to_draw)
        };
        
        includedCategories = categories;
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
            if(update) {
                defs.selectAll("pattern").remove()
                svg.selectAll("rect").remove()
                createMap(apps)
                apps_to_draw = []
                drawSizeEvolutionChart(apps, apps_to_draw)
            }
            });
        
        d3.selectAll(".select_os").on("change", function() {
            os = this.value
            defs.selectAll("pattern").remove()
            svg.selectAll("rect").remove()
            createMap(apps)
            apps_to_draw = []
            drawSizeEvolutionChart(apps, apps_to_draw)
        });
        
        d3.selectAll(".select-all").on('click', function() {
        	for (let appName in apps)
		        onAppClicked(getAppId(appName), true, undefined, false);
	        drawSizeEvolutionChart(apps, apps_to_draw)
        });
		d3.selectAll(".deselect-all").on('click', function() {
			for (let appName in apps)
				onAppClicked(getAppId(appName), undefined, true, false);
			deselectAllApps();
		});

		function createMap(apps) {

            let appScale = d3.scaleLinear().range([10, (width/7)*(os=="android") + (width/6)*(os=="ios")])
                .domain([0,Math.sqrt(d3.max(Object.values(apps), function(app){
                    if(app["os"]!=os){return 0;}else{return app["versions"][app["versions"].length - 1]["size"];}}))]);
            iter = 0;
			lastX = 0;
			lastY = 0;
            maxYOfLine = 0;
            for (let appName in apps) {
                let appObject = apps[appName];
                if(!includedCategories.includes(appObject["categorie"]) || appObject["os"]!=os) {
                    continue
                }
                let appId = getAppId(appName);
                let versions = appObject.versions;
	            versions.sort(function (a, b) {
	                return moment(a["date"], "DD-MM-YYYY").unix() - moment(b["date"], "DD-MM-YYYY").unix();
                });
	            let size = versions[versions.length - 1]["size"];
	            let appSize = appScale(Math.sqrt(size));
                defs.append("pattern")
                    .attr("id", appId)
                    .attr("width", 1)
                    .attr("height", 1)
                    .attr("patternUnits", "objectBoundingBox")
                    .append("image")
                    .attr("xlink:href", appObject['icon'])
                    .attr("width", appSize - (leftMargin + rightMargin))
                    .attr("height", appSize - (topMargin + bottomMargin));

                if(lastX + appSize > width){
                    lastX = 0;
                    lastY += maxYOfLine;
                    maxYOfLine = appSize;
                }
                if(appSize > maxYOfLine){
                    maxYOfLine = appSize;
                }


                svg.append("rect")
	                .attr("id", appId + "-app")
                    .attr("width", appSize - (leftMargin + rightMargin))
                    .attr("height", appSize - (topMargin + bottomMargin))
                     .attr("x", lastX + leftMargin)
                     .attr("y", lastY + bottomMargin)
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
                        onAppClicked(appName);
                    });
                lastX += appSize;
                iter++;
            }
        }
        
        drawSizeEvolutionChart(apps, []);
		d3.json("data_ios_music.json").then(function (ios_music_apps) {
			d3.json("data_ios_social_network.json").then(function (ios_social_network_apps) {
				d3.json("data_ios_video.json").then(function (data_ios_video) {
					drawAppSizeComparison(apps, {...ios_music_apps, ...ios_social_network_apps, ...data_ios_video});
createMap(apps);
				});
			});
		});
	});
});
