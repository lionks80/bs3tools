$(function() {

	// Sample Data
	var people = [ 
	               { 'id' : 1, 'name' : '이철수', 'age' : 21 }, 
	               { 'id' : 2, 'name' : '김영희', 'age' : 33 }, 
	               { 'id' : 3, 'name' : '장동민', 'age' : 18 }, 
	               { 'id' : 4, 'name' : '홍길동', 'age' : 40 }, 
	               { 'id' : 5, 'name' : '이순신', 'age' : 17 }, 
	               { 'id' : 6, 'name' : '조악필', 'age' : 20 } ];


	// tutorial1_table
	$('#tutorial1_table').bs3table({
		columns : [ {
			header : 'ID',
			headerAlign : 'center',
			dataIndex : 'id',
			dataAlign : 'right',
			width : 40
		}, {
			header : 'Name',
			dataIndex : 'name',
			headerAlign : 'center',
			dataAlign : 'center',
		}, {
			header : 'Age',
			dataIndex : 'age',
			headerAlign : 'center',
			dataAlign : 'center'
		}, {
			header : 'Adult',
			headerAlign : 'center',
			dataAlign : 'center',
			renderer : function(rowData, rowIndex, td, tr) {
				if (rowData.age >= 20) {
					tr.addClass("success");
					return "YES";
				} else {
					tr.addClass("danger");
					return "NO";
				}
			}
		} ],
		listener : {
			rowClick : function(rowIndex, rowData, tr) {
				alert('rowIndex: ' + rowIndex + ', name: ' + rowData.name);
			}
		},
		tableCss : [ "table", "table-bordered"],
		selectbox : {
			useSelect : false,
			multiSelect : false,
			selectByRowClick : false,
			selectedRowCss : "active"
		}
	});

	// Data Bind
	$('#tutorial1_table').bs3table('dataBind', people);
	
	$('#btn_tutorial1_dataBind').click(function() {
		$('#tutorial1_table').bs3table('dataBind', people);
	});
	$('#btn_tutorial1_dataBind_add').click(function() {
		$('#tutorial1_table').bs3table('dataBind', people, true);
	});
	$('#btn_tutorial1_clear').click(function() {
		$('#tutorial1_table').bs3table('clear');
	});


	// tutorial2_table
	$('#tutorial2_table').bs3table({
		columns : [ {
			header : 'ID',
			headerAlign : 'center',
			sort: true,
			sortName:'id',
			dataIndex : 'id',
			dataAlign : 'right',
			width : 60
		}, {
			header : 'Name',
			dataIndex : 'name',
			headerAlign : 'center',
			dataAlign : 'center'
		}, {
			header : 'Age',
			dataIndex : 'age',
			headerAlign : 'center',
			dataAlign : 'center'
		}, {
			header : 'Adult',
			headerAlign : 'center',
			dataAlign : 'center',
			sort : true,
			sortName : 'age',
			renderer : function(rowData, rowIndex, td, tr) {
				if (rowData.age >= 20) {
					td.addClass("success");
					return "YES";
				} else {
					td.addClass("danger");
					return "NO";
				}
			}
		} ],
		listener : {
			sortChange : function(sortName, sortASC) {
				var sortFn = function(a, b){return a[sortName] - b[sortName];}; 
				if (sortASC == false) {
					sortFn = function(a, b){return b[sortName] - a[sortName];};
				}
				
				people.sort(sortFn);
				$('#tutorial2_table').bs3table('dataBind', people);
				
			}
		},
		tableCss : [ "table", "table-bordered", "table-hover" ],
		selectbox : {
			useSelect : true,
			multiSelect : false,
			selectByRowClick : true,
			selectedRowCss : "active"
		}
	});

	$('#tutorial2_table').bs3table('setSortOption', {
		"sortName" : "id",
		"sortASC" : true
	});
	$('#tutorial2_table').bs3table('dataBind', people);
	
	$('#btn_tutorial2_getSortOption').click(function() {
		sortOption = $('#tutorial2_table').bs3table('getSortOption');
		alert("sortName: " + sortOption[0].sortName + " / "  + "sortASC: " + sortOption[0].sortASC);
	});
	
	$('#btn_tutorial2_getSelectedData').click(function() {
		selectedData = $('#tutorial2_table').bs3table('getSelectedData');
		
		if (selectedData.length == 0) {
			alert('not selected');
		} else {
			alert(selectedData[0].name);			
		}
	});

	
	// tutorial3_table
	$('#tutorial3_table').bs3table({
		columns : [ {
			header : 'ID',
			headerAlign : 'center',
			sort: true,
			sortName:'id',
			dataIndex : 'id',
			dataAlign : 'right',
			width : 60
		}, {
			header : 'Name',
			dataIndex : 'name',
			headerAlign : 'center',
			dataAlign : 'center'
		}, {
			header : 'Age',
			dataIndex : 'age',
			headerAlign : 'center',
			dataAlign : 'center',
			sort : true,
			sortName : 'age'
		}, {
			header : 'Adult',
			headerAlign : 'center',
			dataAlign : 'center',
			renderer : function(rowData, rowIndex, td, tr) {
				if (rowData.age >= 20) {
					td.addClass("success");
					return "YES";
				} else {
					td.addClass("danger");
					return "NO";
				}
			}
		} ],
		listener : {
			sortChange : function(sortName, sortASC) {
				var sortFn = function(a, b){return a[sortName] - b[sortName];}; 
				if (sortASC == false) {
					sortFn = function(a, b){return b[sortName] - a[sortName];};
				}
				
				people.sort(sortFn);
				$('#tutorial3_table').bs3table('dataBind', people);
				
			}
		},
		tableCss : [ "table", "table-bordered", "table-hover" ],
		selectbox : {
			useSelect : true,
			multiSelect : true,
			selectByRowClick : true,
			selectedRowCss : "active"
		}
	});

	// Data Bind
	$('#tutorial3_table').bs3table('dataBind', people);
	
	$('#btn_tutorial3_getSelectedData').click(function() {
		selectedData = $('#tutorial3_table').bs3table('getSelectedData');
		
		if (selectedData.length == 0) {
			alert('not selected');
		} else {
			alert(selectedData.length);
		}
	});
});