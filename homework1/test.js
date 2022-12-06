function darsvg() {
  //设置svg的宽高
  var svg = d3.select("body").append("svg")
    .attr("width", 800)
    .attr("height", 600);

  //使用d3 绘制小人
  var person = svg.append("g")
    .attr("transform", "translate(100,100) scale(0.5)");

  //头部
  person.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 50)
    .attr("fill", "yellow");

  //在小人的头上画几条竖线作为头发
  person.append("line")
    .attr("x1", -10)
    .attr("y1", -50)
    .attr("x2", -10)
    .attr("y2", -70)
    .attr("stroke", "black")
    .attr("stroke-width", 5);
  person.append("line")
    .attr("x1", 0)
    .attr("y1", -50)
    .attr("x2", 0)
    .attr("y2", -70)
    .attr("stroke", "black")
    .attr("stroke-width", 5);
  person.append("line")
    .attr("x1", 10)
    .attr("y1", -50)
    .attr("x2", 10)
    .attr("y2", -70)
    .attr("stroke", "black")
    .attr("stroke-width", 5);

  //画眼睛
  person.append("circle")
    .attr("cx", -20)
    .attr("cy", -20)
    .attr("r", 10)
    .attr("fill", "black");
  person.append("circle")
    .attr("cx", 20)
    .attr("cy", -20)
    .attr("r", 10)
    .attr("fill", "black");

  //画嘴巴
  person.append("path")
    .attr("d", "M -30,20 A 20,20 0 0,1 30,20")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("stroke-width", 5);

  //将小人移动到屏幕中央
  person.attr("transform", "translate(400,100) scale(0.5)");

  //为小人添加身体
  person.append("rect")
    .attr("x", -50)
    .attr("y", 50)
    .attr("width", 100)
    .attr("height", 100)
    .attr("fill", "red");

  //为小人添加胳膊
  person.append("rect")
    .attr("x", -50)
    .attr("y", 50)
    .attr("width", 20)
    .attr("height", 90)
    //矩形向左倾斜
    .attr("transform", "rotate(-60)")
    .attr("fill", "red");

  person.append("rect")
    .attr("x", 30)
    .attr("y", 50)
    .attr("width", 20)
    .attr("height", 90)
    //矩形向右倾斜
    .attr("transform", "rotate(60)")
    .attr("fill", "red");

  //为小人添加腿
  person.append("rect")
    .attr("x", -50)
    .attr("y", 150)
    .attr("width", 20)
    .attr("height", 90)
  person.append("rect")
    .attr("x", 30)
    .attr("y", 150)
    .attr("width", 20)
    .attr("height", 90)
}


darsvg()
