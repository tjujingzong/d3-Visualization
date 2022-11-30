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
  // const svg = d3.select(svgRef.current).select('.main');写在外面刷新页面就消失
  const drawScatter = (nodes: any[], links: any[]) => {
    const svg = d3.select(svgRef.current).select('.main');
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
      .force('center', d3.forceCenter(width / 2, height / 2));
    // 添加边
    const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(d.value));

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
        if (selection) {
          const [[x0, y0], [x1, y1]] = selection;
          const selectedNodes = nodes.filter(
            d => x0 <= d.x && d.x <= x1 && y0 <= d.y && d.y <= y1,
          );
          //筛选矩形框内的边
          const selectedLinks = links.filter(
            d =>
              selectedNodes.includes(d.source) && selectedNodes.includes(d.target),
          );

          //矩形框内的结点设置为红色
          node
            .attr('fill', d =>
              selectedNodes.includes(d) ? 'red' : '#fff',
            )
            .attr('stroke', d =>
              selectedNodes.includes(d) ? 'red' : '#000',
            );
          //传出矩形框内的点和边
          // console.log(selectedNodes, selectedLinks);
          setS1Data({ nodes: selectedNodes, links: selectedLinks });
        }
        else {
          setS1Data(data);
          //全部结点恢复为白色
          node
            .attr('fill', '#fff')
            .attr('stroke', '#000');
        }
      });
    // 为svg添加选择框
    svg.call(brush as any);
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
