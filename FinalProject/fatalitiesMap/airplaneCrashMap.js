d3.csv("Airplane_Crashes_and_Fatalities_Since_1908.csv").then((dt) => {
    d3.csv("states.csv").then((states) => {


    console.log(dt)

    d = []

    for (let i = 0; i < dt.length; i++) {
     obj = {"date" : d3.timeParse("%d/%M/%Y")(dt[i].Date), 
     "time": dt[i].Time,
     "location": dt[i].Location.split(", ")[1],
     "dead": dt[i].Fatalities,
     "plane": dt[i].Type
    }

     d[i] = obj
    }


    dataAirbus = []
    dataBoeing = []
    i = 0
    j = 0

    for ( elem in d) {
        let plane = d[elem]['plane']
        plane = plane + ""

        if (plane.includes('Airbus')) {
            dataAirbus[i++] = d[elem]
        }

        if (plane.includes('Boeing')){
            dataBoeing[j++] = d[elem]
        }
    }


    let map = new Map()

    for (i in dataBoeing) {
        let key = dataBoeing[i]['location'] + ""

        if (map.get(key) != null) {
            let count = map.get(key)
            map.set(key, count + parseInt(dataBoeing[i]['dead']))
        } else {
            map.set(key, parseInt(dataBoeing[i]['dead']))
        }
    }

    dataBoeing = []
    i = 0

    map.forEach((k, v) => {
        states.forEach((state) => {
            if (v == state['State']){
                dataBoeing[i++] = {state: state['Abbreviation'], count: k}
            }
        })
    })


    map = new Map()

    for (i in dataAirbus) {
        let key = dataAirbus[i]['location'] + ""

        if (map.get(key) != null) {
            let count = map.get(key)
            map.set(key, count + parseInt(dataAirbus[i]['dead']))
        } else {
            map.set(key, parseInt(dataAirbus[i]['dead']))
        }
    }

    dataAirbus = []
    i = 0

    map.forEach((k, v) => {
        states.forEach((state) => {
            if (v == state['State']){
                if (k != 0) {
                    dataAirbus[i++] = {state: state['Abbreviation'], count: k}
                }
            }
        })
    })


    
    let svg = d3.select("svg")
    let w = svg.attr("width") - 200
    let h = svg.attr("height") - 200
    

     svg.append("text")
    .attr("x", 300)
    .attr("y", 30)
    .attr("font-size", "20px")
    .text("Airplane Crash Boeing US")



    const path = d3.geoPath();
    const projection = d3.geoMercator()
    .scale(350)
    .center([-120,60])
    .translate([w / 2, h / 2]);

 data = new Map()
const colorScale = d3.scaleLinear()
  .domain([0, 50, 100, 150, 300, 500, 700])
  .range(d3.schemeReds[6]);


  svg.append("g")
  .attr("transform", "translate(" + 700 + "," + 100 + ")")
  .attr("class", "legend")
  .append("text")
  .attr("y", -20)
  .attr("stroke", "black")
  .text("fatalities")


   let colorLeg = d3.legendColor()
   .shape("path", d3.symbol().type(d3.symbolCircle)
   .size(1))
   .shapePadding(2)
   .scale(colorScale)


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
    .style("height", "45px")
    .style("width", "150px")



    let mouseover = (el) => {
        tooltip.style("opacity", 1)
        .style("left", (el.clientX) + "px")
        .style("top", (el.clientY - 50) + "px")
     
    }

    let mousemove = (el) => {
        console.log(el)
        tooltip.html('state: ' + el.target.__data__.id + '<br/>num fatalities: ' + el.target.__data__.total  )
        .style("left", (el.clientX + 30) + "px")
        .style("top", (el.clientY - 50) + "px")
    }

    let mouseout = (el) => {
        tooltip.style("opacity", 0)
        .style("left", (el.clientX + 30) + "px")
        .style("top", (el.clientY - 50) + "px")

    }


  //used this as reference https://d3-graph-gallery.com/graph/choropleth_basic.html

Promise.all([
d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson", (e) => {
    data.set(d.State, +d.Unemployed_2019)
})
]).then(function(loadData){
    console.log(loadData)
    let topo = loadData[0]
    topo.features = topo.features.filter(d => { return d.properties.name=="USA"})

    // Draw the map
  svg.append("g")
    .selectAll("path")
    .data(topo.features)
    .join("path")
      .attr("d", d3.geoPath()
        .projection(projection)
      )
      .attr("fill", function (d) {
        return "grey"
      })
})


Promise.all([
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/AL.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/AK.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/AR.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/AZ.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/CA.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/CO.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/CT.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/DC.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/DE.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/FL.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/GA.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/HI.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/HI.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/IA.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/ID.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/IL.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/IN.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/KS.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/KY.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/LA.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/MA.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/MD.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/ME.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/MI.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/MN.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/MO.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/MS.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/MT.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/NC.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/ND.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/NE.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/NH.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/NJ.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/NM.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/NV.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/NY.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/OH.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/OK.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/NY.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/OR.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/PA.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/PR.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/RI.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/SC.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/SD.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/TN.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/TX.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/UT.geo.json"),
    //d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/VA.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/VT.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/WA.geo.json"),
   d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/WI.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/WV.geo.json"),
    d3.json("https://raw.githubusercontent.com/johan/world.geo.json/master/countries/USA/WY.geo.json"),

    dataBoeing.forEach((d) => {
             if (data.get("USA-" + d.state) != null){
            let num = data.get("USA-" + d.state)
            if (!isNaN(num)) {
                let b = (+d.count)
                if (!isNaN(b)) {
                    data.set("USA-" + d.state, num + b)
                } else {
                    data.set("USA-" + d.state, num)
                }
            } else {
                data.set("USA-" + d.state,  (+d.count))
            }
      } else {
            data.set("USA-" + d.state, +d.count)
      }
    })
    ]).then(function(loadData){
        let topo = loadData   

        console.log(data)
    
        for (let i = 0; i < topo.length - 1; i++) {

            state = topo[i]
            svg.append("g")
                .selectAll("path")
                .data(state.features)
                .join("path")
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                .attr("fill", function (d) {
                    d.total = data.get(d.id) || 0;
                    return colorScale(d.total);
                })
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout)
        }
    })



})
})


