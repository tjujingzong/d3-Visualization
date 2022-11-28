async function updatingBars() {
  // 1. Access data
  const dataset = await d3.json('./data/weather_data.json')

  // 2. Create chart dimensions

  const width = 500
  let dimensions = {
    width: width,
    height: width * 0.6,
    margin: {
      top: 30,
      right: 10,
      bottom: 50,
      left: 50,
    },
  }
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.left - dimensions.margin.right
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom

  // 3. Draw canvas

  const wrapper = d3
    .select('#wrapper')
    .append('svg')
    .attr('width', dimensions.width)
    .attr('height', dimensions.height)

  const bounds = wrapper
    .append('g')
    .style(
      'transform',
      `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
    )

  // init static elements
  bounds.append('g').attr('class', 'bins')
  bounds.append('line').attr('class', 'mean')
  bounds
    .append('g')
    .attr('class', 'x-axis')
    .style('transform', `translateY(${dimensions.boundedHeight}px)`)
    .append('text')
    .attr('class', 'x-axis-label')
    .attr('x', dimensions.boundedWidth / 2)
    .attr('y', dimensions.margin.bottom - 10)

  const drawHistogram = metric => {
    const metricAccessor = d => d[metric]
    const yAccessor = d => d.length

    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(dataset, metricAccessor))
      .range([0, dimensions.boundedWidth])
      .nice()

    const binsGenerator = d3
      .histogram()
      .domain(xScale.domain())
      .value(metricAccessor)
      .thresholds(12)

    const bins = binsGenerator(dataset)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(bins, yAccessor)])
      .range([dimensions.boundedHeight, 0])
      .nice()

    // 5. Draw data
    const barPadding = 1

    const exitTransition = d3.transition().duration(600)
    const updateTransition = exitTransition.transition().duration(600)

    let binGroups = bounds.select('.bins').selectAll('.bin').data(bins)

    const oldBinGroups = binGroups.exit()

    // Select all of the rect elements to remove
    oldBinGroups.selectAll("rect")
      .style("fill", "red") // Color them red
      .transition(exitTransition) // Use our new exit transition
      // Shrink the bars into the x axis
      .attr("y", dimensions.boundedHeight)
      .attr("height", 0)

    // Transition our text
    oldBinGroups.selectAll("text")
      .transition(exitTransition)
      .attr("y", dimensions.boundedHeight)

    // Actually remove our bars from the DOM once the transition has completed
    oldBinGroups
      .transition(exitTransition)
      .remove()

    const newBinGroups = binGroups.enter().append('g').attr('class', 'bin')

    newBinGroups
      .append('rect')
      // IMPROVEMENT: Start in the right horizontal location and be 0 pixels tall to prevent bars from flying in from the left
      .attr('height', 0)
      .attr('x', d => xScale(d.x0) + barPadding)
      .attr('y', dimensions.boundedHeight)
      .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
      // IMPROVEMENT: We need fill to be an inline style so that we can override it in our CSS file; otherwise this would just be an SVG attribute
      .style('fill', 'yellowgreen')

    newBinGroups.append('text')
      // IMPROVEMENT: Set our labels' initial position to prevent them from flying in from the left
      .attr("x", d => xScale(d.x0) + (xScale(d.x1) - xScale(d.x0)) / 2)
      .attr("y", dimensions.boundedHeight)

    // update binGroups to include new points
    binGroups = newBinGroups.merge(binGroups)

    const barRects = binGroups
      .select('rect')
      // Transform our selection object into a D3 transition object
      .transition(updateTransition) // IMPROVEMENT: Use our custom transition from above
      .attr('x', d => xScale(d.x0) + barPadding)
      .attr('y', d => yScale(yAccessor(d)))
      .attr('height', d => dimensions.boundedHeight - yScale(yAccessor(d)))
      .attr('width', d => d3.max([0, xScale(d.x1) - xScale(d.x0) - barPadding]))
      // Add a second transition to make sure our new bars are blue instead of the green color
      .transition()
      .style("fill", "cornflowerblue")

    // make the rects change color when mouse over
    binGroups.selectAll('rect').on('mouseover', onMouseEnter).on('mouseleave', onMouseLeave)
    function onMouseEnter(d, i) {
      d3.select(this).style('fill', 'orange')
      d3.select("#tooltip")//位置在bar上方
        .style("left", xScale(d.x0) + 210 + "px")
        .style("top", yScale(yAccessor(d)) + 50 + "px")
        .style("font-size", "12px")
        .style("opacity", 1.0)
        .html(d.length + " days");
    }
    function onMouseLeave() {
      d3.select(this).style('fill', 'cornflowerblue')
      d3.select("#tooltip")
        .style("opacity", 0.0);
    }

    var tooltip = d3.select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")


    // 6. Draw peripherals

    const xAxisGenerator = d3.axisBottom().scale(xScale)

    const xAxis = bounds.select('.x-axis')
      .transition(updateTransition) // IMPROVEMENT: Use our custom transition from above
      //We can now see our tick marks move to fit the new domain before the new tick marks are drawn
      .call(xAxisGenerator)

    const xAxisLabel = xAxis.select('.x-axis-label').text(metric)
  }

  const metrics = [
    'windSpeed',
    'moonPhase',
    'dewPoint',
    'humidity',
    'uvIndex',
    'windBearing',
    'temperatureMin',
    'temperatureMax',
  ]
  let selectedMetricIndex = 0
  drawHistogram(metrics[selectedMetricIndex])

  const button = d3.select('body').append('button').text('Change metric')

  button.node().addEventListener('click', onClick)

  function onClick() {
    selectedMetricIndex = (selectedMetricIndex + 1) % (metrics.length - 1)
    drawHistogram(metrics[selectedMetricIndex])
  }
}
updatingBars()
