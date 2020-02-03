// @TODO: YOUR CODE HERE!
var width = parseInt(d3.select("#scatter").style("width"));
var height = width - width / 4.0;
var margin = 15;
var labelLength = 110;

var textPadBottom = 35;
var textPadLeft = 35;

var svg = d3
    .select('#scatter')
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "chart");

// graph details    
var circleRadius;
function circleGet() {
    if (width <= 530) {
        circleRadius = 5;
    }
    else {
        circleRadius = 10;
    }
}
circleGet();

svg.append("g").attr("class", "xText");
var xText = d3.select(".xText");

// solution's function to refresh and place xText at bottom
function xTextRefresh() {
    xText.attr(
      "transform",
      "translate(" +
        ((width - labelLength) / 2 + labelLength) +
        ", " +
        (height - margin - textPadBottom) +
        ")"
    );
}
xTextRefresh();

// 3 xTexts pulls and implementation
// Poverty
xText
  .append("text")
  .attr("y", -25)
  .attr("data-name", "poverty")
  .attr("data-axis", "x")
  .attr("class", "aText active x")
  .text("In Poverty (%)");
// Age
xText
  .append("text")
  .attr("y", 0)
  .attr("data-name", "age")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Age (Median)");
// Income
xText
  .append("text")
  .attr("y", 25)
  .attr("data-name", "income")
  .attr("data-axis", "x")
  .attr("class", "aText inactive x")
  .text("Household Income (Median)");

// plotting against the left axis
var leftTextX = margin + textPadLeft;
var leftTextY = (height + labelLength) / 2 - labelLength;
svg.append("g").attr("class", "yText");
var yText = d3.select(".yText");

// Obesity
yText
  .append("text")
  .attr("y", -26)
  .attr("data-name", "obesity")
  .attr("data-axis", "y")
  .attr("class", "aText active y")
  .text("Obese (%)");

// Smokes
yText
  .append("text")
  .attr("x", 0)
  .attr("data-name", "smokes")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Smokes (%)");

// Lacks Healthcare
yText
  .append("text")
  .attr("y", 26)
  .attr("data-name", "healthcare")
  .attr("data-axis", "y")
  .attr("class", "aText inactive y")
  .text("Lacks Healthcare (%)");

function yTextRefresh() {
    yText.attr(
      "transform",
      "translate(" + leftTextX + ", " + leftTextY + ")rotate(-90)"
    );
}
yTextRefresh();

// import the data
d3.csv("assets/data/data.csv").then(function(data) {
    visualize(data);
});

//visualization function
function visualize(newData) {
    var xAxis = "poverty";
    var yAxis = "obesity";

    var toolTip = d3
        .tip()
        .attr("class", "d3-tip")
        .offset([40, -60])
        .html(function(d) {
            var bX;
            var stateName = "<div>" + d.state + "%</div>";
            var bY = "<div>" + yAxis + ": " + d[yAxis] + "%</div>";

            if (xAxis === "poverty") {
                bX = "<div>" + xAxis + ": " + d[xAxis] + "%</div>";
            }
            else {
                xAxis = urX + ": " + parseFloat(d[curX]).toLocaleString("en") + "</div>";
            }
            return stateName + xAxis + yAxis;
        });
    SVG.call(toolTip);
    
    // need Min Max
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    function xMinMax() {
        xMin = d3.min(newData, function(d) {
            return parseFloat(d[xAxis]) * 0.90;
        });
        xMax = d3.min(newData, function(d) {
            return parseFloat(d[xAxis]) * 0.90;
        });
    }
    function yMinMax() {
        yMin = d3.min(newData, function(d) {
            return parseFloat(d[yAxis]) * 0.90;
        });
        yMax = d3.min(newData, function(d) {
            return parseFloat(d[yAxis]) * 0.90;
        });
    }
    xMinMax();
    yMinMax();

    var xScale = d3
        .scaleLinear()
        .domain([xMin, xMax])
        .range([margin + labelLength, width - margin]);
    var yScale = d3
        .scaleLinear()
        .domain([yMin, yMax])
        .range([height - margin - labelLength, margin]);

    function tickCount() {
        if (width <= 500) {
            xAxis.ticks(5);
            yAxis.ticks(5);
        }
        else {
            xAxis.ticks(10);
            yAxis.ticks(10);
        }
    }
    tickCount();

    // group elements and call
    svg
        .append("g")
        .call(xAxis)
        .attr("class", "xAxis")
        .attr("transform", "translate(0," + (height - margin - labelLength) + ")");
    svg
        .append("g")
        .call(yAxis)
        .attr("class", "yAxis")
        .attr("transform", "translate(" + (margin + labelLength) + ", 0)");

    // make circles for graph
    var theCircles = svg.selectAll("g theCircles").data(newData).enter();

    theCircles
        .append("circle")
        .attr("cx", function(d) {
            return xScale(d[xAxis]);
        })
        .attr("cy", function(d) {
            return yScale(d[yAxis]);
        })
        .attr("r", circleRadius)
        .attr("class", function(d) {
            return "stateCircle " + d.abbr;
        })
        .on("mouseover", function(d) {
            toolTip.show(d, this);
            d3.select(this).style("stroke", "#323232");
        });

    // labels for each circle
    theCircles
        .append("text")
        .text(function(d) {
            return d.abbr;
        })
        .attr("dx", function(d) {
            return xScale(d[xAxis]);
        })
        .attr("dy", function(d) {
            return yScale(d[yAxis]) + circleRadius / 2.5;
        })
        .attr("font-size", circleRadius)
        .attr("class", "stateText")
        .on("mouseover", function(d) {
            toolTip.show(d);
            d3.select("." + d.abbr).style("stroke", "#323232");
        })
        .on("mouseout", function(d) {
            toolTip.hide(d);
            d3.select("." + d.abbr).style("stroke", "#e3e3e3");
        });

}