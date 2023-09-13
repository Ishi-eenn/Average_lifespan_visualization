import React, { useEffect, useState } from 'react';
import * as d3 from "d3";
import data from './data.json'
import "./App.css"
import { Button, Slider, Typography, Toolbar } from "@mui/material";

function valuetext(value) {
	return `${value}年`;
  }

function DrawData({ DataArray, yearValue}) {
	const w = 1200;
	const h = 700;
	const xaxis = 100;
	const yaxis = h - 150;
	const xProperty = DataArray[0];
	const yProperty = DataArray[1];
	const rProperty = DataArray[2];
	const [selectedCircleData, setSelectedCircleData] = useState(null);
	const [clickedCircleData, setClickedCircleData] = useState(null);

	const xScale = d3.scaleLinear()
		.domain(d3.extent(data, item => item[xProperty]))
		.range([100, w - 400])
		.nice();
	const yScale = d3.scaleLinear()
		.domain(d3.extent(data, item => item[yProperty]))
		.range([550, 50])
		.nice();
	const rScale = d3.scaleLinear()
		.domain(d3.extent(data, item => item[rProperty]))
		.range([5, 100])
		.nice();
	const color = d3.scaleOrdinal(d3.schemeCategory10);
		for (const item of data) {
			color(item.area)
		}
	const colorScale = d3.scaleLinear()
		.domain(d3.extent(data, item => item["year"]))
		.range(["#eeeeee", clickedCircleData ? color(clickedCircleData.area) : "Black"]);

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
							<g transform={`translate(${xScale(data)}, 550)`} style={{userSelect: "none"}} key={index} >
								<line x1="0" y1="0" x2="0" y2="5" stroke="black" />
								<text x="0" y="15" textAnchor='middle' dominantBaseline="central"  fontSize="12" >{data}</text>
							</g>
						);
					})
				}
			</g>
			<line x1={xaxis} y1={xaxis - 55} x2={xaxis} y2={yaxis} stroke="black" />
			<g>
				{
					yScale.ticks().map((data, index) => {
						return (
							<g transform={`translate(100, ${yScale(data)})`} style={{userSelect: "none"}} key={index} >
								<line x1="0" y1="0" x2="-5" y2="0" stroke="black" />
								<text x="-15" y="0" textAnchor="end" dominantBaseline="central"  fontSize="12" >{data}</text>
							</g>
						);
					})
				}
			</g>
			{
				clickedCircleData && data.filter((item) => item.year !== yearValue && item.name === clickedCircleData.name).map((data, index) => (
					<circle key={index} cx={xScale(data[xProperty])} cy={yScale(data[yProperty])} r={rScale(data[rProperty])} fill={colorScale(data["year"])} stroke="null" onClick={() => setClickedCircleData((prevData) => prevData === data ? null : data)}/>
					))
			}
			{
				data.filter((item) => item.year == yearValue).map((data, index) => (
					<circle key={index} cx={xScale(data[xProperty])} cy={yScale(data[yProperty])} r={rScale(data[rProperty])} fill={color(data.area)} stroke="null" style={{ transition: "cx 2s, cy 2s", cursor:"pointer"}} onMouseOver={() => setSelectedCircleData(data)} onMouseOut={() => setSelectedCircleData(null)} onClick={() => setClickedCircleData((prevData) => prevData === data ? null : data)}/>
				))
			}
			<g transform="translate(950, -500)" >
				{
					Array.from(setArea).map((area, index) => (
						<g key={index} style={{userSelect: "none"}} transform={`translate(${xaxis}, ${530 + index * 20})`}>
							<rect x="0" y="0" width="10" height="10" fill={color(area)} ></rect>
							<text x="15" y="5" dominantBaseline="middle" fontSize="16" >{area}</text>
						</g>
					))
				}
			</g>
			<g transform={`translate(${w / 2 - 100}, ${h - 100})`} style={{userSelect: "none"}}>
				<text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="16" >{xProperty}</text>
			</g>
			<text x={385} y={(h - 580) / 2 + yaxis} style={{userSelect: "none"}} textAnchor="middle" dominantBaseline="middle" fontSize="16" transform={`rotate(-90, 60, ${(h - yaxis) / 2 + yaxis})`} >
				{yProperty}
			</text>
			{selectedCircleData && (
				<g transform="translate(1100, 180)">
					<rect x="-100" y="-20" width="200" height="150" fill="none" stroke="black" />
					<text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fontSize="16">選択したサークル:</text>
					<text x="0" y="25" textAnchor="middle" dominantBaseline="middle" fontSize="14">大陸 {selectedCircleData.area}</text>
					<text x="0" y="45" textAnchor="middle" dominantBaseline="middle" fontSize="14">国 {selectedCircleData.name}</text>
					<text x="0" y="65" textAnchor="middle" dominantBaseline="middle" fontSize="14">{xProperty} {selectedCircleData[xProperty]}</text>
					<text x="0" y="85" textAnchor="middle" dominantBaseline="middle" fontSize="14">{yProperty} {selectedCircleData[yProperty]}</text>
					<text x="0" y="105" textAnchor="middle" dominantBaseline="middle" fontSize="14">{rProperty} {selectedCircleData[rProperty]}</text>
				</g>
			)}
		</svg>
	);
};

function App() {
	const [isAutoPlay, setIsAutoPlay] = useState(true);
	const [checkYear, setCheckYear] = useState(1990);
	const [dragged, setDragged] = useState(null);
	const [array, setArray] = useState(["人口", "寿命", "医療費"]);

	const handleAutoPlayToggle = () => {
		if(checkYear == 2020)
			setCheckYear(1990);
		setIsAutoPlay(!isAutoPlay);
	};

	const swap = (item1, item2) => {
		const buf = array[item1]
		array[item1] = array[item2];
		array[item2] = buf;
		setArray([...array]);
	}

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
		<div>
			<div className="header">
				<h1>平均寿命と医療費の関係性</h1>
			</div>
			<div className="contents" style={{width: "10%", display: "inline-block", margin: "0px"}}>
				<DrawData DataArray={array} yearValue={checkYear}/>
				<div style={{transform: "translate(1050px, -380px)", userSelect: "none"}} >
					<p style={{display: "inline-block", margin: "0px"}}>  x座標 : </p>
					<p style={{transform: "translate(-50px, 40px)"}}>  y座標 : </p>
					<p style={{transform: "translate(-21px, 55px)"}}>サークル : </p>
				</div>
				{
					array.map((element, index) => {
						return (
							<p style={{ transform: `translate(${1150 - index * 31}px, ${-428 + index * 40}px)`, cursor:"pointer"}} key={element} onDragStart={(event) => {
								setDragged(event.target.textContent);
							}} onDrop={(event) => {
								event.preventDefault();
								swap(array.indexOf(event.target.textContent), array.indexOf(dragged));
							}} onDragOver={(event) => {
								event.preventDefault();
							}}
							draggable="true" >{element}</p>
				)})}
				<div style={{ transform: "translate(980px, -320px)"}} >
					<Slider aria-label="Temperature"
							style={{ width: "300px", height: "2px" }}
							defaultValue={1990}
							getAriaValueText={valuetext}
							valueLabelDisplay="auto"
							step={1}
							marks
							min={1990}
							max={2020}
							value={checkYear} onChange={(event) => setCheckYear(event.target.value)}
					/>
					<p style={{transform: "translate(60px, 0px)"}}>{checkYear}年</p>
					<div style={{transform: "translate(150px, -30px)"}}>
						<Button variant="contained" onClick={handleAutoPlayToggle} >{isAutoPlay ? "停止" : "再生"}</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
