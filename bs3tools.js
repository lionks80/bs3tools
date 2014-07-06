/**
 * bs3table plugin
 * 
 * @param $
 */
(function($) {

	// ////////////////////// PRIVATE METHODS -- START -- //////////////////////
	var privateFn = {};
	privateFn.getDefaultSetting = function() {

		var defaultSetting = {
			columns : null,
			tableCss : [ "table" ],
			listener : {
				rowClick : function(rowIndex, rowData, tr) {
				},
				sortChange : function(sortName, sortASC) {
				}
			},
			selectbox : {
				useSelect : false,
				multiSelect : false,
				selectByRowClick : false,
				selectedRowCss : "active"
			}
		};
		return defaultSetting;
	};
	privateFn.sort = {};
	privateFn.sort.set = function(parentDiv, options, eventFire) {

		var setting = parentDiv.data('setting');
		var thead = parentDiv.data('thead');
		privateFn.sort.clear(thead);

		thead.find('th').each(function(index, obj) {

			if ($(this).data('sortName') != options.sortName) {
				return;
			}

			$(this).removeClass('sorting');

			if (options.sortASC) {
				$(this).addClass('sorting_asc');
			} else {
				$(this).addClass('sorting_desc');
			}
		});

		parentDiv.data('sortName', options.sortName);
		parentDiv.data('sortASC', options.sortASC);

		if (eventFire && setting.listener.sortChange) {
			setting.listener.sortChange(options.sortName, options.sortASC);
		}
	};
	privateFn.sort.get = function(parentDiv) {

		var sortName = parentDiv.data('sortName');
		var sortASC = parentDiv.data('sortASC');

		if (!sortName) {
			return null;
		} else {
			return {
				"sortName" : sortName,
				"sortASC" : sortASC
			};
		}

	};
	privateFn.sort.clear = function(tableHead) {

		tableHead.find('.sorting_asc').each(function() {
			$(this).removeClass('sorting_asc');
			$(this).addClass('sorting');
		});

		tableHead.find('.sorting_desc').each(function() {
			$(this).removeClass('sorting_desc');
			$(this).addClass('sorting');
		});

	};
	privateFn.sort.bind = function(parentDiv) {

		var thead = parentDiv.data('thead');
		thead.find('th').each(function(index, obj) {

			if (!$(this).data('sortName')) {
				return;
			}

			$(this).addClass('sorting');

			$(this).click(function(b) {

				oriSortName = parentDiv.data('sortName');
				thSortName = $(this).data('sortName');

				if (oriSortName != thSortName) {
					privateFn.sort.set(parentDiv, {
						"sortName" : thSortName,
						"sortASC" : true
					}, true);
				} else {
					oriSortASC = parentDiv.data('sortASC');
					privateFn.sort.set(parentDiv, {
						"sortName" : thSortName,
						"sortASC" : !oriSortASC
					}, true);
				}
			});
		});

	};

	privateFn.createTable = function(parentDiv, options) {

		// 설정 관련 코드
		var setting = privateFn.getDefaultSetting();
		$.extend(setting, options);
		parentDiv.data('setting', setting);

		// 테이블 생성 관련 코드
		var table = $('<table></table>');
		var thead = $('<thead></thead>');
		var tbody = $('<tbody></tbody>');

		parentDiv.append(table);
		table.append(thead);
		table.append(tbody);

		parentDiv.data('table', table);
		parentDiv.data('thead', thead);
		parentDiv.data('tbody', tbody);

		// 테이블 Css 적용
		table.addClass(setting.tableCss.join(" "));

		// 컬럼 생성
		privateFn.createColumns(parentDiv);

	};

	privateFn.createColumns = function(parentDiv) {

		var setting = parentDiv.data('setting');
		var thead = parentDiv.data('thead');

		// 컬럼 관련 코드
		var theadTr = $('<tr></tr>');
		thead.append(theadTr);

		if (setting.selectbox.useSelect == true) {

			var chkboxAllTh = $('<th></th>');
			chkboxAllTh.css("text-align", 'center');
			chkboxAllTh.width(40);

			if (setting.selectbox.multiSelect == true) {
				var chkboxAll = $('<input type="checkbox" class="bs3table-chkbox-all">');
				chkboxAll.change(function() {
					if (chkboxAll.prop('checked') == true) {
						privateFn.selectbox.checkAll(parentDiv);
					} else {
						privateFn.selectbox.clear(parentDiv);
					}
				});

				chkboxAllTh.append(chkboxAll);
			}

			theadTr.append(chkboxAllTh);
		}

		for (var i = 0; i < setting.columns.length; i++) {

			var th = $('<th></th>');

			if (setting.columns[i].header) {
				th.append(setting.columns[i].header);
			}

			if (setting.columns[i].headerAlign) {
				th.css("text-align", setting.columns[i].headerAlign);
			}

			if (setting.columns[i].width) {
				th.width(setting.columns[i].width);
			}

			if (setting.columns[i].headerCss) {
				var headerCss = setting.columns[i].headerCss.join(" ");
				th.addClass(headerCss);
			}

			if (setting.columns[i].sort) {

				sortName = "";

				if (setting.columns[i].sortName
						&& setting.columns[i].sortName.length > 0) {
					sortName = setting.columns[i].sortName;
				} else if (setting.columns[i].dataIndex
						&& setting.columns[i].dataIndex.length > 0) {
					sortName = setting.columns[i].dataIndex;
				} else {
					continue;
				}

				th.data('sortName', sortName);
			}

			theadTr.append(th);
		}

		privateFn.sort.bind(parentDiv);
	};

	privateFn.dataBind = function(parentDiv, rows, addRows) {

		if (addRows == false) {
			privateFn.clear(parentDiv);
		}

		var setting = parentDiv.data('setting');

		// row 생성
		for (var i = 0; i < rows.length; i++) {

			var tr = $('<tr></tr>');
			tr.data('rowData', rows[i]);
			tr.data('rowIndex', i);

			// useSelect : false,
			// multiSelect : false,
			// selectByRowClick : true,
			// selectedRowCss : "active"

			if (setting.selectbox.useSelect == true) {
				var chkbox = $('<td><input type="checkbox" class="bs3table-chkbox"></td>');
				chkbox.css("text-align", 'center');
				tr.append(chkbox);
			}

			for (var j = 0; j < setting.columns.length; j++) {

				var td = $('<td></td>');

				rowData = tr.data('rowData');
				rowIndex = tr.data('rowIdx');

				if (setting.columns[j].renderer) {
					td.append(setting.columns[j].renderer(rowData, rowIndex,
							td, tr));
				} else {
					td.append(rowData[setting.columns[j].dataIndex]);
				}

				if (setting.columns[j].dataAlign) {
					td.css("text-align", setting.columns[j].dataAlign);
				}

				$(tr).append(td);
			}

			parentDiv.find('tbody').append(tr);
		}

		privateFn.eventBind(parentDiv);

	};

	privateFn.eventBind = function(parentDiv) {

		var setting = parentDiv.data('setting');
		var tbody = parentDiv.data('tbody');

		// row 클릭시 선택할 경우 (input에 bs3table-chkbox 클래스가 있는경우 콤보박스이며
		// 자바스크립트가 아닌 기본 체크박스 변경을 사용
		var selectByRowClickFn = function() {
			$(this).click(
					function(e) {

						if ($(e.target).hasClass('bs3table-chkbox')) {
							return;
						}

						var checked = $(this).find('.bs3table-chkbox').prop(
								'checked');
						$(this).find('.bs3table-chkbox').prop('checked',
								!checked).trigger('change');
					});
		};

		if (setting.selectbox.useSelect == true
				&& setting.selectbox.selectByRowClick == true) {
			tbody.find('tr').each(selectByRowClickFn);
		}

		var chkboxChange = function(e) {
			if (setting.selectbox.multiSelect == false) {
				privateFn.selectbox.clear(parentDiv);
				$(e.target).prop('checked', true);
			}

			if ($(this).prop('checked') == false) {
				$(this).parents("tr").removeClass(
						setting.selectbox.selectedRowCss);
			} else {
				$(this).parents("tr")
						.addClass(setting.selectbox.selectedRowCss);
			}

			if (setting.selectbox.multiSelect == true) {
				var totalCount = tbody.find('tr .bs3table-chkbox').length;
				var checkedCount = tbody.find('tr .bs3table-chkbox:checked').length;

				var thead = parentDiv.data('thead');
				if (totalCount == checkedCount) {
					thead.find('tr .bs3table-chkbox-all').prop('checked', true);
				} else {
					thead.find('tr .bs3table-chkbox-all')
							.prop('checked', false);
				}
			}
		};

		if (setting.selectbox.useSelect == true) {

			tbody.find('tr .bs3table-chkbox').each(function() {
				$(this).change(chkboxChange);
			});
		}

		if (setting.listener.rowClick) {
			tbody.find('tr').each(function() {

				$(this).click(function() {
					var rowIndex = $(this).data('rowIndex');
					var rowData = $(this).data('rowData');

					setting.listener.rowClick(rowIndex, rowData, $(this));
				});

			});
		}
	};

	privateFn.clear = function(parentDiv) {

		var tbody = parentDiv.data('tbody');

		if (tbody.children().length > 0) {
			tbody.children().remove();
		}
	};

	/**
	 * bs3table에서 선택된 로우의 데이터를 반환한다.
	 */
	privateFn.selectbox = {};
	privateFn.selectbox.getSelectedData = function(parentDiv) {

		var data = [];

		var tbody = parentDiv.data('tbody');
		tbody.find('tr td .bs3table-chkbox:checked').each(function() {
			data.push($(this).parents('tr').data('rowData'));
		});

		return data;

	};

	privateFn.selectbox.clear = function(parentDiv) {

		var tbody = parentDiv.data('tbody');
		var setting = parentDiv.data('setting');

		tbody.find('tr .bs3table-chkbox').each(
				function() {
					$(this).prop('checked', false);
					$(this).parents("tr").removeClass(
							setting.selectbox.selectedRowCss);
				});
	};

	privateFn.selectbox.checkAll = function(parentDiv) {

		var tbody = parentDiv.data('tbody');
		var setting = parentDiv.data('setting');

		if (setting.selectbox.multiSelect == true) {
			tbody.find('tr .bs3table-chkbox').each(
					function() {
						$(this).prop('checked', true);
						$(this).parents("tr").addClass(
								setting.selectbox.selectedRowCss);
					});
		}
	};

	// ////////////////////// PRIVATE METHODS -- START -- //////////////////////

	// ////////////////////// PUBLIC METHODS -- START -- //////////////////////
	var publicFn = {};
	publicFn.init = function(options) {
		return this.each(function() {
			privateFn.createTable($(this), options);
		});
	};
	publicFn.dataBind = function(data, addRows) {

		if (!addRows) {
			addRows = false;
		}

		return this.each(function() {
			privateFn.dataBind($(this), data, addRows);
		});
	};

	publicFn.clear = function() {
		return this.each(function() {
			privateFn.clear($(this));
		});
	};

	/**
	 * 각각의 bs3table에서 선택된 로우의 데이터 모두를 가지고와 합쳐서 리턴한다.
	 */
	publicFn.getSelectedData = function() {

		// var result = [];
		// this.each(function() {
		// data =
		//
		// for (var i = 0; i < data.length; i++) {
		// result.push(data[i]);
		// }
		// });

		return privateFn.selectbox.getSelectedData($(this));
		;
	};

	publicFn.setSortOption = function(sortOption) {
		return this.each(function() {
			privateFn.sort.set($(this), sortOption, false);
		});
	};

	publicFn.getSortOption = function(sortOption) {

		// var result = [];
		//		
		// this.each(function() {
		// result.push();
		// });

		return privateFn.sort.get($(this));

	};

	// ////////////////////// PUBLIC METHODS -- END -- //////////////////////

	$.fn.bs3table = function(method) {

		if (publicFn[method]) {
			return publicFn[method].apply(this, Array.prototype.slice.call(
					arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return publicFn.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on bs3table');
		}
	};

})(jQuery);

(function($) {

	privateFn = {};
	privateFn.getDefaultSetting = function() {
		var setting = {
			"start" : 0,
			"limit" : 15,
			"totalCount" : 0,
			"displayCount" : 7,
			"pagingCss" : [ "pagination" ],
			"trigger" : null,
			"useEndBtn" : true,
			"useNextBtn" : true
		};

		return setting;
	};
	privateFn.calc = {};
	privateFn.calc.getStartIndex = function(page, limit) {
		
		if (page < 2) {
			return 0;
		} else {
			return (page - 1) * limit;
		}
	};
	privateFn.calc.getCurrentPage = function(start, limit) {

		if (start < limit) {
			return 1;
		} else {
			return parseInt(start / limit) + 1;
		}
	};

	privateFn.calc.getTotalPage = function(totalCount, limit) {
		var value = parseInt(totalCount / limit);

		if (totalCount % limit != 0) {
			value++;
		}

		// 기본적으로 페이지가 없을 경우에도 1로 고정함.
		if (value == 0) {
			return 1;
		} else {
			return value;
		}
	};

	privateFn.calc.getStartNum = function(displayCount, currentPage) {

		var leftCount = parseInt((displayCount - 1) / 2);
		// 왼쪽 시작 수
		var startNum = -1;
		startNum = currentPage - leftCount;
		if (startNum < 1) {
			startNum = 1;
		}

		return startNum;
	};

	privateFn.calc.getEndNum = function(startNum, displayCount, totalPage) {
		var endNum = startNum + displayCount - 1;

		if (endNum >= totalPage) {
			endNum = totalPage;
		}

		return endNum;
	};

	privateFn.setPage = function(parentDiv, page) {
		var setting = parentDiv.data('setting');
		setting.start = privateFn.calc.getStartIndex(page, setting.limit);
		privateFn.createPaging(parentDiv, setting);
		
		if (setting.trigger) {
			setting.trigger(page);
		}
	};

	privateFn.createPaging = function(parentDiv, options) {

		// 기존 페이징이 있는경우 삭제
		pagingUl = parentDiv.data('pagingUl');
		if (pagingUl) {
			pagingUl.remove();
		}
		
		// 옵션값 생성
		setting = privateFn.getDefaultSetting();
		$.extend(setting, options);

		parentDiv.data('setting', setting);

		// 필요 데이터 생성
		var currentPage = privateFn.calc.getCurrentPage(setting.start,
				setting.limit);
		// 현재 페이지 기록
		parentDiv.data('page', currentPage);
		
		var totalPage = privateFn.calc.getTotalPage(setting.totalCount,
				setting.limit);
		// 왼쪽 시작 수
		var startNum = privateFn.calc.getStartNum(setting.displayCount,
				currentPage);
		// 오른쪽 표시 수
		var endNum = privateFn.calc.getEndNum(startNum, setting.displayCount,
				totalPage);

		// 페이징 본체 생성
		var pagingUl = $('<ul></ul>');
		parentDiv.append(pagingUl);
		if (setting.pagingCss) {
			pagingUl.addClass(setting.pagingCss.join(" "));
		}
		
		parentDiv.data('pagingUl', pagingUl);

		// 처음으로 이전으로 버튼 세팅
		if (setting.useEndBtn) {
			var startBtn = $('<li><a>«</a></li>');
			pagingUl.append(startBtn);
			// 처음으로 이동 및 첫 페이지
			if (parseInt(currentPage) < 2) {
				$(startBtn).addClass("disabled");
			} else {
				$(startBtn).bind("click", function() {
					privateFn.setPage(parentDiv, 1);
				});
			}
		}
		if (setting.useNextBtn) {
			var preBtn = $('<li><a>pre</a></li>');
			pagingUl.append(preBtn);
			// 처음으로 이동 및 첫 페이지
			if (parseInt(currentPage) < 2) {
				$(preBtn).addClass("disabled");
			} else {
				$(preBtn).bind("click", function() {
					previewPage = parseInt(currentPage) - parseInt(1);
					privateFn.setPage(parentDiv, previewPage);
				});
			}
		}

		for (var i = startNum; i <= endNum; i++) {

			var li = $('<li><a>' + i + '</a></li>');
			li.data('page', i);
			if (i == currentPage) {
				li.addClass("active");
			} else {
				li.bind("click", function() {
					privateFn.setPage(parentDiv, $(this).data('page'));
				});
			}

			pagingUl.append(li);

		}

		if (setting.useNextBtn) {
			var nextBtn = $('<li><a>next</a></li>');
			pagingUl.append(nextBtn);
			// 페이지 이동
			if (parseInt(currentPage) >= parseInt(totalPage)) {
				$(nextBtn).addClass("disabled");
			} else {
				$(nextBtn).bind("click", function() {
					nextPage = parseInt(currentPage) + parseInt(1);
					privateFn.setPage(parentDiv, nextPage);
				});
			}
		}
		// 처음으로 이전으로 버튼 세팅
		if (setting.useEndBtn) {
			var endBtn = $('<li><a>»</a></li>');
			pagingUl.append(endBtn);
			// 페이지 이동
			if (parseInt(currentPage) >= parseInt(totalPage)) {
				$(endBtn).addClass("disabled");
			} else {
				$(endBtn).bind("click", function() {
					privateFn.setPage(parentDiv, totalPage);
				});
			}
		}
	};
	// ////////////////////// PUBLIC METHODS -- START -- //////////////////////
	var publicFn = {};
	publicFn.init = function(options) {
		return this.each(function() {
			privateFn.createPaging($(this), options);
		});
	};
	publicFn.getCurrentPage = function(options) {
		return $(this).data('page');
	};
	// ////////////////////// PUBLIC METHODS -- END -- //////////////////////
	$.fn.bs3paging = function(method) {

		if (publicFn[method]) {
			return publicFn[method].apply(this, Array.prototype.slice.call(
					arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return publicFn.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on bs3paging.');
		}

	};

})(jQuery);