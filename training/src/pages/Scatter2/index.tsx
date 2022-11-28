import React, { useEffect, useRef } from 'react';
// import data from '../../../public/data/data.csv';
import * as d3 from 'd3';
import { useModel } from 'umi';
import './index.less';
import data from '../../../public/data/miserables.json';
const Scatter2: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { setS1Data } = useModel('test');
  const margin = { left: 30, right: 10, top: 10, bottom: 20 };
  const svg = d3.select(svgRef.current).select('.main');
  const drawScatter = (nodes: any[], links: any[]) => {
    const width = svgRef.current?.clientWidth!;
    const height = svgRef.current?.clientHeight!;
    const clipWidth = width - margin.left - margin.right;
    const clipheight = height - margin.top - margin.bottom;
    // 创建一个仿真器simulation
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3.forceLink(links).id((d: any) => d.id),
      )
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(clipWidth / 2, clipheight / 2));
    // 添加边
    const link = svg
      .selectAll('.link')
      .data(links)
      .join('line')
      .attr('class', 'link')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', (d: any) => Math.sqrt(d.value));
    // 添加点
    const dragstarted = (event: any, d: any) => {
      event.sourceEvent.stopPropagation();
      if (!event.active) {
        simulation.alphaTarget(0.3).restart();
      }
      d.fx = d.x;
      d.fy = d.y;
    };
    const dragged = (event: any, d: any) => {
      d.fx = event.x;
      d.fy = event.y;
      d.fixed = true;
    };
    const dragended = (event: any, d: any) => {
      if (!event.active) {
        simulation.alphaTarget(0);
      }
      d.fx = null;
      d.fy = null;
    };
    const node = svg.append('g').attr("class", "nodegroup")
      .selectAll('.node')
      .data(nodes)
      .join('circle')
      .attr('class', 'node')
      .attr('r', 5)
      .attr('fill', '#fff')
      .attr('stroke', '#000')
      .attr('stroke-width', 1.5)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);
    
    simulation.on('tick', ticked);
    // 为仿真器添加ticked函数
    function ticked() {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
      node
        .attr('transform', (d: { x: any; y: any; }) => `translate(${d.x},${d.y})`)
    }
    // 定义矩形选择框
    const brush = d3
      .brush()
      .extent([
        [0, 0],
        [clipWidth, clipheight],
      ])
      // 补全矩形选择框执行结束要执行的函数 这里注意怎样传出数据
      .on('end', ({ selection }) => {




      });
    // 为svg添加选择框

  };

  useEffect(() => {
    drawScatter(data.nodes, data.links);
  }, []);

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
      ></g>
    </svg>
  );
};

export default Scatter2;
