let svg = null;
let xScale = null;
let yScale = null;


function drawSizeEvolutionChart(apps) {
	let sizeEvolutionChart = d3.select("#size-evolution-chart-placeholder");
	svg = d3.select("#size-evolution-chart-placeholder")
		.append("svg")
		.attr("width", "100%")
		.attr("height", "800px")
		.append("g");
	
	svg.selectAll("*").remove();
	
	let jsizeEvolutionChart = $("#size-evolution-chart-placeholder");
	let width = jsizeEvolutionChart.width();
	let height = jsizeEvolutionChart.height();
	let defaultTransition = "easeQuad";
	let defaultTransitionDuration = 200;
	
	// Create scales
	xScale = d3.scaleLinear().range([50, width - 50]).domain([
		d3.min(Object.values(apps), app => d3.min(app["versions"], a => moment(a[0], "DD-MM-YYYY").unix())),
		d3.max(Object.values(apps), app => d3.max(app["versions"], a => moment(a[0], "DD-MM-YYYY").unix()))]);
	yScale = d3.scaleLinear().range([10, height - 100]).domain([d3.max(Object.values(apps), app => d3.max(app["versions"], a => a[1])), 0]);
	
	let defs = svg.append("defs");
	
	// Define the div for the tooltip
	var tooltip = d3.select("body").append("div")
		.attr("class", "tooltip")
		.style("opacity", 0);
	
	svg.append("g")
		.call(d3.axisLeft(yScale))
		.attr("transform", "translate(50, 0)");
	
	svg.append("g")
		.call(d3.axisBottom(xScale)
			.tickFormat(d => moment(new Date(d)).format("DD/MM/YYYY")))
		.attr("transform", `translate(0, ${height - 100})`)
		.selectAll("text")
		.attr("transform", "translate(20, 20) rotate(45)");

}
function draw_lines(apps, apps_to_draw) {
	for (let appName in apps) {
		if(apps_to_draw.indexOf(appName) == -1)
			continue;
		let versions = apps[appName]["versions"];
		// Sort versions
		versions.sort(function (a, b) {
			return moment(a[0], "DD-MM-YYYY").unix() - moment(b[0], "DD-MM-YYYY").unix();
		});

		svg.append("path")
			.datum(versions)
			.attr("fill", "none")
			.attr("stroke", "steelblue")
			.attr("stroke-width", 1.5)
			.attr("d", d3.line()
				.x(function (d) {
					return xScale(moment(d[0], "DD-MM-YYYY").unix())
				})
				.y(function (d) {
					return yScale(d[1])
				})
			)
	}
}
