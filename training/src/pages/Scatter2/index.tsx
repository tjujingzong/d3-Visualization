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
  const drawScatter = (data: any[]) => {
    const width = svgRef.current?.clientWidth!;
    const height = svgRef.current?.clientHeight!;
    const clipWidth = width - margin.left - margin.right;
    const clipheight = height - margin.top - margin.bottom;
    // 创建一个仿真器simulation
    
    // 添加边

    // 添加点

    simulation.on('tick', ticked);
    // 为仿真器添加ticked函数
    function ticked() {



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
    drawScatter(data);
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
