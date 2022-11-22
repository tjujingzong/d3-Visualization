var datas = [];
var keys = ["windSpeed", "moonPhase", "dewPoint", "humidity"
  , "uvIndex", "windBearing", "temperatureMin", "temperatureMax"]

window.onload = async function () {
  draw(0);
  var i = 0;
  //当id="btn"按钮被点击时,i增加
  d3.select("#btn").on("click", function () {
    //清空svg
    d3.select("svg").remove();
    i++;
    i %= keys.length;
    draw(i);
  });
}

function draw(ii) {
  var totaldata = d3.json("data/weather_data.json").then(function (data) {
    return data;
  });
  var i = ii;
  var label = keys[i];
  //当id="btn"按钮被点击时,i增加
  //清空svg
  datas = [];
  d3.select("svg").remove();
  i++;
  i %= keys.length;
  label = keys[i];
  console.log(label);
  totaldata.then(function (d) {
    for (var i = 0; i < d.length; i++) {
      datas.push(d[i][label]);
    }
    var width = 800,
      height = 400,
      padding = {
        top: 10,
        right: 100,
        bottom: 40,
        left: 100
      };

    var svg = d3.select("#test-svg")
      .append('svg')
      .attr('width', width + 'px')
      .attr('height', height + 'px');

    // x轴将数据映射从[min,max]到坐标轴
    var xScale = d3.scaleLinear()
      .domain([d3.min(datas), d3.max(datas) * 1.1])
      .range([padding.left, width - padding.right]);

    var xAxis = d3.axisBottom()
      .scale(xScale)
      .ticks(10);

    svg.append('g')
      .call(xAxis)
      .attr("transform", "translate(0," + (height - padding.bottom) + ")");

    // 构造一个直方图布局,返回随机数在每个x轴刻度区域出现的次数
    var his = d3.histogram()
      .domain(xScale.domain())
      .thresholds(xScale.ticks(10))
      (datas);

    // y轴
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(his,
        function (d) {
          return d.length;
        })])
      .range([height - padding.bottom, padding.top]);

    var yAxis = d3.axisLeft()
      .scale(yScale)
      .ticks(10);
    svg.append('g')
      .call(yAxis)
      .attr("transform", "translate(" + padding.left + ",0)");

    var bar = svg.selectAll(".bar")
      .data(his)
      .join("g")
      .attr("class", "bar")
      .attr("transform",
        function (d) {
          return "translate(" + xScale(d.x0) + "," + yScale(d.length) + ")";
        });

    // 构造柱
    bar.append("rect")
      .attr("x", 1)
      .attr("width", xScale(his[0].x1) - xScale(his[0].x0) - 1)
      .attr("height",
        function (d) {
          return height - yScale(d.length) - padding.bottom;
        });

    bar.append("text")
      .attr("dy", ".75em")
      .attr("y", 6)
      .attr("x", (xScale(his[0].x1) - xScale(his[0].x0)) / 2)
      .attr("text-anchor", "middle")
      .attr("font-size", "8px")
      .attr("fill", "White")
      .text(function (d) {
        return d.length;
      });
  });
}
