import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
// import data from '../../../public/data/data.csv';
import data from '../../../public/data/miserables.json';
import * as d3 from 'd3';
import { useModel } from 'umi';
import './index.less';

const Scatter1: React.FC = () => {
  const { s1Data } = useModel('test');
  const svgRef = useRef<SVGSVGElement>(null);
  const margin = { left: 30, right: 150, top: 10, bottom: 100 };
  // 每次要清空svg 不然多次框选会重叠
  const clearSvg = () => {
    d3.select(svgRef.current)
      .selectAll('g')
      .remove();
  };//
  const drawScatter = (data: any[]) => {
    const width = svgRef.current?.clientWidth!;
    const height = svgRef.current?.clientHeight!;
    const clipWidth = width - margin.left - margin.right;
    const clipheight = height - margin.top - margin.bottom;
    const svg = d3.select(svgRef.current).select('.main');
    // 清空svg
    svg.selectAll('g').remove();

    let datas = data.map(function (d) {
      return d.group;
    });
    // 计算各个分组的个数 
    // 计算datas中不同group的个数 ts
    const groupCount = datas.reduce((obj: any, item: any) => {
      obj[item] = (obj[item] || 0) + 1;
      return obj;
    }, {});
    console.log(d3.max(Object.keys(groupCount as any)));
    console.log(groupCount);
    //groupCount是一个对象，key是group的值，value是group的个数
    //获得key的最大值,定义为整数
    const maxGroup = parseInt(d3.max(Object.keys(groupCount as any)) as string) + 1;
    console.log(maxGroup);
    // 设置x和y的比例尺 ts
    // x为group y为count
    const xScale = d3
      .scaleLinear()
      .domain([-1, maxGroup] as any)
      .range([0, clipWidth]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(Object.values(groupCount as any))] as any)
      .range([clipheight, 0]);

    let padding = { left: 0, top: 0, right: 0, bottom: 0 };
    // 设置x轴和y轴
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    // 添加x轴
    svg
      .append('g')
      .attr('class', 'xAxis')
      .attr('transform', `translate(${margin.left},${margin.top + clipheight})`)
      .call(xAxis);
    // 添加y轴
    svg
      .append('g')
      .attr('class', 'yAxis')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(yAxis);

    let g = svg
      .append('g')
      .attr(
        'transform',
        'translate(' + padding.left + ',' + padding.top + ')',
      );
    // 根据x轴和y轴 绘制直方图
    g.selectAll('rect')
      .data(Object.keys(groupCount as any))
      .enter()
      .append('rect')
      .attr('x', function (d, i) {
        return xScale(i) - (xScale(i + 1) - xScale(i)) / 2 + margin.left;
      })
      .attr('y', function (d) {
        return yScale(groupCount[d]) + margin.top;
      })
      .transition()
      .duration(1000)
      .attr('width', xScale(1) - xScale(0) - 1)
      .attr('height', function (d) {
        return clipheight - yScale(groupCount[d]);
      })
      .delay(function (d: any, i: any) {
        return i * 100;
      })
      .attr('fill', 'steelblue');
  };

  useEffect(() => {
    drawScatter(s1Data.nodes);
  }, [s1Data]);

  return (
    <svg
      ref={svgRef}
      style={{
        width: '50vw',
        height: '100vh',
      }}
    >
      <g
        className="force"
        transform={`translate(${margin.left + 200}, ${margin.top + 300
          })`}
      ></g>
      <g
        className="main"
        transform={`translate(${margin.left}, ${margin.top})`}
      >

      </g>
    </svg>
  );
};

export default Scatter1;
