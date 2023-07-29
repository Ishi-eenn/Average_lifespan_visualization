// import React, { useEffect, useState } from 'react';
// import Select from "react-select";
// import * as d3 from "d3";

// function DrawData({ XValue, YValue }) {
// 	const [data, setData] = useState([]);

// 	const url = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/2004014/iris.json";

// 	useEffect(() => {
// 		fetch(url)
// 			.then((response) => response.json())
// 			.then((response) => {
// 				setData(response);
// 			})
// 	}, []);

// 	const w = 800;
// 	const h = 600;
// 	const xaxis = 100;
// 	const yaxis = h - 100;
// 	const xProperty = XValue.value;
// 	const yProperty = YValue.value;

// 	const xScale = d3.scaleLinear()
// 		.domain(d3.extent(data, item => item[xProperty]))
// 		.range([100, w - 300])
// 		.nice();
// 	const yScale = d3.scaleLinear()
// 		.domain(d3.extent(data, item => item[yProperty]))
// 		.range([500, 100])
// 		.nice();

// 	const color = d3.scaleOrdinal(d3.schemeCategory10);
// 	for (const item of data) {
// 		color(item.species)
// 	}
// 	const setSpecies = new Set(data.map((data) => {
// 		return data.species;
// 	}));
// 	const [canotShow, setcanotShow] = useState([]);
// 	return (
// 		<svg width={w} height={h}>
// 			<line x1={xaxis} y1={yaxis} x2={w - 300} y2={yaxis} stroke="black" />
// 			<g>
// 				{
// 					xScale.ticks().map((data, index) => {
// 						return (
// 							<g transform={`translate(${xScale(data)}, 500)`} key={index} >
// 								<line x1="0" y1="0" x2="0" y2="5" stroke="black" />
// 								<text x="0" y="15" textAnchor='middle' dominantBaseline="central"  fontSize="12" >{data}</text>
// 							</g>
// 						);
// 					})
// 				}
// 			</g>
// 			<line x1={xaxis} y1={xaxis} x2={xaxis} y2={yaxis} stroke="black" />
// 			<g>
// 				{
// 					yScale.ticks().map((data, index) => {
// 						return (
// 							<g transform={`translate(100, ${yScale(data)})`} key={index} >
// 								<line x1="0" y1="0" x2="-5" y2="0" stroke="black" />
// 								<text x="-15" y="0" textAnchor="end" dominantBaseline="central"  fontSize="12" >{data}</text>
// 							</g>
// 						);
// 					})
// 				}
// 			</g>
// 			{
// 				// data.filter((item) => !canotShow.has(item.species)).map((data, index) =>
// 				data.filter((item) => !canotShow.includes(item.species)).map((data, index) => (
// 					<circle key={index} cx={xScale(data[xProperty])} cy={yScale(data[yProperty])} r="5" fill={color(data.species)} stroke={data.color} style={{ transition: "cx 2s, cy 2s" }} />
// 				))
// 			}
// 			<g transform="translate(450, -300)" >
// 				{
// 					Array.from(setSpecies).map((species, index) => (
// 						<g key={index} transform={`translate(${xaxis}, ${yaxis + index * 20})`}
// 							onClick={() => {
// 								if (canotShow.includes(item)) {
// 									const deleteSpecies = canotShow.filter(species => species !== item)
// 									setcanotShow(deleteSpecies);
// 								} else {
// 									// const newDeleteSpecies = Array.from(canotShow);
// 									// newDeleteSpecies[newDeleteSpecies.length] = item;
// 									// setcanotShow(newDeleteSpecies);
// 									setcanotShow([item].concat[canotShow]);
// 								}
// 							}} >
// 							<rect x="0" y="0" width="10" height="10" fill={color(species)} ></rect>
// 							<text x="15" y="5" dominantBaseline="middle" fontSize="16" >{species}</text>
// 						</g>
// 					))
// 				}
// 			</g>
// 			<g transform={`translate(${w / 2 - 100}, ${h - 50})`}>
// 				<text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="16" >{xProperty}</text>
// 			</g>
// 			<text x={300} y={(h - 550) / 2 + yaxis} textAnchor="middle" dominantBaseline="middle" fontSize="16" transform={`rotate(-90, 60, ${(h - yaxis) / 2 + yaxis})`} >
// 				{yProperty}
// 			</text>
// 		</svg>
// 	);
// };

// function App() {
// 	const options = [
// 		{ value: "sepalLength", label: "Sepal Length" },
// 		{ value: "sepalWidth", label: "Sepal Width" },
// 		{ value: "petalLength", label: "Petal Length" },
// 		{ value: "petalWidth", label: "Petal Width" },
// 	];
// 	const [selectedXValue, setSelectedXValue] = useState(options[0]);
// 	const [selectedYValue, setSelectedYValue] = useState(options[1]);
// 	return (
// 		<div style={{ width: "300px", margin: "50px" }} >
// 			<p>Horizontal Axis</p>
// 			<Select options={options} defaultValue={selectedXValue} onChange={(value) => {
// 				if (value) {
// 					setSelectedXValue(value);
// 				}
// 			}}
// 			/>
// 			<p>Vertical Axis</p>
// 			<Select options={options} defaultValue={selectedYValue} onChange={(value) => {
// 				if (value) {
// 					setSelectedYValue(value);
// 				}
// 			}}
// 			/>
// 			<DrawData XValue={selectedXValue} YValue={selectedYValue} />
// 		</div>
// 	);
// }

// export default App;

