
export default class Barchart {
    constructor() {
 
 }


draw = (newData) => {   


    let svg2 = d3.select("#svg2")
    let w2 = svg2.attr("width") - 200
    let h2 = svg2.attr("height") - 200


    let x = d3.scaleTime().range([0, w2]).domain(d3.extent(newData, (d) => {return d.date}))
    let y = d3.scaleLinear().range([h2, 0]).domain([0, 12000])
    

    let g2 = svg2.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")")

    g2.append("g")
    .attr("transform", "translate(0," + h2 + ")")
    .call(d3.axisBottom(x))
    .append("text")
    .text("Year")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .attr("x", 200)
    .attr("y", 50)

    const gridLines = () => {		
        return d3.axisLeft(y)
            .ticks(5)
    }

    svg2.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(100," + (h2 - 200) + ")")
        .call(gridLines()
            .tickSize(-w2)
            .tickFormat("")
        )


        let tool = d3.select('body')
        .append("div")
        .attr("class", "tooltip")				
         .style("position", "absolute")
        .style("opacity", 0)
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("z-index", 1)
        .style("display", "block")
        .style("height", "55px")
        .style("width", "240px")
    
    
    
         let mo = (el) => {
           tool.style("opacity", 1)
            .style("left", (el.clientX) + "px")
            .style("top", (el.clientY + 400) + "px")
         
        }
    
         let mm = (el) => {
            tool.html('Worker strike that caused: ' + el.target.__data__.cancelled  + '</br> trains to get cancelled')
            .style("left", (el.clientX + 30) + "px")
            .style("top", (el.clientY + 400) + "px")
        }
    
         let mout = (el) => {
           tool.style("opacity", 0)
            .style("left", (el.clientX + 50) + "px")
            .style("top", (el.clientY + 400) + "px")
    
        }
    


    g2.append("g")
    .call(d3.axisLeft(y)
    .tickFormat((d) => { return d})
    .ticks(6))
    .append("text")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .attr("y", 200)
    .attr("x", -30)


        svg2.append("path")
        .datum(newData)
        .attr("class", "death")
        .attr("fill", "blue")
        .attr("transform", "translate(100,100)")
        .style("stroke", "black")
        .style("stroke-width", 1.5)
        .style("opacity", 0.75)
        .attr("d", d3.area()
            .x((d) => {return x(d.date)})
            .y(h2)
            .y1((d) => {return y(d.cancelled)}))


        svg2.append("path")
        .datum(newData)
        .attr("class", "death")
        .attr("transform", "translate(100,100)")
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", 3)
        
        .attr("d", d3.line()
            .x((d) => {return x(d.year)})
            .y((d) => {return y(d.death)}))


        let strike = [{
            date: d3.timeParse("%Y-%m")("2016-6"),
            cancelled: d3.max(newData, (d) => { return +d.cancelled}) / 3
        },
        {
            date: d3.timeParse("%Y-%m")("2018-4"),
            cancelled: d3.max(newData, (d) => { return +d.cancelled})        
        }
    ]

        svg2.selectAll("dots")
        .data(strike)
        .enter()
        .append("circle")
            .attr("fill", "blue")
            .attr("transform", "translate(100,100)")
            .style("stroke", "black")

            .attr("cx", (d) => { return x(d.date)})
            .attr("cy", (d) => {return y(d.cancelled)})
            .attr("r", 5)
            .on("mouseover", mo)
            .on("mousemove", mm)
            .on("mouseout", mout)
        
            
    g2.append("g")
    .attr("transform", "translate(0," + h2 + ")")
    .call(d3.axisBottom(x))
    .attr("stroke", "black")
    .append("text")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .attr("x", 200)
    .attr("y", 50)



    g2.append("g")
    .call(d3.axisLeft(y)
    .tickFormat((d) => { return d})
    .ticks(6)
    )
    .append("text")
    .text("Cancelled")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .attr("y", 200)
    .attr("x", -40)

    }
}