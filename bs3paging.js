$(function() {

	// Example Data
	var sampleData = {
		"start" : 60,
		"limit" : 20,
		"totalCount" : 318,
		"displayCount" : 9,
		"pagingCss" : [ "pagination" ],
		"trigger" : function(page) {
			alert(page);
		},
		"useEndBtn" : true,
		"useNextBtn" : true
	};

	$('#tutorial_paging').bs3paging(sampleData);
	
	$('#btn_tutorial_getCurrentPage').click(function() {
		alert($('#tutorial_paging').bs3paging('getCurrentPage'));
	});
	
});