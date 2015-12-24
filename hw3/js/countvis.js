/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */


/*
 *
 * ======================================================
 * We follow the vis template of init - wrangle - update
 * ======================================================
 *
 * */

/**
 * CountVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @param _eventHandler -- the Eventhandling Object to emit data to (see Task 4)
 * @constructor
 */
CountVis = function(_parentElement, _data, _metaData, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.eventHandler = _eventHandler;
    this.displayData = [];


    // TODO: define all "constants" here
	this.width = 650;
	this.height = 330;
	this.left_p = 80;
	this.bottom_p = 20;
	this.w = this.width - this.left_p;
	this.h = this.height - this.bottom_p;
	
	this.maxCount = d3.max(this.data, function(array) {return array.count;});
	this.xScale = d3.time.scale().range([this.left_p, this.width]).domain([this.data[0].time, this.data[this.data.length-1].time]);
	this.xScaleBrush = d3.time.scale().range([this.left_p, this.width]).domain([this.data[0].time, this.data[this.data.length-1].time]);
	this.yScale = d3.scale.pow().exponent(1).range([0, this.h]).domain([this.maxCount, 0]);
	
	
	this.cFunction = d3.svg.area()
						.x(function(d) { return this.xScale(d.time); })
						.y0(this.h)
						.y1(function(d) { return this.yScale(d.count); })
						.interpolate("step-after");
						
						
	this.xAxis = d3.svg.axis()
				.scale(this.xScale)
				.orient("bottom");
				
	this.yAxis = d3.svg.axis()
				.scale(this.yScale)
				.orient("left");

    this.initVis();
}

/**
 * Method that sets up the SVG and the variables
 */
CountVis.prototype.initVis = function(){

    var that = this; // read about the this



    //TODO: implement here all things that don't change
    //TODO: implement here all things that need an initial status
    // Examples are:
    // - construct SVG layout
    // - create axis
    // -  implement brushing !!
    // --- ONLY FOR BONUS ---  implement zooming

    // TODO: modify this to append an svg element, not modify the current placeholder SVG element
    this.svg = this.parentElement.append("svg")
		.attr("width", this.width)
		.attr("height", this.height);
		
	this.svg.append("g")
		.attr("class", "path")
		.append("path");
	this.svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0,"+this.h+")")
		.call(this.xAxis);
	this.svg.append("g")
		.attr("class", "axisY axis")
		.attr("transform", "translate("+this.left_p+",0)")
		.call(this.yAxis);
		
		
	var fromDay = d3.time.format("%Y-%m-%d")(that.data[0].time);
	var toDay = d3.time.format("%Y-%m-%d")(that.data[that.data.length-1].time);
	d3.select("#brushInfo").
		text(fromDay+" -> "+toDay);
		
	this.brush = d3.svg.brush()
		.x(this.xScaleBrush)
		.on("brush", function() {
			var extent = that.brush.extent();
			var fromDay = d3.time.format("%Y-%m-%d")(extent[0]);
			var toDay = d3.time.format("%Y-%m-%d")(extent[1]);
			if(fromDay == toDay) {
				fromDay = d3.time.format("%Y-%m-%d")(that.data[0].time);
				toDay = d3.time.format("%Y-%m-%d")(that.data[that.data.length-1].time);
			}
			d3.select("#brushInfo").
				text(fromDay+" -> "+toDay);
			$(that.eventHandler).trigger("selectionChanged", [extent]);});
		
	this.svg.append("g").attr("class", "brush").call(this.brush)
		.selectAll("rect")
		.attr({
			height: this.h
		});
		

    //TODO: implement the slider -- see example at http://bl.ocks.org/mbostock/6452972
    this.addSlider(this.svg)


    // filter, aggregate, modify data
    this.wrangleData();

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
  */
CountVis.prototype.wrangleData= function(){

    // displayData should hold the data which is visualized
    // pretty simple in this case -- no modifications needed
    this.displayData = this.data;
	
}



/**
 * the drawing function - should use the D3 selection, enter, exit
 * @param _options -- only needed if different kinds of updates are needed
 */
CountVis.prototype.updateVis = function(){

    // TODO: implement update graphs (D3: update, enter, exit)
												
	this.svg.select("path")
		.attr("d", this.cFunction(this.displayData))
		.attr("stroke", "black")
		.attr("fill", "black");

	this.svg.select(".axisY")
		.call(this.yAxis);
}

/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
CountVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

    // TODO: call wrangle function

    // do nothing -- no update when brushing


}


/*
 *
 * ==================================
 * From here on only HELPER functions
 * ==================================
 *
 * */





/**
 * creates the y axis slider
 * @param svg -- the svg element
 */
CountVis.prototype.addSlider = function(svg){
    var that = this;

    // TODO: Think of what is domain and what is range for the y axis slider !!
    var sliderScale = d3.scale.linear().domain([0,200]).range([0,this.h - 10])

    var sliderDragged = function(){
        var value = Math.max(0, Math.min(200,(d3.event.y)*200/(that.h)));
        var sliderValue = value;

        // TODO: do something here to deform the y scale
		that.yScale = d3.scale.pow().exponent(200 / (2000 - 9*sliderValue)).range([0, that.h]).domain([that.maxCount, 0]);
		that.yAxis = d3.svg.axis()
				.scale(that.yScale)
				.orient("left");


        d3.select(this)
            .attr("y", function () {
                return sliderScale(sliderValue);
            })

        that.updateVis({});
    }
    var sliderDragBehaviour = d3.behavior.drag()
        .on("drag", sliderDragged)

    var sliderGroup = svg.append("g").attr({
        class:"sliderGroup",
        //"transform":"translate("+0+","+30+")"
    })

    sliderGroup.append("rect").attr({
        class:"sliderBg",
        x:5,
        width:10,
        height:this.h
    }).style({
        fill:"lightgray"
    })

    sliderGroup.append("rect").attr({
        "class":"sliderHandle",
        y:this.h - 10,
        width:20,
        height:10,
        rx:2,
        ry:2
    }).style({
        fill:"#333333"
    }).call(sliderDragBehaviour)


}






