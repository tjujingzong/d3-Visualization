var datas = [];
var keys = ["windSpeed", "moonPhase", "dewPoint", "humidity"
  , "uvIndex", "windBearing", "temperatureMin", "temperatureMax"]
var width = 800,
  height = 400,
  padding = {
    top: 40,
    right: 100,
    bottom: 40,
    left: 100
  };

window.onload = async function () {
  draw(0);
  var i = 0;
  //当id="btn"按钮被点击时,i增加
  d3.select("#btn").on("click", function () {
    //清空svg
    d3.select("svg").remove();
    //清空datas 
    datas = [];
    i++;
    i %= keys.length;
    draw(i);
  })
}

function draw(ii) {
  var totaldata = d3.json("./data/weather_data.json").then(function (data) {
    return data;
  });
  var i = ii;
  var label = keys[i];
  i++;
  i %= keys.length;
  label = keys[i];
  totaldata.then(function (d) {
    for (var i = 0; i < d.length; i++) {
      datas.push(d[i][label]);
    }

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

    // 构造一个直方图布局,在每个x轴刻度区域出现的次数
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

    var tooltip = d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")

    // 构造柱       
    bar.append("rect")
      .attr("x", 1)
      .transition().duration(1000)
      //设置柱的宽度与x轴刻度的宽度一致
      .attr("width", function (d) { return (xScale(d.x1) - xScale(d.x0)) - 1 })
      .attr("height",
        function (d) {
          return height - yScale(d.length) - padding.bottom;
        })
      .attr("fill", "steelblue");

    //添加动画 鼠标触碰变颜色
    d3.selectAll("rect")
      .on("mouseover", function (d, i) {
        d3.select(this).attr("fill", "red");
        d3.select("#tooltip")//位置在bar上方
          .style("left", xScale(d.x0) + 15 + "px")
          .style("top", yScale(d.length) - 10 + "px")
          .style("font-size", "12px")
          .style("opacity", 1.0)
          .html(d.length + " days");
      })
      .on("mouseout", function (d, i) {
        d3.select(this).attr("fill", "steelblue");
        d3.select("#tooltip")
          .style("opacity", 0.0);
      });

    //svg底部添加label文本
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .text(label);

  });
}
