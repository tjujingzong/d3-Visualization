import React, { useEffect, useRef } from 'react';
import { useModel } from 'umi';
import * as d3 from 'd3';
import './index.less'
const Scatter1: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { data } = useModel('test');
  const margin = { left: 30, right: 10, bottom: 30, top: 10 };
  const drawScatter = (data: any[]) => {
    const width = svgRef.current?.clientWidth;
    const height = svgRef.current?.clientHeight;
    const clipwidth = width! - margin.left - margin.right;
    const clipheight = height! - margin.top - margin.bottom;
    const svg = d3.select(svgRef.current).select('.main');
    console.log(data)
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.Miles_per_Gallon) as [any, any])
      .nice()
      .range([0, clipwidth]);
    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.Horsepower) as [any, any])
      .nice()
      .range([clipheight, 0]);
    const xAxis = svg
      .select('.x_axis')
      .attr('transform', `translate(0,${clipheight})`)
      .transition()
      .call(d3.axisBottom(xScale) as any);
    const yAxis = svg
      .select('.y_axis')
      .transition()
      .call(d3.axisLeft(yScale) as any);
    const dot = svg
      .select('.s1dot')
      .selectAll('circle')
      .data(data)
      .join('circle')
      .transition()
      .attr('class', 's1')
      .attr('transform',(d:any)=>`translate(${xScale(d.Miles_per_Gallon)||0},${yScale(d.Horsepower)||0})`)
      .attr('r',3);
  };
  useEffect(() => {
    drawScatter(data)
  }, [data])
  
  return (
    <svg ref={svgRef} style={{ width: '50vw', height: '100vh' }}>
      <g className="main" transform={`translate(${margin.left},${margin.top})`}>
        <g className="x_axis"></g>
        <g className="y_axis"></g>
        <g
          className="s1dot"
          fill="none"
          stroke="steelblue"
          strokeWidth={1.5}
        ></g>
      </g>
    </svg>
  );
};

export default Scatter1;
