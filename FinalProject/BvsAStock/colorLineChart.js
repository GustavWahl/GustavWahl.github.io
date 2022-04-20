d3.csv("BA (1).csv").then((dt) => {
    d3.csv("AIR.PA (1).csv").then((dta) => {


    
    let svg = d3.select("svg")
    let w = svg.attr("width") - 200
    let h = svg.attr("height") - 200

    svg.append("text")
    .attr("x", 300)
    .attr("y", 50)
    .attr("font-size", "20px")
    .text("Boeing vs Airbus stock")

    

    let g = svg.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")")


    d = []

    for (let i = 0; i < dt.length; i++) {
     obj = {"date" : d3.timeParse("%Y-%m-%d")(dt[i].Date), 
     "close": dt[i].Close,
     "low": dt[i].Low,
     "high": dt[i].High,
     "open": dt[i].Open
    }

     d[i] = obj
    }


    da = []

    for (let i = 0; i < dta.length; i++) {
     obj = {"date" : d3.timeParse("%Y-%m-%d")(dta[i].Date), 
     "close": dta[i].Close,
     "low": dta[i].Low,
     "high": dta[i].High,
     "open": dta[i].Open
    }

        if (isNaN(obj.close)) obj.close = da[i - 1].close 

     da[i] = obj
    }

    console.log()


    let x = d3.scaleTime().range([0, w]).domain(d3.extent(d, (d) => {return d.date}))
    let y = d3.scaleLinear().range([h, 0]).domain([0, d3.max(d, (d) => {return +d.close})])
   // let colorCategory = d3.scale.category10();
    let colorScale = d3.scaleOrdinal().range(["red", "blue"]).domain(['Boeing', "Airbus"])



    g.append("g")
    .attr("transform", "translate(0," + h + ")")
    .call(d3.axisBottom(x))
    .append("text")
    .text("Date")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .attr("x", 400)
    .attr("y", 50)



    g.append("g")
    .call(d3.axisLeft(y)
    .tickFormat((d) => { return d})
    .ticks(10))
    .append("text")
    .text("Dollars")
    .attr("text-anchor", "end")
    .attr("stroke", "black")
    .attr("y", 150)
    .attr("x", -50)



    let tooltip = d3.select('body')
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
    .style("height", "120px")
    .style("width", "500px")



    let mouseover = (el) => {
        tooltip.style("opacity", 1)
        tooltip.html('date: ' + el.target.__data__[0].date 
        + '<br/><br/>close: ' + el.target.__data__[0].close )
        .style("left", (el.clientX) + "px")
        .style("top", (el.clientY - 50) + "px")
     
    }

    let mousemove = (el) => {
        tooltip.html('date: ' + el.target.__data__[0].date 
        + '<br/><br/>close: ' + el.target.__data__[0].close )
        .style("left", (el.clientX + 30) + "px")
        .style("top", (el.clientY - 50) + "px")
    }

    let mouseout = (el) => {
        tooltip.style("opacity", 0)
        .style("left", (el.clientX + 30) + "px")
        .style("top", (el.clientY - 50) + "px")

    }

    
    svg.append("g")
    .attr("transform", "translate(" + 150 + "," + 100 + ")")
 //   .attr("transform", "rotate(90)")

    .attr("class", "legend")
    .append("text")
    .attr("y", -10)
   // .attr("x", -850)

    .attr("stroke", "black")
    .text("Stocks")
 
  
     let colorLeg = d3.legendColor()
     
     .shape("path", d3.symbol().type(d3.symbolCircle)
     .size(2))
     .shapePadding(10)
     .scale(colorScale)
    
 
 
     svg.select(".legend")
     .call(colorLeg)
    
        g.append("path")
        .datum(d)
        .attr("id", "close")
        .style("fill", "none")
        .style("stroke", "red")
        .style("stroke-width", 1.5)
     
        .attr("d", d3.line()
            .x((d) => {return x(d.date)})
            .y((d) => {return y(d.close)}))
    

        g.append("path")
        .datum(da)
        .attr("id", "close")
        .style("fill", "none")
        .style("stroke", "blue")
        .style("stroke-width", 1.5)
        
        .attr("d", d3.line()
            .x((d) => {return x(d.date)})
            .y((d) => {return y(d.close)}))


})
})
