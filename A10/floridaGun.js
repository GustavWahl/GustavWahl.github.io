d3.csv("florida.csv").then((dt) => {


    let svg = d3.select("#florida")
    let w = svg.attr("width") - 200
    let h = svg.attr("height") - 200

    svg.append("text")
    .attr("x", 200)
    .attr("y", 50)
    .attr("font-size", "20px")
    .text("Gun deaths in Florida")


    let g = svg.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")")


    d = []

    for (let i = 0; i < dt.length; i++) {
     obj = {"year" : d3.timeParse("%Y")(dt[i].year), 
     "death": dt[i].death,

    }

     d[i] = obj
    }


    let x = d3.scaleTime().range([0, w]).domain(d3.extent(d, (d) => {return d.year}))
    let y = d3.scaleLinear().range([h, 0]).domain([0, 1000])

    


    g.append("g")
    .attr("transform", "translate(0," + h + ")")
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

    svg.append("g")			
        .attr("class", "grid")
        .attr("transform", "translate(100," + (h - 300) + ")")
        .call(gridLines()
            .tickSize(-w)
            .tickFormat("")
        )



    g.append("g")
    .call(d3.axisLeft(y)
    .tickFormat((d) => { return d})
    .ticks(6))
    .append("text")
    .text("Deaths")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .attr("y", 200)
    .attr("x", -30)


        svg.append("path")
        .datum(d)
        .attr("class", "death")
        .attr("fill", "darkred")
        .attr("transform", "translate(100,100)")
        .style("stroke", "black")
        .style("stroke-width", 1.5)
        .style("opacity", 0.75)
        .attr("d", d3.area()
            .x((d) => {return x(d.year)})
            .y(h)
            .y1((d) => {return y(d.death)}))


        svg.append("path")
        .datum(d)
        .attr("class", "death")
        .attr("transform", "translate(100,100)")
        .style("fill", "none")
        .style("stroke", "black")
        .style("stroke-width", 3)
        
        .attr("d", d3.line()
            .x((d) => {return x(d.year)})
            .y((d) => {return y(d.death)}))

        svg.selectAll("dots")
        .data(d)
        .enter()
        .append("circle")
            .attr("fill", "black")
            .attr("transform", "translate(100,100)")
            .style("stroke", "white")

            .attr("cx", (d) => { return x(d.year)})
            .attr("cy", (d) => {return y(d.death)})
            .attr("r", 3)


            
    g.append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(x))
    .attr("stroke", "black")
    .append("text")
    .text("Year")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .attr("x", 200)
    .attr("y", 50)



    g.append("g")
    .call(d3.axisLeft(y)
    .tickFormat((d) => { return d})
    .ticks(6)
    )
    .append("text")
    .text("Deaths")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .attr("y", 200)
    .attr("x", -30)
    
})
