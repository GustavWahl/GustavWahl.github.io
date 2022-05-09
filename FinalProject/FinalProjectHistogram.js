export default class Histogram {
    constructor() {
 }


draw = (histogramData) => {   

    console.log(histogramData)

    let svg3 = d3.select("#svg3")
    let w3 = svg3.attr("width") - 200
    let h3 = svg3.attr("height") - 200


    let x = d3.scaleBand().range([0, w3]).domain(histogramData.map((d) => { return d.date; })).padding(0.05)
    let y = d3.scaleLinear().range([h3, 0]).domain([0, d3.max(histogramData, (d) => {return +d.cancelled})])

    let g3 = svg3.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")")

    g3.append("g")
    .attr("transform", "translate(0," + (h3) + ")")
    .call(d3.axisBottom(x))
    .append("text")
    .text("Months")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .attr("y", 60)
    .attr("x", 350)
    .attr("font-size", "16px")


    g3.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .text("Count cancelled trains")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .attr("y", 160)
    .attr("x", -40)
    .attr("font-size", "16px")


     let tool = d3.select('body')
    .append("div")
    .attr("class", "tip")				
     .style("position", "absolute")
    .style("opacity", 0)
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("z-index", 1)
    .style("display", "block")
    .style("height", "45px")
    .style("width", "90px")



     let mo = (el) => {
       tool.style("opacity", 1)
        .style("left", (el.clientX) + "px")
        .style("top", (el.clientY + 900) + "px")
     
    }

     let mm = (el) => {
        tool.html('Month: ' + el.target.__data__.date + '<br/>Count: ' + el.target.__data__.cancelled )
        .style("left", (el.clientX + 30) + "px")
        .style("top", (el.clientY + 900) + "px")
    }

     let mout = (el) => {
       tool.style("opacity", 0)
        .style("left", (el.clientX + 50) + "px")
        .style("top", (el.clientY + 900) + "px")

    }

   
    g3.selectAll("bars")
    .data(histogramData)   
    .enter().append("rect")
    .style("fill", 'blue')
    .style("border-width", "10px")
  .style("border-color", "black")
    .style("border-style", "solid")
    .attr("x", (d) => { return x(d.date) })
    .attr("y", (d) => {return y(d.cancelled )})
    .attr("width", x.bandwidth())
    .attr("height", (d) => {return h3 - y(d.cancelled)})
    .on("mouseover", mo)
    .on("mousemove", mm)
    .on("mouseout", mout)
}
}