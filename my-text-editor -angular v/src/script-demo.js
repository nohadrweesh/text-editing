


(function () {

	myedit = window.myedit || {};

	var $ = document.querySelector.bind(document);
	var $all = document.querySelectorAll.bind(document);

	var updateTimer
		, updateDelay = 100
		, currentLayoutMode
		, frame = $('#demo-frame')
		, htmlCode = $('#js-html-code')
		,cssCode = $('#js-css-code')
		, jsCode = $('#js-js-code');
		
	

	myedit.cm = {};
	myedit.demoFrameDocument = frame.contentDocument || frame.contentWindow.document;

	function resetSplitting() {
		
		$('#js-html-code').setAttribute('style', '');
		$('#js-css-code').setAttribute('style', '');
		$('#js-js-code').setAttribute('style', '');
		$('#js-code-side').setAttribute('style', '');
		$('#js-demo-side').setAttribute('style', '');

		Split(['#js-html-code', '#js-css-code', '#js-js-code'], {
			direction: (currentLayoutMode === 2 ? 'horizontal' : 'vertical')
		});
		Split(['#js-code-side', '#js-demo-side' ], {
			direction: (currentLayoutMode === 2 ? 'vertical' : 'horizontal')
		});
	}
	window.toggleLayout = function (mode) {
		currentLayoutMode = 2;
		document.body.classList.add('layout-2');

		resetSplitting();
	}

	
	myedit.setPreviewContent = function () {
		var self = this;
		var html = myedit.cm.html.getValue();
		var css = myedit.cm.css.getValue();
		var js = myedit.cm.js.getValue();


		html = '<html>\n<head>\n<style>\n' + css + '\n</style>\n</head>\n<body>\n' + html + '\n<script>\n' + js + '\n</script></body>\n</html>';

		frame.src="data:text/html;charset=utf-8," + escape(html);
		console.log(frame);
		
	};

	function initEditor(element, options) {
		var cm = CodeMirror(element, {
			mode: options.mode,
			lineNumbers: true,
			lineWrapping: true,
			autofocus: options.autofocus || false,
			autoCloseBrackets: true,
    		matchBrackets: true,
			tabMode: 'indent',
			theme: 'monokai',
			// cursorScrollMargin: '20', has issue with scrolling
			profile: options.profile || ''
		});
		cm.on('change', function onChange() {
			console.log("changed");
			clearTimeout(updateTimer);
			updateTimer = setTimeout(function () {
				myedit.setPreviewContent();
			}, updateDelay);
		});
		return cm;
	}

	myedit.cm.html = initEditor(htmlCode, {
		mode: 'htmlmixed',
		autofocus: true,
		profile: 'xhtml'
	});
	emmetCodeMirror(myedit.cm.html);
	myedit.cm.css = initEditor(cssCode, {
		mode: 'css'
	});
	emmetCodeMirror(myedit.cm.css);
	myedit.cm.js = initEditor(jsCode, {
		mode: 'javascript'
	});

	function init () {
		
		toggleLayout(2);
	}

	init();

})();