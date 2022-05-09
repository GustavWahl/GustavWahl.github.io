export default class DataStore {
    constructor() {}
 

loadData = () => {

    return new Promise((resolve,reject)=>{
        //here our function should be implemented 
            

    d3.csv("fixedTrainData.csv").then((dt) => {

        
        let newMap = new Map()
        let histMap = new Map()
    
    
        let avgCountMap = new Map()
        let stationDelay = new Map()
    
        // Average delay of late arriving trains (min)
        // Arrival station
        this.dt = dt
    
        for (let i = 0; i < dt.length; i++) {
            const element = dt[i]
            let arrivalSt = element['Arrival station']
    
            
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
    
            let delay = parseFloat(element['Average delay of late arriving trains (min)'])
            
    
            if (stationDelay.has(arrivalSt)) {
    
                let val = stationDelay.get(arrivalSt)
                let val2 = avgCountMap.get(arrivalSt)
    
                if (!isNaN(delay) ) {
                    stationDelay.set(arrivalSt, parseFloat(delay) + val)
                    avgCountMap.set(arrivalSt, val2 + 1)
                }
    
            } else {
                if (!isNaN(delay)) {
                    stationDelay.set(arrivalSt, parseFloat(delay))
                    avgCountMap.set(arrivalSt, 1)
                }
            }
        }
    
 
    
        let avgDelayData = []
        let i = 0;
    
        stationDelay.forEach((v, k) => {
            let obj = {"station" : k, 
            "delay": parseFloat(v / avgCountMap.get(k)).toFixed(1),
            }
    
            avgDelayData[i++] = obj
        })
    
    
        let newData = []
        let histogramData = []
         i = 0;
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
        
        this.avgDelayData = avgDelayData
        this.newData = newData
        this.histogramData = histogramData
    
    
    
        /*
            Tooltip with barchart of cummulative values for station
    
            {typeDelay:  external causes, num: 100}
            {typeDelay:  passenger, num: 100}
            {typeDelay:  infrastructure, num: 100}
            {typeDelay:  station managment, num: 100}
            {typeDelay:  traffic managment, num: 100}
    
    
            % trains late due to external causes (weather, obstacles, suspicious packages, malevolence, social movements, etc.): "0.282608695652"
            % trains late due to passenger traffic (affluence, PSH management, connections): "0.0434782608696"
            % trains late due to railway infrastructure (maintenance, works): "0.0869565217391"
            % trains late due to rolling stock: "0.282608695652"
            % trains late due to station management and reuse of material: "0.108695652174"
            % trains late due to traffic management (rail line traffic, network interactions): "0.195652173913"
    
        */
    
    
        let nodesSet = new Set()
        let nodes = [];
    
    
        let LinkSet = new Set()
    
        let links = []
        
        //http://bl.ocks.org/eggchul/4f7b66224adecb2796f685447cd12448
        //used as reference and https://www.d3indepth.com/force-layout/
        dt.forEach(element => {
            if (!nodesSet.has(element.source)) {
                nodesSet.add(element.source)
                nodes.splice(parseInt(element.source), 0,{id: parseInt(element.source),
                    station: element['Departure station'],
                    cancelled: element['Number of cancelled trains'],
                    travel: element['Average travel time (min)'],
                    to: element['Arrival station'],
                    links: [],
                    typeDelay: [
                        {type: 'external', delay: element['% trains late due to external causes (weather, obstacles, suspicious packages, malevolence, social movements, etc.)']},
                        {type: 'passenger', delay: element['% trains late due to passenger traffic (affluence, PSH management, connections)']},
                        {type: "infrastructure", delay: element['% trains late due to railway infrastructure (maintenance, works)']},
                        {type: "managment", delay: element['% trains late due to station management and reuse of material']},
                        {type: "traffic", delay: element['% trains late due to traffic management (rail line traffic, network interactions)']}
                    ]
                })
            }
        
            
    
            if (!LinkSet.has([parseInt(element.source), parseInt(element.target)].toString()) 
                && !LinkSet.has([parseInt(element.target),parseInt(element.source)].toString())) {
                LinkSet.add([parseInt(element.source), parseInt(element.target)].toString())
                LinkSet.add([parseInt(element.target), parseInt(element.source)].toString())
    
                links.push({source: parseInt(element.source), target: parseInt(element.target), 
                    travel: element['Average travel time (min)']
                , station: element['Departure station'],
                to: element['Arrival station']})
            }
        });


        this.nodes = nodes
        this.links = links

    let imageMap = new Map()
    imageMap.set("MARNE LA VALLEE", "https://bonjourlafrance.com/wp-content/uploads/2018/03/463_Marne-la-Vallee-Train-Station.jpg")
    imageMap.set("STUTTGART", "https://upload.wikimedia.org/wikipedia/commons/4/46/Neues_Schloss_Schlossplatzspringbrunnen_Jubil%C3%A4umss%C3%A4ule_Schlossplatz_Stuttgart_2015_02.jpg")
    imageMap.set("MONTPELLIER", "https://a.cdn-hotels.com/gdcs/production165/d1785/eee22671-d084-4924-889c-7ae36427bcf3.jpg")
    imageMap.set("VANNES", "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/10/68/90/98/centre-historique-de.jpg?w=600&h=400&s=1")
    imageMap.set("LAUSANNE", "https://static.standard.co.uk/s3fs-public/thumbnails/image/2020/02/21/10/GettyImages-1142087108.jpg?width=968")
    imageMap.set("PARIS VAUGIRARD", "https://c8.alamy.com/comp/T4B9G4/top-view-of-paris-skyline-from-above-timelapse-main-landmarks-of-european-megapolis-with-train-station-of-vaugirard-belt-T4B9G4.jpg")
    imageMap.set("REIMS", "https://media.tacdn.com/media/attractions-content--1x-1/0b/39/94/21.jpg")
    imageMap.set("MADRID", "https://static.onecms.io/wp-content/uploads/sites/28/2021/06/08/madrid-spain-MADRIDTG0621.jpg")
    imageMap.set("BARCELONA", "https://img.static-af.com/images/media/26743379-B7FE-440F-8E524E30B13E20D3/")
    imageMap.set("NICE VILLE", "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Nizza-C%C3%B4te_d%27Azur.jpg/1200px-Nizza-C%C3%B4te_d%27Azur.jpg")
    imageMap.set("LILLE", "https://www.tripsavvy.com/thmb/SbcYJb0lkN8ZGsf7APiconPdksw=/2000x1333/filters:fill(auto,1)/lillemainsquareLaurent-Ghesquiere-Lille-56a3a9875f9b58b7d0d317f7.jpg")
    imageMap.set("NANTES", "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/33/f7/3a/nantes.jpg?w=700&h=500&s=1")
    imageMap.set("TOURCOING", "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/93/2a/c2/tres-bel-edifice.jpg?w=500&h=400&s=1")
    imageMap.set("GRENOBLE", "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0d/63/43/8b/20161021-144028-largejpg.jpg?w=700&h=500&s=1")
    imageMap.set("GENEVE", "https://www.christiesrealestate.com/localimagereader.ashx?imageurl=siteresources%2Fmy%20folder%2Fimages%2Farticles%2Fgeneva-switzerland-global-center-finance-diplomacy-culture%2Fgeneva%20(3).jpg&imagecache=true")
    imageMap.set("TOULON", "https://www.planetware.com/photos-large/F/france-toulon-vieille-ville.jpg")
    imageMap.set("ST PIERRE DES CORPS", "https://cdn.getyourguide.com/img/location/5a1d3463a7e31.jpeg/68.jpg")
    imageMap.set("MULHOUSE VILLE", "https://media-cdn.tripadvisor.com/media/photo-s/14/e2/a3/09/hotel-de-ville-and-main.jpg")
    imageMap.set("RENNES", "https://cdn.britannica.com/62/143062-050-400A8E5C/buildings-Rennes-France.jpg")
    imageMap.set("PARIS NORD", "https://cdn.travelpulse.com/images/faa9edf4-a957-df11-b491-006073e71405/c0594e9a-dd27-41b9-b02b-0c0362deadce/600x400.jpg")
    imageMap.set("NIMES", "https://www.historyhit.com/app/uploads/fly-images/5149870/Nimes-Arena-e1633702862401-690x388-c.jpg?x37902")
    imageMap.set("ST MALO", "https://images.adsttc.com/media/images/5a85/7d67/f197/ccbd/8c00/01de/newsletter/RWLNIEo2.jpg?1518697826")
    imageMap.set("ARRAS", "https://digital.ihg.com/is/image/ihg/holiday-inn-express-arras-6012863361-2x1?wid=940&hei=470&qlt=85,0&resMode=sharp2&op_usm=1.75,0.9,2,0")
    imageMap.set("DIJON VILLE", "https://theculturetrip.com/wp-content/uploads/2017/03/place-darcy-3--ville-de-dijon.jpg")
    imageMap.set("PARIS LYON", "https://images.adsttc.com/media/images/5d44/14fa/284d/d1fd/3a00/003d/large_jpg/eiffel-tower-in-paris-151-medium.jpg?1564742900")
    imageMap.set("LAVAL", "https://a.travel-assets.com/findyours-php/viewfinder/images/res70/106000/106716-Laval.jpg?impolicy=fcrop&w=360&h=224&q=mediumLow")
    imageMap.set("DOUAI", "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/04/1d/8a/6a/cour-d-honneur.jpg?w=500&h=400&s=1")
    imageMap.set("MACON LOCHE", "https://www.wine-searcher.com/images/region/macon-loche-5670-1-3.jpg")
    imageMap.set("ANGERS SAINT LAUD", "https://www.austinchronicle.com/imager/b/original/2273191/034f/dbh-adayin_angers_france-072118-04.jpg")
    imageMap.set("BELLEGARDE (AIN)", "https://www.francethisway.com/images/places/annecy.jpg")
    imageMap.set("CHAMBERY CHALLES LES EAUX", "https://sematicweb.detie.cn/stations/38DJ93/Chambe%CC%81ry_Challes_Les_Eaux_building.jpeg-hq")
    imageMap.set("ANGOULEME", "https://images.ctfassets.net/zfxytrk6nf7m/6tEoP1O12jUDoX3QONe96t/6005ac7ffb535b7e55cb1dc5858006d0/angouleme-ville-haute.jpg?w=1200&h=630&q=90&fl=progressive&fit=fill")
    imageMap.set("BORDEAUX ST JEAN", "https://images.ctfassets.net/iv9w9q8xwqpv/6NwVmoz634tJPRyVKCwkPd/4d8f46a21a5364eba78f54afbd9a6af6/place-Bordeaux-cropped.jpg")
    imageMap.set("POITIERS", "https://upload.wikimedia.org/wikipedia/commons/4/4d/Poitiers_hill.jpg")
    imageMap.set("VALENCE ALIXAN TGV", "https://media.istockphoto.com/photos/panoramic-views-of-valence-france-picture-id1177286643?k=20&m=1177286643&s=170667a&w=0&h=43-sIKttmDvA6n7Wp7pqMeOVih5CIblLJMQ1APBJT6I=")
    imageMap.set("PERPIGNAN", "https://image.arrivalguides.com/415x300/10/6395584b14055934e5c27d0e03e0f2fe.jpg")
    imageMap.set("AVIGNON TGV", "https://d3dqioy2sca31t.cloudfront.net/Projects/cms/production/000/027/454/medium/034649a4e9712bdace8f5116903cb14b/france-avignon-palace-022020-rs.jpg")
    imageMap.set("QUIMPER", "https://francetravelblog.com/wp-content/uploads/2020/10/What-Is-Quimper-Famous-For.jpg")
    imageMap.set("TOULOUSE MATABIAU", "https://www.thegeographicalcure.com/wp-content/uploads/2021/10/img_61643ca505587.")
    imageMap.set("ZURICH", "https://cw-gbl-gws-prod.azureedge.net/-/media/cw/emea/switzerland/zurich-generic-card-750x456.jpg?rev=a20098b7f51c4a2a950b9ee75a949d3d")
    imageMap.set("LA ROCHELLE VILLE", "https://www.holidays-la-rochelle.co.uk/sites/default/files/inline-images/centre-historique-la-rochelle-francis-giraudon.jpg")
    imageMap.set("STRASBOURG", "https://a.cdn-hotels.com/gdcs/production59/d1337/3794b7dc-0609-4883-9ad2-51368c2e2c21.jpg?impolicy=fcrop&w=800&h=533&q=medium")
    imageMap.set("LE CREUSOT MONTCEAU MONTCHANIN", "https://www.creusotmontceautourisme.fr/sites/creusot-montceau/files/styles/ratio_16_10/public/page/belvedere012020-05-07dji0003xspertini_0.jpg?itok=NhQpGYBQ")
    imageMap.set("ITALIE", "https://www.airtransat.com/getmedia/2f0d2e99-30ab-45fc-886c-a70427f498fd/italie-cinque-terre-italy-1000x600.aspx")
    imageMap.set("NANCY", "https://upload.travelawaits.com/ta/uploads/2021/04/views-from-downtown-nancy-frad8cf7-800x800.jpg")
    imageMap.set("LE MANS", "https://cdn.britannica.com/34/41134-004-755BD319/Saint-Julien-Cathedral-Le-Mans-France.jpg")
    imageMap.set("BREST", "https://www.sncf-connect.com/assets/styles/scale_max_width_961/public/media/2018-12/istock-827141922.jpg?itok=P3xtemiQ")
    imageMap.set("PARIS MONTPARNASSE", "https://cdn.getyourguide.com/img/tour/61557a653afbd.jpeg/146.jpg")
    imageMap.set("PARIS EST", "https://www.seat61.com/images/Paris-est-wide2.jpg")
    imageMap.set("SAINT ETIENNE CHATEAUCREUX", "https://upload.wikimedia.org/wikipedia/commons/f/f3/Gare_de_Saint_Etienne_Chateaucreux_10-03-05.jpg")
    imageMap.set("ANNECY", "https://www.planetware.com/wpimages/2019/10/france-annecy-top-attractions-palais-de-iile.jpg")
    imageMap.set("TOURS", "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/15/4d/43/cf/tours.jpg?w=700&h=500&s=1")
    imageMap.set("FRANCFORT", "https://hospitality-on.com/sites/default/files/styles/image994x499/public/import/contenu/Francfort_NH_Hotels_nhow.jpg?h=f317857b&itok=0mt5FYe1")
    imageMap.set("MARSEILLE ST CHARLES", "https://ychef.files.bbci.co.uk/976x549/p0bml6l9.jpg")
    imageMap.set("DUNKERQUE", "https://images.contentstack.io/v3/assets/blte031836cf13220c5/blta3eced90395bd331/5fbdce4009ed4c6f277f017e/Dunkerque.jpg?auto=webp&format=pjpg&quality=80&width=720&height=720&fit=crop&crop=640:720,smart")
    imageMap.set("METZ", "https://media.istockphoto.com/photos/cityscape-scenic-view-of-saint-stephen-cathedrla-in-metz-city-at-picture-id1185897259?k=20&m=1185897259&s=612x612&w=0&h=yo1IwoCCbeHWSQZPnW8kXnMxIgIlTJSokHzZWudpluo=")
    imageMap.set("BESANCON FRANCHE COMTE TGV", "https://qtxasset.com/quartz/qcloud1/media/image/Luxury%20Travel%20Advisor-1509555093/Besancon%20La%20Boucle%20de%20Besancon.jpg/Besancon%20La%20Boucle%20de%20Besancon.jpg?VersionId=7oqJfzQ3tkv5xUP3VLmFZvkUxei36Rae")
    imageMap.set("AIX EN PROVENCE TGV", "https://content.r9cdn.net/rimg/dimg/08/93/7d8866cc-city-21178-16db9c4234f.jpg?crop=true&width=1366&height=768&xhint=3996&yhint=2161")
    imageMap.set("LYON PART DIEU", "https://cdn.kimkim.com/files/a/content_articles/featured_photos/e9d2d8f563a255a6f1a91949d3e07f69678a12b6/big-25b2973dd9376665ccbaf103d7e44275.jpg")
    
    this.imageMap = imageMap




    let longLat = new Map()
    longLat.set("MARNE LA VALLEE", {lat: 48.859276, lon: 2.598505, c: "france"})
    longLat.set("STUTTGART", {lat: 48.783333, lon: 9.183333, c: "germany"})
    longLat.set("MONTPELLIER", {lat: 43.611900, lon: 3.877200, c: "france"})
    longLat.set("VANNES", {lat: 47.658236, lon: -2.760847, c: "france"})
    longLat.set("LAUSANNE", {lat: 46.5196535, lon: 6.6322734, c: "swiss"})
    longLat.set("PARIS VAUGIRARD", {lat: 48.839649, lon: 2.301491, c: "france"})
    longLat.set("REIMS", {lat: 49.262798, lon: 4.034700, c: "france"})
    longLat.set("MADRID", {lat: 40.416775, lon: -3.703790, c: "spain"})
    longLat.set("BARCELONA", {lat:  41.390205, lon: 2.154007, c: "spain"})
    longLat.set("NICE VILLE", {lat: 43.7101728, lon: 7.2619532, c: "france"})
    longLat.set("LILLE", {lat: 50.629250, lon: 3.057256, c: "france"})
    longLat.set("NANTES", {lat: 47.218371, lon: -1.553621, c: "france"})
    longLat.set("TOURCOING", {lat: 50.723907, lon: 3.161168, c: "france"})
    longLat.set("GRENOBLE", {lat: 45.188529, lon: 5.724524, c: "france"})
    longLat.set("GENEVE", {lat: 46.2043907, lon: 6.1431577, c: "swiss"})
    longLat.set("TOULON", {lat: 43.124228, lon: 5.928, c: "france"})
    longLat.set("ST PIERRE DES CORPS", {lat: 47.38623, lon: 0.74849, c: "france"})
    longLat.set("MULHOUSE VILLE", {lat: 47.7486, lon: 7.33944, c: "france"})
    longLat.set("RENNES", {lat: 48.114700, lon: -1.679400, c: "france"})
    longLat.set("PARIS NORD", {lat: 48.880931, lon: 2.355323, c: "france"})
    longLat.set("NIMES", {lat: 43.838001, lon: 4.361000, c: "france"})
    longLat.set("ST MALO", {lat: 48.648102, lon: -2.007500, c: "france"})
    longLat.set("ARRAS", {lat: 50.292000, lon: 2.780000, c: "france"})
    longLat.set("DIJON VILLE", {lat: 47.322047, lon: 5.04148, c: "france"})
    longLat.set("PARIS LYON", {lat: 48.844304, lon: 2.374377, c: "france"})
    longLat.set("LAVAL", {lat: 48.0785146, lon: -0.7669906, c: "france"})
    longLat.set("DOUAI", {lat: 50.3667, lon: 3.0667, c: "france"})
    longLat.set("MACON LOCHE", {lat: 46.2833, lon: 4.7667, c: "france"})
    longLat.set("ANGERS SAINT LAUD", {lat: 47.458831498, lon: -0.55416445, c: "france"})
    longLat.set("BELLEGARDE (AIN)", {lat: 46.1, lon: 5.816667, c: "france"})
    longLat.set("CHAMBERY CHALLES LES EAUX", {lat: 45.552381, lon: 5.983246, c: "france"} )
    longLat.set("ANGOULEME", {lat: 45.648377, lon: 0.1562369, c: "france"})
    longLat.set("BORDEAUX ST JEAN", {lat: 44.823462, lon: -0.556514, c: "france"})
    longLat.set("POITIERS", {lat: 46.580224, lon: 0.340375, c: "france"})
    longLat.set("VALENCE ALIXAN TGV", {lat: 44.974, lon: 5.026, c: "france"})
    longLat.set("PERPIGNAN", {lat: 42.6886591, lon: 2.8948332, c: "france"})
    longLat.set("AVIGNON TGV", {lat: 43.949318, lon: 4.805528, c: "france"})
    longLat.set("QUIMPER", {lat: 47.997542, lon: 4.097899, c: "france"})
    longLat.set("TOULOUSE MATABIAU", {lat: 43.604652, lon: 	1.444209, c: "france"})
    longLat.set("ZURICH", {lat: 47.373878, lon: 8.545094, c: "swiss"})
    longLat.set("LA ROCHELLE VILLE", {lat: 47.747, lon: 5.732 , c: "france"})
    longLat.set("STRASBOURG", {lat: 48.580002, lon: 7.750000, c: "france"})
    longLat.set("LE CREUSOT MONTCEAU MONTCHANIN", {lat: 46.8009642, lon: 4.4391947, c: "france"})
    longLat.set("ITALIE", {lat: 41.8719, lon: 12.5674, c: "italy"})
    longLat.set("NANCY", {lat: 	48.692055, lon: 6.184417, c: "france"})
    longLat.set("LE MANS", {lat: 48.008224, lon: 0.209856, c: "france"})
    longLat.set("BREST", {lat: 48.389999, lon: 4.490000, c: "france"})
    longLat.set("PARIS MONTPARNASSE", {lat: 48.841, lon: 2.3203, c: "france"})
    longLat.set("PARIS EST", {lat: 48.864716, lon: 2.349014, c: "france"})
    longLat.set("SAINT ETIENNE CHATEAUCREUX", {lat: 45.434700, lon: 4.390300, c: "france"})
    longLat.set("ANNECY", {lat: 45.916000, lon: 6.133000, c: "france"})
    longLat.set("TOURS", {lat: 	47.243599, lon: 0.689200, c: "france"})
    longLat.set("FRANCFORT", {lat: 50.110924, lon: 8.682127, c: "germany"})
    longLat.set("MARSEILLE ST CHARLES", {lat: 43.296398, lon: 5.370000, c: "france"})
    longLat.set("DUNKERQUE", {lat: 51.034368, lon: 2.376776, c: "france"})
    longLat.set("METZ", {lat: 49.120277, lon: 6.177778, c: "france"})
    longLat.set("BESANCON FRANCHE COMTE TGV", {lat: 47.240002, lon: 6.020000, c: "france"})
    longLat.set("AIX EN PROVENCE TGV", {lat: 43.529742, lon: 5.447427, c: "france"})
    longLat.set("LYON PART DIEU", {lat: 45.7611438, lon: 4.8593999, c: "france"})
    
    this.longLat = longLat




    resolve();
    })


    
      
     
    })
}

}