import React, { useEffect, useState } from 'react';
import Select from "react-select";
import * as d3 from "d3";
import data from './data.json'

function DrawData({ XValue, YValue, RValue, yearValue}) {
	const w = 1200;
	const h = 800;
	const xaxis = 100;
	const yaxis = h - 100;
	const xProperty = XValue.value;
	const yProperty = YValue.value;
	const rProperty = RValue.value;
	const [selectedCircleData, setSelectedCircleData] = useState(null);
	const [clickedCircleData, setClickedCircleData] = useState(null);

	const xScale = d3.scaleLinear()
		.domain(d3.extent(data, item => item[xProperty]))
		.range([100, w - 300])
		.nice();
	const yScale = d3.scaleLinear()
		.domain(d3.extent(data, item => item[yProperty]))
		.range([700, 100])
		.nice();
	const rScale = d3.scaleLinear()
		.domain(d3.extent(data, item => item[rProperty]))
		.range([5, 100])
		.nice();

	const color = d3.scaleOrdinal(d3.schemeCategory10);
	for (const item of data) {
		color(item.area)
	}
	const setArea = new Set(data.map((data) => {
		return data.area;
	}));

	return (
		<svg width={w} height={h}>
			<line x1={xaxis} y1={yaxis} x2={w - 300} y2={yaxis} stroke="black" />
			<g>
				{
					xScale.ticks().map((data, index) => {
						return (
							<g transform={`translate(${xScale(data)}, 700)`} key={index} >
								<line x1="0" y1="0" x2="0" y2="5" stroke="black" />
								<text x="0" y="15" textAnchor='middle' dominantBaseline="central"  fontSize="12" >{data}</text>
							</g>
						);
					})
				}
			</g>
			<line x1={xaxis} y1={xaxis} x2={xaxis} y2={yaxis} stroke="black" />
			<g>
				{
					yScale.ticks().map((data, index) => {
						return (
							<g transform={`translate(100, ${yScale(data)})`} key={index} >
								<line x1="0" y1="0" x2="-5" y2="0" stroke="black" />
								<text x="-15" y="0" textAnchor="end" dominantBaseline="central"  fontSize="12" >{data}</text>
							</g>
						);
					})
				}
			</g>
			{
				clickedCircleData && data.filter((item) => item.year !== yearValue && item.name === clickedCircleData.name).map((data, index) => (
					<circle key={index} cx={xScale(data[xProperty])} cy={yScale(data[yProperty])} r={rScale(data[rProperty])} fill="gray" stroke="Black" onClick={() => setClickedCircleData((prevData) => prevData === data ? null : data)}/>
					))
			}
			{
				data.filter((item) => item.year == yearValue).map((data, index) => (
					<circle key={index} cx={xScale(data[xProperty])} cy={yScale(data[yProperty])} r={rScale(data[rProperty])} fill={color(data.area)} stroke='Black' style={{ transition: "cx 2s, cy 2s" }} onMouseOver={() => setSelectedCircleData(data)} onMouseOut={() => setSelectedCircleData(null)} onClick={() => setClickedCircleData((prevData) => prevData === data ? null : data)}/>
				))
			}
			<g transform="translate(950, -500)" >
				{
					Array.from(setArea).map((area, index) => (
						<g key={index} transform={`translate(${xaxis}, ${yaxis + index * 20})`}>
							<rect x="0" y="0" width="10" height="10" fill={color(area)} ></rect>
							<text x="15" y="5" dominantBaseline="middle" fontSize="16" >{area}</text>
						</g>
					))
				}
			</g>
			<g transform={`translate(${w / 2 - 100}, ${h - 60})`}>
				<text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="16" >{xProperty}</text>
			</g>
			<text x={400} y={(h - 780) / 2 + yaxis} textAnchor="middle" dominantBaseline="middle" fontSize="16" transform={`rotate(-90, 60, ${(h - yaxis) / 2 + yaxis})`} >
				{yProperty}
			</text>
			{selectedCircleData && (
				<g transform="translate(1100, 500)">
					<rect x="-100" y="-20" width="200" height="150" fill="none" stroke="black" />
					<text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="16">Selected Circle Data:</text>
					<text x="0" y="25" textAnchor="middle" dominantBaseline="middle" fontSize="14">continent {selectedCircleData.area}</text>
					<text x="0" y="45" textAnchor="middle" dominantBaseline="middle" fontSize="14">country {selectedCircleData.name}</text>
					<text x="0" y="65" textAnchor="middle" dominantBaseline="middle" fontSize="14">{xProperty} {selectedCircleData[xProperty]}</text>
					<text x="0" y="85" textAnchor="middle" dominantBaseline="middle" fontSize="14">{yProperty} {selectedCircleData[yProperty]}</text>
					<text x="0" y="105" textAnchor="middle" dominantBaseline="middle" fontSize="14">{rProperty} {selectedCircleData[rProperty]}</text>
				</g>
			)}
		</svg>
	);
};

function App() {
	const options = [
		{ value: "人口", label: "人口" },
		{ value: "寿命", label: "寿命" },
		{ value: "医療費", label: "医療費" },
	];
	const [selectedXValue, setSelectedXValue] = useState(options[0]);
	const [selectedYValue, setSelectedYValue] = useState(options[1]);
	const [selectedRValue, setSelectedRValue] = useState(options[2]);
	const [isAutoPlay, setIsAutoPlay] = useState(true);
	const [checkYear, setCheckYear] = useState(1990);

	const handleAutoPlayToggle = () => {
		setIsAutoPlay(!isAutoPlay);
	};

	useEffect(() => {
		let intervalId;
		if(isAutoPlay){
			intervalId = setInterval(() => {
				const nextYear = parseInt(checkYear) + 1;
				if (nextYear <= 2020) {
					setCheckYear(nextYear);
				} else {
					setIsAutoPlay(false);
					clearInterval(intervalId);
				}
			}, 300);
		}
		return () => {
			clearInterval(intervalId);
		};
	}, [checkYear, isAutoPlay]);

	return (
		<div style={{ width: "300px", margin: "50px" }} >
			<p>Horizontal Axis</p>
			<Select options={options} defaultValue={selectedXValue} onChange={(value) => {
				if (value) {
					setSelectedXValue(value);
				}
			}}
			/>
			<p>Vertical Axis</p>
			<Select options={options} defaultValue={selectedYValue} onChange={(value) => {
				if (value) {
					setSelectedYValue(value);
				}
			}}
			/>
			<p>Circle Size</p>
			<Select options={options} defaultValue={selectedRValue} onChange={(value) => {
				if (value) {
					setSelectedRValue(value);
				}
			}}/>
			<p>Annual Variation</p>
			<button onClick={handleAutoPlayToggle}>{isAutoPlay ? "停止" : "再生"}</button>
			<label><input type="range" min="1990" max="2020" step="1" value={checkYear} onChange={(event) => setCheckYear(event.target.value)}/>{checkYear}年</label>
			<DrawData XValue={selectedXValue} YValue={selectedYValue} RValue={selectedRValue} yearValue={checkYear}/>
		</div>
	);
}

export default App;
