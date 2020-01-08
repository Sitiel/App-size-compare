function drawAppSizeComparison(android_apps, ios_apps) {
	let android_data = [];
	let ios_data = [];
	
	const convert_apps_to_data = function(apps) {
		let data = [];
		for (let appName in apps) {
			let versions = apps[appName]["versions"];
			if (versions != null && versions.length > 0) {
				// Sort versions
				versions.sort(function (a, b) {
					return moment(a["date"], "DD-MM-YYYY").unix() - moment(b["date"], "DD-MM-YYYY").unix();
				});
				
				data.push({
					axis: appName,
					value: parseFloat(versions[versions.length - 1]["size"]),
				});
			}
		}
		return data;
	};
	
	android_data = convert_apps_to_data(android_apps);
	ios_data = convert_apps_to_data(ios_apps);
	
	// Check if there are app that are present only in android or ios, and delete them
	android_data = android_data.filter(datum => ios_data.map(ios => ios.axis).includes(datum.axis));
	ios_data = ios_data.filter(datum => android_data.map(android => android.axis).includes(datum.axis));
	
	// Sort data arrays
	// android_data.sort((a, b) => a["value"] - b["value"]);
	// ios_data.sort((a, b) => a["value"] - b["value"]);
	
	RadarChart.draw("#app-size-comparison-placeholder", [android_data, ios_data], {
		w: 400,
		h: 400,
		legends: ["Android", "iOS"]
	});
}
