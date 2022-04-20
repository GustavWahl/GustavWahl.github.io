d3.csv("Fleet Data.csv").then((d) => {
        


    data = []
    let i = 0


    for ( elem in d) {
        let plane = d[elem]['Aircraft Type']
        plane = plane + ""

        if (plane.includes('Airbus') || plane.includes('Boeing')) {
            data[i++] = d[elem]
        }
    }

    let map = new Map()

    for (i in data) {
        let key = data[i]['Aircraft Type'] + ""

        if (map.get(key) != null) {
            let count = map.get(key)
            map.set(key, count + 1)
        } else {
            map.set(key, 1)
        }
    }

    data = []
    i = 0

    map.forEach((k, v) => {
        data[i++] = {plane: v, count: k}
    })

    data.sort((a, b) => (a.count > b.count) ? -1: 1)

    data = data.slice(0, 7)

    console.log(data)

    

    let svg = d3.select("svg")
    let w = svg.attr("width") - 200
    let h = svg.attr("height") - 200

    console.log(data)

    let x = d3.scaleBand().range([0, w]).padding(0.3).domain(data.map((d) => { return d.plane }))
    let y = d3.scaleLinear().range([h, 0]).domain([0, 150])
    let color = d3.scaleLinear().range(["white", "cadetblue"]).domain([0, d3.max(data, (d) => {return +d.count})])

    svg.append("text")
    .attr("transform", "translate(150,0)")
    .attr("x", 100)
    .attr("y", 50)
    .attr("font-size", "20px")
    .text("Count of aircraft models")

    let g = svg.append("g")
    .attr("transform", "translate(" + 120 + "," + 120 + ")")
    
    g.append("g")
     .attr("transform", "translate(0," + h + ")")
     .call(d3.axisBottom(x))
     .append("text")
     .attr("y", g - 350)
     .attr("x", w - 350)
     .attr("text-anchor", "end")
     .attr("stroke", "black")
     .text("Aircrafts")
     .attr("y", 60)


    g.append("g")
     .call(d3.axisLeft(y))
     .append("text")
     .attr("transform", "rotate(-90)")
     .attr("y", 6)
     .attr("dy", "-5.1em")
     .attr("x", -150)
     .attr("text-anchor", "end")
     .attr("stroke", "black")
     .text("Count");
    

     svg.append("g")
     .attr("transform", "translate(" + 810 + "," + 150 + ")")
     .attr("class", "legend")
     .append("text")
     .attr("y", -20)
     .attr("stroke", "black")
     .text("Count")
  
   
      let colorLeg = d3.legendColor()
      .shape("path", d3.symbol().type(d3.symbolCircle)
      .size((d) => {return size(d.protein)}
      ))
      .shapePadding(10)
      .scale(color)
  
  
      svg.select(".legend")
      .call(colorLeg)
  


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
     .style("height", "35px")
     .style("width", "250px")
 
 
 
     let mouseover = (el) => {
         tooltip.style("opacity", 1)
         .style("left", (el.clientX) + "px")
         .style("top", (el.clientY - 50) + "px")
      
     }
 
     let mousemove = (el) => {
         console.log(el)
         tooltip.html('plane: ' + el.target.__data__.plane + '<br/>count: ' + el.target.__data__.count )
         .style("left", (el.clientX + 30) + "px")
         .style("top", (el.clientY - 50) + "px")
     }
 
     let mouseout = (el) => {
         tooltip.style("opacity", 0)
         .style("left", (el.clientX + 30) + "px")
         .style("top", (el.clientY - 50) + "px")
 
     }
 

    g.selectAll("bars")
     .data(data)   
     .enter().append("rect")
     .attr("fill", (d) => { return color(d.count)})
     .attr("x", (d) => { return x(d.plane) })
     .attr("y", (d) => { return parseInt(y(d.count)) })
     .attr("width", x.bandwidth())
     .attr("height", (d) => { return h- parseInt(y(d.count )) })
     .on("mouseover", mouseover)
     .on("mousemove", mousemove)
     .on("mouseout", mouseout)
});

