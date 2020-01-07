function drawAppSizeComparison(apps) {
	console.log(apps);
	
	let data = [];
	
	for (let appName in apps) {
		let versions = apps[appName]["versions"];
		// Sort versions
		versions.sort(function(a, b) {
			return moment(a[0], "DD-MM-YYYY").unix() - moment(b[0], "DD-MM-YYYY").unix();
		});
		
		data.push({
			axis: appName,
			value: parseFloat(versions[versions.length - 1][1]),
		});
	}
	
	// Sort data array
	data.sort((a, b) => a["value"] - b["value"]);
	
	data = [data];
	console.log(data);
	
	RadarChart.draw("#app-size-comparison-placeholder", data, {
		w: 400,
		h: 400,
	});
}
