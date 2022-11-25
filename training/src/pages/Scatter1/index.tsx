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
  const margin = { left: 30, right: 10, top: 10, bottom: 20 };
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
    let datas = data.map(function (d) {
      return d.group;
    });
    // 计算各个分组的个数

    // 设置x和y的比例尺

    let padding = { left: 0, top: 0, right: 0, bottom: 0 };
    // 设置x轴和y轴
    let g = svg
      .append('g')
      .attr(
        'transform',
        'translate(' + padding.left + ',' + padding.top + ')',
      );
    // 绘制直方图


  };

  useEffect(() => {
    drawScatter(s1Data);
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
