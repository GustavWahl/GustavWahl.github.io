export default class TrainMap {
    constructor() {
 }


drawMap = (longLat, nodes, links, imageMap, avgDelayData, lolliPop, histogram, barchart, dt) => {      
    
    let svg5 = d3.select("svg")
    let w5 = svg5.attr("width")
    let h5 = svg5.attr("height") 


    
    let markers =  []
    let selected = new Map()
    let greyedOut = new Map()
    let keepData = new Map()

    avgDelayData.forEach((elem) => {
        keepData.set(elem.station, elem.delay)
    })

    let i = 0
    longLat.forEach((k, v) => {
        let obj = {long: k.lon , lat: k.lat, c: k.c, name: v}
        selected.set(v, true)
        markers[i++] = obj
    });


    console.log(links)
    nodes.forEach( (elem) => {
        let i = 0
        links.forEach( (link) => {
            if (elem.station == link.station) {
                elem['links'][i++] = link
            }
        })
    })


    function reData() {
        let newMap = new Map()
        let histMap = new Map()
    
    
        let avgCountMap = new Map()
        let stationDelay = new Map()
    
        // Average delay of late arriving trains (min)
        // Arrival station
    
        for (let i = 0; i < dt.length; i++) {
            const element = dt[i]
            let dep = element['Departure station']

            selected.forEach((k, v) => { 
                
                if (v == dep && k) {
            
                    if (newMap.has(element.Period)) {
                        let val = newMap.get(element.Period)
                        newMap.set(element.Period, parseInt(element['Number of cancelled trains']) + val)
            
                    } else {
                        newMap.set(element.Period, parseInt(element['Number of cancelled trains']))
                    }
            
                    if (histMap.has(element.Month)) {
                        let val = histMap.get(element.Month)
                        histMap.set(element.Month, parseInt(element['Number of cancelled trains']) + val)
            
                    } else {
                        histMap.set(element.Month, parseInt(element['Number of cancelled trains']))
                    }
                }
            })
        }
    
        let newData = []
        let histogramData = []
        let i = 0;
        newMap.forEach( (k, v) => {
            let obj = {"date" : d3.timeParse("%Y-%m")(v), 
                "cancelled": k,
            }
         newData[i++] = obj
        })
    
        let monthMap = new Map()
        monthMap.set(1, "JAN")
        monthMap.set(2, "FEB")
        monthMap.set(3, "MAR")
        monthMap.set(4, "APR")
        monthMap.set(5, "MAY")
        monthMap.set(6, "JUN")
        monthMap.set(7, "JUL")
        monthMap.set(8, "AUG")
        monthMap.set(9, "SEP")
        monthMap.set(10, "OCT")
        monthMap.set(11, "NOV")
        monthMap.set(12, "DEC")
    
        i = 0    
        histMap.forEach( (k, v) => {  
            let obj = {"date" : monthMap.get(parseInt(v)), 
                "cancelled": k,
            }
            histogramData[i++] = obj
        })
        
        histogramData.sort((a, b) => b.cancelled - a.cancelled)
        newData.sort((a, b) => a.date - b.date)
        
        d3.select("#svg3").selectAll('*').remove();
        d3.select("#svg2").selectAll('*').remove();

        barchart.draw(newData)
        histogram.draw(histogramData)

    }





    function selectAll() {
        greyedOut.forEach((k, v) => {
            let color = longLat.get(v)['c']
            selected.set(v, true)

            if (color == "france") color = "blue"
            if (color == "germany") color = "orange"
            if (color == "spain") color = "red"
            if (color == "italy") color = "green"
            if (color == "swiss") color = "white"

            k.style.fill = color
        }) 

        console.log(greyedOut)
    }

    var projection = d3.geoMercator()
    .center([2, 47])                // GPS of location to zoom on
    .scale(1000)                       // This is like the zoom
    .translate([ w5/2, h5/2 ])

    Promise.all([
        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", (e) => {
          //  data.set(d.State, +d.Unemployed_2019)
        })
        ]).then(function(loadData){
            console.log(loadData)
            let topo = loadData[0]
            topo.features = topo.features.filter(d => { 
                return d.properties.name=="France" 
                || d.properties.name=="Germany"
                || d.properties.name=="Austria"
                || d.properties.name=="Spain"
                || d.properties.name=="Portugal"
                || d.properties.name=="Italy"
                || d.properties.name=="Belgium"
                || d.properties.name=="Switzerland"
                || d.properties.name=="Luxembourg"
                || d.properties.name=="Netherlands"
                || d.properties.name=="Czech Republic"
                || d.properties.name=="England"

            })


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
            .style("height", "650px")
            .style("width", "300px")
            
            
            

            let onClick = (el) => {
                let bool = !selected.get(el.target.__data__.station)
                selected.set(el.target.__data__.station, bool)
                if (!bool) {
                    el.target.style.fill = "grey"
                    greyedOut.set(el.target.__data__.station, el.target)

                    avgDelayData.forEach((elem) => {
                        if (elem.station == el.target.__data__.station) {
                            let index = avgDelayData.indexOf(elem)
                            if (index > -1) avgDelayData.splice(index, 1)
                        }
                    })
                    d3.select("#svg4").selectAll('*').remove();
                    lolliPop.draw(avgDelayData)
                } else {
                    let color = longLat.get(el.target.__data__.station)['c']


                    if (color == "france") color = "blue"
                    if (color == "germany") color = "orange"
                    if (color == "spain") color = "red"
                    if (color == "italy") color = "green"
                    if (color == "swiss") color = "white"

                    el.target.style.fill = color
                    let delay = keepData.get(el.target.__data__.station)

                    avgDelayData.push({station: el.target.__data__.station, delay: delay})
                    d3.select("#svg4").selectAll('*').remove();
                    lolliPop.draw(avgDelayData)
                }
                reData()
            }
        
        
            let mouseover = (el) => {
                tooltip.style("opacity", 1)
                tooltip.html('<img src=' + imageMap.get(el.target.__data__.station) + ' width=300 heigth=100 /> Station: ' + el.target.__data__.station  + "</br>"
                + "Distance: " + parseInt(el.target.__data__.travel) + "min to " +  el.target.__data__.to)
                .style("left", (el.clientX + 30) + "px")
                .style("top", (el.clientY - 50) + "px")
            
            }
        
            let mousemove = (el) => {
                console.log(el.target.__data__)
                
                tooltip.html('<img src=' + imageMap.get(el.target.__data__.station) + ' width=300 heigth=100 /> Station: ' + el.target.__data__.station  + "</br>"
                + "Distance: " + parseInt(el.target.__data__.travel) + "min to " +  el.target.__data__.to
                + "<svg id=tooltipGraph width=300 height=300 />")
                .style("left", (el.clientX + 30) + "px")
                .style("top", (el.clientY - 50) + "px")
                

                let svgt = d3.select("#tooltipGraph")
                let wt = svgt.attr("width") - 100
                let ht = svgt.attr("height") - 100
                let dt = el.target.__data__.typeDelay

                tooltip
                .style("width", "300px")
                .style("height", "650px")

                let y = d3.scaleBand().range([ht, 0]).domain(dt.map((d) => { return d.type; })).padding(0.1)
                let x = d3.scaleLinear().range([0, wt]).domain([0, d3.max(dt, (d) => {return +d.delay})])
            
                let g = svgt.append("g")
                .attr("transform", "translate(" + 70 + "," + 20 + ")")
            
                g.append("g")
                .attr("transform", "translate(0," + (wt) + ")")
                .call(d3.axisBottom(x)
                .tickFormat((d) => { return d})
                .ticks(5))
                .append("text")
                .text("")
                .attr("text-anchor", "end")
                .attr("stroke", "black")
                
                g.append("g")
                .call(d3.axisLeft(y)
                )
                .append("text")
                .text("")
                .attr("text-anchor", "end")
                .attr("stroke", "black")
                
            
                g.selectAll("bars")
                .data(dt)   
                .enter().append("rect")
                .style("fill", el.target.attributes.style.value.split(":")[1].slice(0,-1))
                .style("border-width", "10px")
                .style("border-color", "black")
                .style("border-style", "solid")
                .attr("x", 0)
                .attr("y", (d) => {return y(d.type )})
                .attr("width", (d) => { return x(d.delay) })
                .attr("height", y.bandwidth())               
            }
        
            let mouseout = (el) => {
                tooltip.style("opacity", 0)
                .style("width", 0)
                .style("height", 0)
                .style("left", (0) + "px")
                .style("top", (0) + "px")
        
            }

          
        
        
            // Draw the map
          svg5.append("g")
            .selectAll("path")
            .data(topo.features)
            .join("path")
              .attr("d", d3.geoPath()
                .projection(projection)
              )
              .attr("fill", function (d) {
                return "grey"
              })


              svg5.selectAll(".markers")
              .data(nodes)
              .enter()
              .append("circle")
              .attr("r", (d) => {
                return 3
              })
              .style("fill", (d) => {
                let color = longLat.get(d.station)['c']


                if (color == "france") color = "blue"
                if (color == "germany") color = "orange"
                if (color == "spain") color = "red"
                if (color == "italy") color = "green"
                if (color == "swiss") color = "white"

                  return color
              })
              .attr("stroke", "black")
              .attr("transform", (d) => {
                let s = d.station
                d = longLat.get(s)
                let p = projection([d.lon,d.lat])

               
                    if (s.includes("PARIS")){
                        console.log("oui")
                        return `translate(${p[0] + Math.random()*15}, ${p[1] + Math.random()*15})`
                    }
                
                  return `translate(${p[0]}, ${p[1]})`
               })
               .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseout", mouseout)
                .on("click", onClick)



    
            d3.select('g')
            .selectAll('line')
            .data(links)
            .join('line')
            .attr('stroke', 'white')
            .attr('stroke-width', (d) => {return 0.5})
            .attr('stroke-dasharray', (d) => {return 2.2})
            .attr('stroke-linejoin', "round")
            .style("fill", "red")

            .style("opacity", 1)
            .attr('x1', (d) => {
                d = longLat.get(d.station)
                let p = projection([d.lon,d.lat])

                return p[0]
            })
            .attr('y1', (d) => {
                d = longLat.get(d.station)
                let p = projection([d.lon,d.lat])

                return p[1]})
            .attr('x2', (d) => {
                d = longLat.get(d.to)
                let p = projection([d.lon,d.lat])

                return p[0]})
            .attr('y2', (d) =>{
                d = longLat.get(d.to)
                let p = projection([d.lon,d.lat])

                return p[1]})
                
           
             
        })
    }
}