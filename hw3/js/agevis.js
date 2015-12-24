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
 * AgeVis object for HW3 of CS171
 * @param _parentElement -- the HTML or SVG element (D3 node) to which to attach the vis
 * @param _data -- the data array
 * @param _metaData -- the meta-data / data description object
 * @constructor
 */
AgeVis = function(_parentElement, _data, _metaData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metaData = _metaData;
    this.displayData = [];



    // TODO: define all constants here

	this.width = 230;
	this.height = 330;
	this.left_p = 30;
	this.bottom_p = 0;
	this.w = this.width - this.left_p;
	this.h = this.height - this.bottom_p;
	
	this.max = d3.max(this.data, function(array,i) {return d3.max(array.ages, function(d) {return d;});});
	this.xScale = d3.scale.linear().range([this.left_p, this.width]).domain([0, this.max]);
	this.yScale = d3.scale.linear().range([0, this.h]).domain([0, 100]);
	
	
	this.aFunction = d3.svg.area()
						.x0(this.left_p)
						.x1(function(d, i) { return this.xScale(d); })
						.y(function(d,i) { return this.yScale(i); })
						.interpolate("linear");

	this.yAxis = d3.svg.axis()
				.scale(this.yScale)
				.orient("left");
				
    this.initVis();

}


/**
 * Method that sets up the SVG and the variables
 */
AgeVis.prototype.initVis = function(){

    var that = this; // read about the this


    //TODO: construct or select SVG
    //TODO: create axis and scales
	
    this.svg = this.parentElement.append("svg")
		.attr("width", this.width)
		.attr("height", this.height);

	this.svg.append("g")
		.attr("class", "path")
		.append("path");
		
	this.svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate("+this.left_p+",0)")
		.call(this.yAxis).selectAll("text")
		.attr("transform", "translate(0,5)");
		
    // filter, aggregate, modify data
    this.wrangleData(null);

    // call the update method
    this.updateVis();
}


/**
 * Method to wrangle the data. In this case it takes an options object
 * @param _filterFunction - a function that filters data or "null" if none
 */
AgeVis.prototype.wrangleData= function(_filterFunction){

    // displayData should hold the data which is visualized
    this.displayData = this.filterAndAggregate(_filterFunction);

    //// you might be able to pass some options,
    //// if you don't pass options -- set the default options
    //// the default is: var options = {filter: function(){return true;} }
    //var options = _options || {filter: function(){return true;}};





}



/**
 * the drawing function - should use the D3 selection, enter, exit
 */
AgeVis.prototype.updateVis = function(){

    // Dear JS hipster,
    // you might be able to pass some options as parameter _option
    // But it's not needed to solve the task.
    // var options = _options || {};


    // TODO: implement...
    // TODO: ...update scales
    // TODO: ...update graphs
	
	
	this.svg.select("path")
		.attr("d", this.aFunction(this.displayData))
		.attr("stroke", "black")
		.attr("fill", "black");


}


/**
 * Gets called by event handler and should create new aggregated data
 * aggregation is done by the function "aggregate(filter)". Filter has to
 * be defined here.
 * @param selection
 */
AgeVis.prototype.onSelectionChange = function (selectionStart, selectionEnd){

    // TODO: call wrangle function
	
	if(d3.time.format("%Y-%m-%d")(selectionStart) != d3.time.format("%Y-%m-%d")(selectionEnd)) this.wrangleData(function(d) {return d.time >= selectionStart && d.time <= selectionEnd;});

    this.updateVis();


}


/*
*
* ==================================
* From here on only HELPER functions
* ==================================
*
* */



/**
 * The aggregate function that creates the counts for each age for a given filter.
 * @param _filter - A filter can be, e.g.,  a function that is only true for data of a given time range
 * @returns {Array|*}
 */
AgeVis.prototype.filterAndAggregate = function(_filter){


    // Set filter to a function that accepts all items
    // ONLY if the parameter _filter is NOT null use this parameter
    var filter = function(){return true;}
    if (_filter != null){
        filter = _filter;
    }
    //Dear JS hipster, a more hip variant of this construct would be:
    // var filter = _filter || function(){return true;}

    var that = this;

    // create an array of values for age 0-100
    var res = d3.range(100).map(function () {
        return 0;
    });


    // accumulate all values that fulfill the filter criterion

    // TODO: implement the function that filters the data and sums the values

	this.data.filter(filter).map(function(arr) {
		arr.ages.map(function(ages,i) {
			res[i] += ages;
		});
	});
	
	this.max = d3.max(res, function(d) {return d;});
	this.xScale = d3.scale.linear().range([this.left_p, this.width]).domain([0, this.max]);

    return res;

}




