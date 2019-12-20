function drawSizeEvolutionChart(apps) {
	let sizeEvolutionChart = d3.select("#size-evolution-chart-placeholder");
	let svg = d3.select("#size-evolution-chart-placeholder")
		.append("svg")
		.attr("width", "100%")
		.attr("height", "400px")
		.append("g");
	
	svg.selectAll("*").remove();
	
	let jsizeEvolutionChart = $("#size-evolution-chart-placeholder");
	let width = jsizeEvolutionChart.width();
	let height = jsizeEvolutionChart.height();
	let defaultTransition = "easeQuad";
	let defaultTransitionDuration = 200;
	
	// Create scales
	let xScale = d3.scaleLinear().range([50, width - 50]).domain([
		d3.min(Object.values(apps), app => d3.min(app["versions"], a => new Date(a["date"]).getTime())),
		d3.max(Object.values(apps), app => d3.max(app["versions"], a => new Date(a["date"]).getTime()))]);
	let yScale = d3.scaleLinear().range([10, height - 100]).domain([d3.max(Object.values(apps), app => d3.max(app["versions"], a => a["size"])), 0]);
	
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
