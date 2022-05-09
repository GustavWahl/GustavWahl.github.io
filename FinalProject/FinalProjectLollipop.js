export default class Lollipop {
    constructor() {
 
 }


draw = (avgDelayData) => {   

    let svg4 = d3.select("#svg4")
    let w4 = svg4.attr("width") - 400
    let h4 = svg4.attr("height") - 200



    let x = d3.scaleBand().range([0, h4]).domain(avgDelayData.map((d) => { return d.station; })
    ).padding(1)

    let y = d3.scaleLinear().range([0, w4]).domain([0, d3.max(avgDelayData, (d) => {return +d.delay})])

    let g4 = svg4.append("g")
    .attr("transform", "translate(" + 300 + "," + 100 + ")")


    g4.append("g")
     .attr("transform", "translate(0," + (h4) + ")")
     .call(d3.axisBottom(y)
     )
     .append("text")
     .text("Average delay")
     .attr("text-anchor", "end")
     .attr("stroke", "black")
     .attr("y", 60)
     .attr("x", 300)
     .attr("font-size", "16px")
 
 
     g4.append("g")
     .call(d3.axisLeft(x))
     .append("text")
     .text("station")
     .attr("text-anchor", "end")
     .attr("stroke", "black")
     .attr("y", 0)
     .attr("x", -40)
     .attr("font-size", "16px")
  
    



    g4.selectAll("myline")
        .data(avgDelayData)
        .enter()
        .append("line")
            .attr("x1", (d) =>{ return y(d.delay) })
            .attr("x2", 0)
            .attr("y1", (d) => { return x(d.station)  })
            .attr("y2", (d) => { return x(d.station)} )
            .attr("stroke", "grey")

    g4.selectAll("mycircle")
        .data(avgDelayData)
        .enter()
        .append("circle")
            .attr("cx", (d) => { return y(d.delay) })
            .attr("cy", (d) => { return x(d.station) })
            .attr("r", "4")
            .style("fill", "blue")
            .attr("stroke", "darkblue")
         
}
}
