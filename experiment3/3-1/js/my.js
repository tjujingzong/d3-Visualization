const height = 600;
const width = 800;
const num2category = ['HTMLElement', 'WebGL', 'SVG', "CSS", "Other"];
const svg = d3.select('#my_svg')
  .attr('width', width)
  .attr('height', height);

// 添加一个背景矩形以显示svg覆盖的范围
svg.append('rect')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'none')
  .attr('stroke', 'grey');

const graph_g = svg.append('g')
  .attr('id', 'graph_g');

const colors = d3.schemeCategory10;

d3.json("./data.json")
  .then(function (graph) {
    const nodes = graph.nodes;
    const links = graph.links;
    console.log(nodes);
    console.log(links);
    const link = graph_g.append("g")
      .attr('id', 'links_g')
      .selectAll("line")
      .data(links)
      .enter().append('line')
      .attr('stroke', '#ccc');

    const node = graph_g.append("g")
      .attr('id', 'circles_g')
      .selectAll("circle")
      .data(nodes)
      .enter().append('circle')
      .attr("stroke", '#fff')
      .attr('fill', d => colors[5 + d.category % 10])
      .attr("r", 4)
      //当鼠标触碰时，变色
      .on('mouseover', function (d) {
        d3.select(this)
          .attr('r', 6)
          .attr('fill', 'red');
      })
      .on('mouseout', function (d) {
        d3.select(this)
          .attr('r', 4)
          .attr('fill', colors[5 + d.category % 10]);
      });
    node.append('title')
      .text(d => num2category[d.category] + ' : ' + d.name);

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links))
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

    //减小不同类别间点之间的距离
    simulation.force("charge")
      .distanceMax(60);

    function ticked() {
      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
    }

  });