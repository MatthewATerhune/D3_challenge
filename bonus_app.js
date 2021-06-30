var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "age";
var chosenYaxis = "poverty";

/***************************************************************************/
// functions for update Yscale and Xscale
function xScale(d3Data, chosenXAxis) 
{
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(d3Data, d => d[chosenXAxis]) * 0.8,
      d3.max(d3Data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}
function yScale(d3Data, chosenYAxis) 
{
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(d3Data, d => d[chosenYAxis]) * 0.8,
      d3.max(d3Data, d => d[chosenYAxis]) * 1.2
    ])
    .range([0, width]);

  return yLinearScale;

}
/***************************************************************************/
// function used for updating xAxis and yAxis
function renderXAxes(newXScale, xAxis) 
{
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) 
{
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}
/***************************************************************************/
// function used for updating circles group with a transition to
// new circles

function renderXCircles(circlesXGroup, newXScale, chosenXAxis) 
{

  circlesXGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesXGroup;
}


function renderYCircles(circlesYGroup, newYScale, chosenYAxis) 
{

  circlesYGroup.transition()
    .duration(1000)
    .attr("cx", d => newYScale(d[chosenYAxis]));

  return circlesYGroup;
}

/***************************************************************************/
// function used for updating circles group with new tooltip

function updateXToolTip(chosenXAxis, circlesXGroup) 
{

  var label;

  if (chosenXAxis === "age") 
  {
    label = "Age:";
  }
  else if(chosenXaxis === "smokes")
  {
    label = "Smokes:";
  }
  else
  {
    label = "Obesity";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) 
    {
      return (`${d.state}<br>${label} ${d[chosenXAxis]}`);
    });

  circlesXGroup.call(toolTip);

  circlesXGroup.on("mouseover", function(data) 
  {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) 
    {
      toolTip.hide(data);
    });

  return circlesXGroup;
}

function updateYToolTip(chosenYAxis, circlesYGroup) 
{

  var label;

  if (chosenYAxis === "poverty") 
  {
    label = "Poverty";
  }
  else if(chosenYaxis === "smokes")
  {
    label = "Smokes:";
  }
  else
  {
    label = "Obesity";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) 
    {
      return (`${d.state}<br>${label} ${d[chosenYAxis]}`);
    });

  circlesYGroup.call(toolTip);

  circlesYGroup.on("mouseover", function(data) 
  {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) 
    {
      toolTip.hide(data);
    });

  return circlesYGroup;
}


/////////////////////////////////// may need to put in Y axis here //////////////////////


/***************************************************************************/
// Retrieve data from the CSV file and execute everything below
d3.csv("data.csv").then(function(d3Data, err) 
{
  if (err) throw err;

  // parse data
  d3Data.forEach(function(data) 
  {
    data.age = +data.age;
    data.smokes = +data.smokes;
    data.obesity = +data.obesity;
  });

  // LinearScale function 
  var xLinearScale = xScale(d3Data, chosenXAxis);

  D3Data.forEach(function(data) 
  {
    data.poverty = +data.poverty;
  });
  
  var yLinearScale = yScale(D3Data, chosenYAxis);

  // Create y scale function
  // var yLinearScale = d3.scaleLinear()
  //   .domain([0, d3.max(d3Data, d => d.poverty)])
  //   .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesXGroup = chartGroup.selectAll("circle")
    .data(d3Data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 20)
    .attr("fill", "blue")
    .attr("opacity", ".5");
    // .attr("class", function (d) 
    // {
    //   return d.abbr;
    // })

  // Create group  x-axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var ageLabels = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "age") // value to grab for event listener
    .classed("active", true)
    .text("Age");

  var smokesLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "smokes") // value to grab for event listener
    .classed("inactive", true)
    .text("smokes");

  var obesityLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "obesity") // value to grab for event listener
    .classed("inactive", true)
    .text("obesity");

  // append y axis
  var povertyLabel = chartGroup.append("text")
    .attr("x", 20)
    .attr("y", 0)
    .attr("yvalue", "poverty") // Yvalue to grab for event listener
    .classed("inactive", true)
    .text("poverty");



  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Poverty");

  // updateToolTip function above csv import
  var circlesXGroup = updateXToolTip(chosenXAxis, circlesXGroup);
  var circlesYGroup = updateYToolTip(chosenYAxis, circlesYGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() 
    {
      // get value of selection
      var value = d3.select(this).attr("value");
      var yvalue = d3.select(this).attr("yvalue");

      if (value !== chosenXAxis) or (yvalue !== chosenYaxis) 
      {

        // replaces chosenXAxis with value
        chosenXAxis = value;
        chosenYaxis = yvalue;

        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(d3Data, chosenXAxis);
        yLinearScale = yScale(d3Data, chosenYAxis);

        // updates x axis with transition
        xAxis = renderYAxes(xLinearScale, xAxis);
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesXGroup = renderXCircles(circlesXGroup, xLinearScale, chosenXAxis);
        circlesYGroup = renderYCircles(circlesYGroup, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesXGroup = updateXToolTip(chosenXAxis, circlesXGroup);
        circlesYGroup = updateYToolTip(chosenYAxis, circlesYGroup);
        // changes classes to change bold text
        if (chosenXAxis === "smokes") 
        {
          smokesLabel
            .classed("active", true)
            .classed("inactive", false);
          ageLabels
            .classed("active", false)
            .classed("inactive", true);
          obesityLabels
            .classed("active", false)
            .classed("inactive", true);
        }
        else if (chosenXAxis === "age")
        {
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabels
            .classed("active", true)
            .classed("inactive", false);
          obesityLabels
            .classed("active", false)
            .classed("inactive", true);
        }
        else
        {
          smokesLabel
            .classed("active", false)
            .classed("inactive", true);
          ageLabels
            .classed("active", false)
            .classed("inactive", true);
          obesityLabels
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });

/***************************************************************************/
}).catch(function(error) 
{
  console.log(error);
});
