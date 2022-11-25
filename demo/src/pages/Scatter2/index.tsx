import React, { useEffect, useRef } from 'react';
import { useModel } from 'umi';
import * as d3 from 'd3';
import './index.less';
import sData from '../../../public/data/data.json';
const Scatter2: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { setData } = useModel('test');
  const margin = { left: 30, right: 10, bottom: 30, top: 10 };
  const drawScatter = (data: any[]) => {
    const width = svgRef.current?.clientWidth;
    const height = svgRef.current?.clientHeight;
    const clipwidth = width! - margin.left - margin.right;
    const clipheight = height! - margin.top - margin.bottom;
    const svg = d3.select(svgRef.current).select('.main');
    const brush = d3
      .brush()
      .extent([
        [0, 0],
        [clipwidth, clipheight],
      ])
      .on('end', ({ selection }) => {
        if (selection) {
          const [[x0, y0], [x1, y1]] = selection;
          const value = d3
            .selectAll('.s2')
            .style('stroke', 'gray')
            .filter((d: any) => {
              return (
                x0 <= xScale(d.Miles_per_Gallon) &&
                x1 >= xScale(d.Miles_per_Gallon) &&
                y0 <= yScale(d.Horsepower) &&
                y1 >= yScale(d.Horsepower)
              );
            })
            .style('stroke', 'steelblue')
            .data();
          setData(value as any);
        } else {
          setData(sData);
          d3.selectAll('.s2').style('stroke', 'steelblue');
        }
      });
    svg.call(brush as any);

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
      .select('.s2dot')
      .selectAll('circle')
      .data(data)
      .join('circle')
      .transition()
      .attr('class', 's2')
      .attr(
        'transform',
        (d: any) =>
          `translate(${xScale(d.Miles_per_Gallon) || 0},${
            yScale(d.Horsepower) || 0
          })`,
      )
      .attr('r', 3);
  };
  useEffect(() => {
    drawScatter(sData);
  }, []);

  return (
    <svg ref={svgRef} style={{ width: '50vw', height: '100vh' }}>
      <g className="main" transform={`translate(${margin.left},${margin.top})`}>
        <g className="x_axis"></g>
        <g className="y_axis"></g>
        <g
          className="s2dot"
          fill="none"
          stroke="steelblue"
          strokeWidth={1.5}
        ></g>
      </g>
    </svg>
  );
};

export default Scatter2;
