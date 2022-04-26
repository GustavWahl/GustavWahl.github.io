d3.csv("avgTmpCities.csv").then((data) => {


        let dt = []
    
        for (let i = 0; i < data.length; i++) {
            if (data[i]['City'] == 'Montreal') {
                let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'
            , 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        
            
            for (let j = month.length - 1; j >= 0; j--) {
                let m = data[i][month[j]].split('\n')[0]
                let obj = {}
                obj['tmp'] = m
                obj['city'] = data[i]['City']
                obj['month'] = month[j]
                
                dt.push(obj)
            }
            } 
        }
    
        let svg = d3.select("svg")
        let svg2 = d3.select("#blackhat")
        let w = svg.attr("width") - 200
        let h = svg.attr("height") - 200
        let w2 = svg2.attr("width") - 200
        let h2 = svg2.attr("height") - 200

        svg.append("text")
        .attr("x", 150)
        .attr("y", 50)
        .attr("font-size", "20px")
        .text("Average temperature in Montreal")
    
        let x = d3.scaleBand().range([0, w ]).domain(dt.map((d) => { return d.month; }))
        let y = d3.scaleLinear().range([h, 0]).domain([d3.min(dt, (d) => {return +d.tmp}), d3.max(dt, (d) => {return +d.tmp})])
    
    
        let g = svg.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
    
    
    
        g.append("g")
        .attr("transform", "translate(0," + (h) + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .text("Month")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("y", 40)
        .attr("x", 200)
        .attr("font-size", "16px")
    
    
    
    
        g.append("g")
        .call(d3.axisLeft(y)
        .tickFormat((d) => { return d})
        .ticks(5))
        .append("text")
        .text("tmp")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("y", 0)
        .attr("x", -40)
        .attr("font-size", "16px")
    
    
        g.append("path")
        .datum(dt)
        .attr("id", "close")
        .style("fill", "none")
        .style("stroke", "cadetblue")
        .style("stroke-width", 1.5)
     
       
        .attr("d", d3.line()
            .x((d) => {return x(d.month)})
            .y((d) => {return y(d.tmp)}))
    
           
     svg2.append("text")
        .attr("x", 150)
        .attr("y", 50)
        .attr("font-size", "20px")
        .text("Average temperature in Montreal")
    
         x = d3.scaleBand().range([0, w2 ]).domain(dt.map((d) => { return d.month; }))
        y = d3.scaleLinear().range([h2, 0]).domain([-50, 70])
    
    
        let g2 = svg2.append("g")
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
    
    
    
        g2.append("g")
        .attr("transform", "translate(0," + (h2) + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .text("Month")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("y", 40)
        .attr("x", 200)
        .attr("font-size", "16px")
    
    
    
    
        g2.append("g")
        .call(d3.axisLeft(y)
        .tickFormat((d) => { return d})
        .ticks(5))
        .append("text")
        .text("tmp")
        .attr("text-anchor", "end")
        .attr("stroke", "black")
        .attr("y", 0)
        .attr("x", -40)
        .attr("font-size", "16px")
    
        g2.append("path")
        .datum(dt)
        .attr("id", "close")
        .style("fill", "none")
        .style("stroke", "cadetblue")
        .style("stroke-width", 1.5)
     
       
        .attr("d", d3.line()
            .x((d) => {return x(d.month)})
            .y((d) => {return y(d.tmp)}))
    
           
        })
    
    