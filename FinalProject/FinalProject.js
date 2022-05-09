import TrainMap from './FinalProjectTrainMap.js'
import DataStore from './FinalProjectDataLoader.js'
import Histogram from './FinalProjectHistogram.js'
import Barchart from './FinalProjectBarChart.js'
import Lollipop from './FinalProjectLollipop.js'
import NodeLink from './FinalProjectNodeLink.js'



    let dataStore = new DataStore()
    await dataStore.loadData()
    let dt = dataStore.dt
    let avgDelayData =  dataStore.avgDelayData
    let histogramData = dataStore.histogramData
    let newData = dataStore.newData
    let nodes = dataStore.nodes
    let links = dataStore.links
    let imageMap = dataStore.imageMap
    let longLat = dataStore.longLat

   // let nodeLink = new NodeLink()
  //  nodeLink.draw(imageMap, nodes, links)

    let barchart = new Barchart()
    barchart.draw(newData)

    let histogram = new Histogram()
    histogram.draw(histogramData)

    let lolliPop = new Lollipop()
    lolliPop.draw(avgDelayData)

    let map = new TrainMap()
    map.drawMap(longLat, nodes, links, imageMap, avgDelayData, lolliPop, histogram, barchart, dt)
        // MAP

    
        


