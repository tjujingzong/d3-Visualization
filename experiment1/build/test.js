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
  // console.log(label);
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

    //构造"#tooltip",位置位于页面右侧

    var tooltip = d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")

    // 构造柱
    bar.append("rect")
      .attr("x", 1)
      .attr("width", xScale(his[0].x1) - xScale(his[0].x0) - 1)
      .attr("height",
        function (d) {
          return height - yScale(d.length) - padding.bottom;
        })
      .attr("fill", "steelblue")
      //添加动画 鼠标触碰变颜色
      .on("mouseover", function (d, i) {
        d3.select(this).attr("fill", "red");
      })//移除时恢复
      .on("mouseout", function (d, i) {
        d3.select(this).attr("fill", "steelblue");
      })//鼠标触碰时显示text
      .on("mouseover", function (d, i) {
        d3.select("#tooltip")//位置与bar对齐
          .style("left", xScale(d.x0) + 10 + "px")
          .style("top", yScale(d.length) - 10 + "px")
          //字体变小
          .style("font-size", "10px")
          .style("opacity", 1.0)
          .html(d.length + " days");
      })
      .on("mouseout", function (d, i) {
        d3.select("#tooltip")
          .style("opacity", 0.0);
      })//点击则消失
      .on("click", function (d, i) {
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
