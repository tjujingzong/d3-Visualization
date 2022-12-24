const height = 800;
const width = 650;

const svg = d3.select('#my_svg')
  .attr('width', width)
  .attr('height', height);

// 添加一个背景矩形以显示svg覆盖的范围
svg.append('rect')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'none')
  .attr('stroke', 'grey');

Promise.all([
  d3.json("YELL.geojson"),
  d3.csv("all.csv")
]).then((data) => {

  let geojson = data[0];
  let dots = data[1]
  let projection = d3.geoMercator().center([-110.15, 44.75]).scale(22000);
  let path = d3.geoPath().projection(projection);
  svg.append("path")
    .attr("d", path(geojson))
    .attr("fill", "#a6cee3")
    .attr("opacity", 0.3)
    .attr("stroke", "black")

  let hexbin = d3.hexbin()
    .x(d => d.x).y(d => d.y)
    .extent([[0, 0], [width, height]]).radius(6)
  dots.forEach(d => {
    coordinate = projection([d.lon, d.lat])
    d.x = coordinate[0]
    d.y = coordinate[1]
  });

  let hex_data = hexbin(dots)

  let pudCount = arr => d3.set(arr.map(d => d['owner_date'])).size();
  let color = d3.scaleSequential([0, d3.max(hex_data, d => Math.sqrt(pudCount(d)))], d3.interpolateReds);
  svg.selectAll(".hex")
    .data(hex_data).join("path")
    .attr("class", "hex")
    .attr("transform", d => `translate(${d.x},${d.y})`)
    .attr("d", d => hexbin.hexagon(hexbin.radius()))
    .attr("fill", d => color(Math.sqrt(pudCount(d))))
    .attr("stroke", "#a6cee3")
    .append("title")
    .text(d => `${pudCount(d)} PUD`);

  //在蜂窝热力图下方绘制一个柱状图，显示每年的PUD数量
  let year = dots.map(d => d['year'])
  let year_count = d3.rollup(year, v => v.length, d => d)
  let year_count_arr = Array.from(year_count, ([key, value]) => ({ key, value }));
  year_count_arr.sort((a, b) => a.key - b.key)

  let x = d3.scaleBand()
    .domain(year_count_arr.map(d => d.key))
    .range([0, width])
    .padding(0.1);
  let height2 = 150;
  let y = d3.scaleLinear()
    .domain([0, d3.max(year_count_arr, d => d.value)])
    .range([height, height - height2]);

  svg.append("g")
    .call(d3.axisLeft(y));

  svg.selectAll("bar")
    .data(year_count_arr)
    .enter().append("rect")
    .style("fill", "steelblue")
    .attr("x", d => x(d.key))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.value))
    .attr("height", d => height - y(d.value));

  //添加年份标签位于柱状图的顶部
  svg.selectAll("bar")
    .data(year_count_arr)
    .enter()
    .append("text")
    .text(d => d.key)
    .attr("x", d => x(d.key) + x.bandwidth() / 2)
    .attr("y", d => y(d.value) - 5)
    .attr("font-size", "12px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");


  //添加一个矩形选择框
  let brush = d3.brush()
    .extent([[0, 0], [width, height]])
    .on("end", brushed);

  svg.append("g")
    .attr("class", "brush")
    .call(brush);

  //鼠标刷选某个区间的年份，蜂窝热力图只显示选中的年份的数据分布
  //brushed()函数的输入是一个数组，包含了选中区域的左上角和右下角的坐标

  function brushed() {
    let selection = d3.event.selection;
    if (!selection) return;
    let [[x0, y0], [x1, y1]] = selection;
    let selected = dots.filter(d => x0 <= d.x && d.x < x1 && y0 <= d.y && d.y < y1);
    //清空柱状图
    svg.selectAll("rect").remove();
    //清空年份标签
    svg.selectAll("text").remove();
    svg.append("g")
      .attr("class", "brush")
      .call(brush);
    let hex_data = hexbin(selected)
    let pudCount = arr => d3.set(arr.map(d => d['owner_date'])).size();
    let color = d3.scaleSequential([0, d3.max(hex_data, d => Math.sqrt(pudCount(d)))], d3.interpolateReds);
    svg.selectAll(".hex")
      .data(hex_data).join("path")
      .attr("class", "hex")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("d", d => hexbin.hexagon(hexbin.radius()))
      .attr("fill", d => color(Math.sqrt(pudCount(d))))
      .attr("stroke", "#a6cee3")
      .append("title")
      .text(d => `${pudCount(d)} PUD`);


    //鼠标刷选某个区间，柱状图只显示选中区间的年份的数据分布
    let year = selected.map(d => d['year'])
    let year_count = d3.rollup(year, v => v.length, d => d)
    let year_count_arr = Array.from(year_count, ([key, value]) => ({ key, value }));
    year_count_arr.sort((a, b) => a.key - b.key)

    let x = d3.scaleBand()
      .domain(year_count_arr.map(d => d.key))
      .range([0, width])
      .padding(0.1);
    let height2 = 150;
    let y = d3.scaleLinear()
      .domain([0, d3.max(year_count_arr, d => d.value)])
      .range([height, height - height2]);

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.selectAll("bar")
      .data(year_count_arr)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", d => x(d.key))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value));

    //添加年份标签位于柱状图的顶部
    svg.selectAll("bar")
      .data(year_count_arr)
      .enter()
      .append("text")
      .text(d => d.key)
      .attr("x", d => x(d.key) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 5)
      .attr("font-size", "12px")
      .attr("fill", "black")
      .attr("text-anchor", "middle");
  }
  //鼠标单击时，恢复初始状态
  svg.on("click", function () {
    svg.selectAll("rect").remove();
    svg.selectAll("text").remove();
    svg.append("g")
      .attr("class", "brush")
      .call(brush);
    let hex_data = hexbin(dots)
    let pudCount = arr => d3.set(arr.map(d => d['owner_date'])).size();
    let color = d3.scaleSequential([0, d3.max(hex_data, d => Math.sqrt(pudCount(d)))], d3.interpolateReds);
    svg.selectAll(".hex")
      .data(hex_data).join("path")
      .attr("class", "hex")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("d", d => hexbin.hexagon(hexbin.radius()))
      .attr("fill", d => color(Math.sqrt(pudCount(d))))
      .attr("stroke", "#a6cee3")
      .append("title")
      .text(d => `${pudCount(d)} PUD`);

    //鼠标单击时，恢复初始状态
    let year = dots.map(d => d['year'])
    let year_count = d3.rollup(year, v => v.length, d => d)
    let year_count_arr = Array.from(year_count, ([key, value]) => ({ key, value }));
    year_count_arr.sort((a, b) => a.key - b.key)

    let x = d3.scaleBand()
      .domain(year_count_arr.map(d => d.key))
      .range([0, width])
      .padding(0.1);
    let height2 = 150;
    let y = d3.scaleLinear()
      .domain([0, d3.max(year_count_arr, d => d.value)])
      .range([height, height - height2]);

    svg.append("g")
      .call(d3.axisLeft(y));

    svg.selectAll("bar")
      .data(year_count_arr)
      .enter().append("rect")
      .style("fill", "steelblue")
      .attr("x", d => x(d.key))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.value))
      .attr("height", d => height - y(d.value));

    //添加年份标签位于柱状图的顶部
    svg.selectAll("bar")
      .data(year_count_arr)
      .enter()
      .append("text")
      .text(d => d.key)
      .attr("x", d => x(d.key) + x.bandwidth() / 2)
      .attr("y", d => y(d.value) - 5)
      .attr("font-size", "12px")
      .attr("fill", "black")
      .attr("text-anchor", "middle");
  });
});

