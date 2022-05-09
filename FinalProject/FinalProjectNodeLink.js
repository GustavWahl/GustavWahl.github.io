
export default class NodeLink {
    constructor(dataSet) {
    this.avgDelayData = dataSet;  
 }


draw = (imageMap, nodes, links) => {  


    let svg = d3.select("svg")
    let w = svg.attr("width") - 200
    let h = svg.attr("height") - 200


    svg.append("text")
    .attr("x", 100)
    .attr("y", 50)
    .attr("font-size", "20px")
    .text("Node link tree")


    let g = svg.append("g")
    .attr("transform", "translate(" + 100 + "," + 100 + ")")
    

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
    .style("height", "350px")
    .style("width", "300px")
    



    let mouseover = (el) => {
        tooltip.style("opacity", 1)
        .style("left", (el.clientX) + "px")
        .style("top", (el.clientY - 50) + "px")
    
    }

    let mousemove = (el) => {
        console.log(el.target.__data__)
        tooltip.html('<img src=' + imageMap.get(el.target.__data__.station) + ' width=300 heigth=100 /> Station: ' + el.target.__data__.station  + "</br>"
        + "Distance: " + parseInt(el.target.__data__.travel) + "min from " +  el.target.__data__.from)
        .style("left", (el.clientX + 30) + "px")
        .style("top", (el.clientY - 50) + "px")
    }

    let mouseout = (el) => {
        tooltip.style("opacity", 0)
        .style("left", (el.clientX + 30) + "px")
        .style("top", (el.clientY - 50) + "px")

    }



    const scale = d3.scaleOrdinal(d3.schemeCategory10);

    let simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength((d) => {return - d.travel}))
        .force('center', d3.forceCenter(w / 4, h / 4 ))
        .force('link', d3.forceLink().links(links))
        .force("collide",d3.forceCollide().radius((d) =>  {return 10}))
        .on('tick', () => {

        d3.select('g')
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke', 'grey')
        .attr('stroke-width', (d) => {return d.travel / 30})
        .style("opacity", 0.5)
        .attr('x1', (d) => {return d.source.x})
        .attr('y1', (d) => {return d.source.y})
        .attr('x2', (d) => {return d.target.x})
        .attr('y2', (d) =>{return d.target.y})

        d3.select('g').selectAll("text")
            .data(links)
            .join('text')
            .attr("class", "label")
            .attr('dx', (d) => {return (d.source.x + d.target.x) / 2})
            .attr('dy', (d) => {return (d.source.y + d.target.y) / 2})
        
        //   .text(function(d) { return parseInt(d.travel) + "m"})

        let circle = d3.select('g')
        .selectAll('circle')
            .data(nodes)
            .join('circle')
            .attr("fill", (d) =>{return scale(d.id)})
            .attr('r', (d) => {return  6})
            .attr('cx', (d) => {return d.x})
            .attr('cy',(d) => {return d.y})
            .on("mouseover", mouseover)
            .on("mousemove", mousemove)
            .on("mouseout", mouseout)
            
    /*
        d3.select('g').selectAll("text")
            .data(nodes)
            .join('text')
            .attr("class", "label")
            .attr('dx', (d) => {return d.x })
            .attr('dy',(d) => {return d.y - 4})
            .text(function(d) { return d.station; })
    */
    /*   d3.select('g').selectAll("image")
            .data(nodes)

            .join("image")
            .attr("xlink:href", (d) => {return imageMap.get(d.station)})
            .attr('x', (d) => {return d.x - 8})
            .attr('y',(d) => {return d.y -8})
            .attr("width", 24)
            .attr("height", 24)*/
       
       
     })

    }
}