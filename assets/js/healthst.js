function healthta(valueid,valuesert) {

	var container = document.getElementById(valueid)
	var thead = container.querySelector('thead');
	var tbody = container.querySelector('tbody');

	container.style.overflow = 'auto';
	container.style.position = 'relative';

	function relayout() {
		var ths = [].slice.call(thead.querySelectorAll('th'));
		var tbodyTrs = [].slice.call(tbody.querySelectorAll('tr'));

		tbody.setAttribute('style', '');
		thead.style.width = '';
		thead.style.position = '';
		thead.style.top = '';
		thead.style.left = '';
		thead.style.zIndex = '';
		ths.forEach(function (th) {
			th.style.display = '';
			th.style.width = '';
			th.style.position = '';
			th.style.top = '';
			th.style.left = '';
		});
		tbodyTrs.forEach(function (tr) {
			tr.setAttribute('style', '');
		});
		[].slice.call(tbody.querySelectorAll('td'))
			.forEach(function (td) {
				td.style.width = '';
				td.style.position = '';
				td.style.left = '';
			});


		var thStyles = ths.map(function (th) {
			var rect = th.getBoundingClientRect();
			var style = document.defaultView.getComputedStyle(th, '');
			return {
				boundingWidth: rect.width,
				boundingHeight: rect.height,
				width: parseInt(style.width),
				paddingLeft: parseInt(style.paddingLeft)
			};
		});

		var totalWidth = thStyles.reduce(function (sum, cur) {
			return sum + cur.boundingWidth;
		}, 0);
		tbody.style.display = 'inline-block';
		tbody.style.width = totalWidth  + 'px';
		thead.style.width = totalWidth - thStyles[0].boundingWidth + 'px';

		// Position thead
		thead.style.position = 'absolute';
		thead.style.top = '0';
		thead.style.left = thStyles[0].boundingWidth + 'px';
		thead.style.zIndex = 10;

		ths.forEach(function (th, i) {
			th.style.width = thStyles[i].width + 'px';
			th.style.display = 'inline-block';
			if (i === 0) {
				th.style.position = 'absolute';
				th.style.top = '0';
				th.style.left = -thStyles[0].boundingWidth + 'px';
			}
			
			
//			if (i === 1) {
//				th.style.width = thStyles[1].width+1 + 'px';
//			}
			
			
		});

		tbody.style.marginTop = thStyles[0].boundingHeight + 'px';

		tbodyTrs.forEach(function (tr, i) {
		    tr.style.display = 'inline-flex';
			tr.style.paddingLeft = thStyles[0].boundingWidth + 'px';
			[].slice.call(tr.querySelectorAll('td'))
				.forEach(function (td, j) {
					td.style.width = thStyles[j].width + 'px';
					if (j === 0) {
						td.style.position = 'absolute';
						td.style.left = '0';
					}
				});
		});
	}

	relayout();
	
	

	window.addEventListener('resize', resizeThrottler, false);
	var resizeTimeout;

	function resizeThrottler() {
		if (!resizeTimeout) {
			resizeTimeout = setTimeout(function () {
				resizeTimeout = null;
				relayout();
			}, 500);
		}
	};
		

	container.addEventListener('scroll', function () {
		thead.style.transform = 'translate3d(0,' + this.scrollTop + 'px,0)';
		var hTransform = 'translate3d(' + this.scrollLeft + 'px,0,0)';
		var datas  =  [];
		
		var datas2  =  [];
		
		
		for(var i = 0 ; i <= valuesert ; i++ ){
			datas.push('tr > td:nth-child('+i+')');
			datas2.push('tr > th:nth-child('+i+')');
		}
		[].slice.call(tbody.querySelectorAll(datas))
			.forEach(function (td) {
				td.style.transform = hTransform;
			if( hTransform === 'translate3d(' +0+ 'px,0,0)'){
							td.style.background="inherit";

			}else{td.style.background="#eee";}
			
			
			});
		
		[].slice.call(thead.querySelectorAll(datas2))
			.forEach(function (th) {
				th.style.transform = hTransform;
			});
	});

	return {
		relayout: relayout
	};
};


$('.mos button').on('click', function(e) {
  e.preventDefault();
  $('.mos').addClass('opened');
  $('.mos input[type="search"]').focus();
});

$('.mos input[type="search"]').on('focusout', function(e) {
  $('.mos').removeClass('opened');
});
