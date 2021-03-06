const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

document.addEventListener('DOMContentLoaded', () => {
  const myReq = new XMLHttpRequest();
  myReq.open("GET", url, true);
  myReq.send();
  myReq.onload = () => {
    const json = JSON.parse(myReq.responseText);
    console.log(json.data);
    const dataset = json.data;

    const w = 1500,
    h = 500,
    padding = 60,
    barWidth = w / 275;



    var tooltip = d3.select(".chart").
    append("div").
    attr("id", "tooltip").
    style("opacity", 0);



    const yearsDate = json.data.map(function (item) {
      return new Date(item[0]);
    });

    const xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);

    const xScale = d3.scaleTime().
    domain([d3.min(yearsDate), xMax]).
    range([padding, w - padding]);

    const yScale = d3.scaleLinear().
    domain([0, d3.max(dataset, d => d[1])]).
    range([h - padding, padding]);

    const svg = d3.select(document.getElementById("chart")).
    append("svg").
    attr("width", `${w}px`).
    attr("height", `${h}px`);

    svg.selectAll("rect").
    data(dataset).
    enter().
    append("rect").
    attr("class", "bar").
    attr("data-date", d => d[0]).
    attr("data-gdp", d => d[1]).
    attr("x", (d, i) => xScale(yearsDate[i])).
    attr("y", d => yScale(d[1])).
    attr("width", barWidth).
    attr("height", d => `${h - yScale(d[1]) - padding}px`).
    attr("fill", "green").
    attr("data-date", d => d[0]).
    on('mouseover', function (d, i) {

      tooltip.transition().
      duration(200).
      style('opacity', .9);
      tooltip.html(`<div data-date=${d[0]}> 
                <div><strong>year</strong> ${d[0]}</div>
                <div>${d[1]} <strong>Billion</strong></div>
              </div>`).
      attr('data-date', json.data[i][0]).
      style('left', i * w + padding).
      style('top', h - 300 + 'px');

    }).
    on('mouseout', function (d) {
      tooltip.transition().
      duration(200).
      style('opacity', 0);

    });


    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g").
    attr("transform", "translate(0," + (h - padding) + ")").
    attr("id", "x-axis").
    call(xAxis);

    svg.append("g").
    attr("transform", `translate(${padding}, 0)`).
    attr("id", "y-axis").
    call(yAxis);
  };
});