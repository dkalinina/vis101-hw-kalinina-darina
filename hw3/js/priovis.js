/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */


//TODO: DO IT ! :) Look at agevis.js for a useful structure

/**
 * Created by Hendrik Strobelt (hendrik.strobelt.com) on 1/28/15.
 */

PrioVis = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];

	this.width = 650;
	this.height = 440;
	this.left_p = 80;
	this.bottom_p = 200;
	this.w = this.width - this.left_p;
	this.h = this.height - this.bottom_p;

	this.max = d3.max(this.data, function(array,i) {return d3.max(array.prios, function(d) {return d;});});
	this.xScale = d3.scale.linear().range([this.left_p, this.width]).domain([0, 16]);
	this.yScale = d3.scale.linear().range([0, this.h]).domain([this.max, 0]);
	
	this.xAxis = d3.svg.axis()
				.scale(this.xScale)
				.orient("bottom")
				.tickValues(d3.range(16))
				.tickFormat(function(d) {return _metaData.choices[d+100];});
	this.yAxis = d3.svg.axis()
				.scale(this.yScale)
				.orient("left");
				
    this.initVis();

}

PrioVis.prototype.initVis = function(){

    var that = this;
	
    this.svg = this.parentElement.append("svg")
		.attr("width", this.width)
		.attr("height", this.height);

	this.svg.append("g")
		.attr("class", "bars")
	this.svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0,"+this.h+")")
		.call(this.xAxis).selectAll("text")
		.attr("transform", "rotate(-60)")
		.attr("style", "text-anchor: end;");
	this.svg.append("g")
		.attr("class", "axisY axis")
		.attr("transform", "translate("+this.left_p+",0)")
		.call(this.yAxis);
		
    this.wrangleData(null);

    this.updateVis();
}

PrioVis.prototype.wrangleData= function(_filterFunction){

    this.displayData = this.filterAndAggregate(_filterFunction);
	
}

PrioVis.prototype.updateVis = function(){
	var that = this;
	var colors = d3.scale.category20();
	this.svg.select(".bars").selectAll("rect")
		.data(this.displayData)
		.enter()
		.append("rect");
	this.svg.selectAll("rect")
		.attr("x", function(d, i) {return that.xScale(i);})
		.attr("y", function(d) {return that.h - that.yScale(that.max - d);})
		.attr("width", that.w / 16 - 3)
		.attr("height", function(d) {return that.yScale(that.max - d);})
		.attr("fill", function(d,i) {return colors(i);});
	this.svg.select(".axisY")
		.call(this.yAxis);
}

PrioVis.prototype.onSelectionChange= function (selectionStart, selectionEnd){

	if(d3.time.format("%Y-%m-%d")(selectionStart) != d3.time.format("%Y-%m-%d")(selectionEnd)) this.wrangleData(function(d) {return d.time >= selectionStart && d.time <= selectionEnd;});

    this.updateVis();

}

PrioVis.prototype.filterAndAggregate = function(_filter){


    var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }
    
    var that = this;

    var res = d3.range(16).map(function () {
        return 0;
    });

	this.data.filter(filter).map(function(arr) {
		arr.prios.map(function(prios,i) {
			res[i] += prios;
		});
	});
	
	this.max = d3.max(res, function(d) {return d;});
	this.yScale = d3.scale.linear().range([0, this.h]).domain([this.max, 0]);
	this.yAxis = d3.svg.axis()
				.scale(this.yScale)
				.orient("left");
	
    return res;

}




