;(function () {

	myedit = window.myedit || {};

	var $ = document.querySelector.bind(document);
	var $all = document.querySelectorAll.bind(document);

	var updateTimer
		, updateDelay = 500
		, currentLayoutMode
		, frame = $('#demo-frame')
		, htmlCode = $('#js-html-code')
		,cssCode = $('#js-css-code')
		, jsCode = $('#js-js-code')
		, layoutBtn1 = $('#js-layout-btn-1')
		, layoutBtn2 = $('#js-layout-btn-2')
		, layoutBtn3 = $('#js-layout-btn-3')
		, helpBtn = $('#js-help-btn')
		, helpModal = $('#js-help-modal')
		, codepenBtn = $('#js-codepen-btn')
		, codepenForm = $('#js-codepen-form')
		, saveHtmlBtn = $('#js-save-html')
		;

	myedit.cm = {};
	myedit.demoFrameDocument = frame.contentDocument || frame.contentWindow.document;

	function resetSplitting() {
		var gutters = $all('.gutter');
		for (var i = gutters.length; i--;) {
			gutters[i].remove();
		}
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
		currentLayoutMode = mode;
		$('#js-layout-btn-1').classList.remove('selected');
		$('#js-layout-btn-2').classList.remove('selected');
		$('#js-layout-btn-3').classList.remove('selected');
		$('#js-layout-btn-' + mode).classList.add('selected');
		document.body.classList.remove('layout-1');
		document.body.classList.remove('layout-2');
		document.body.classList.remove('layout-3');
		document.body.classList.add('layout-' + mode);

		resetSplitting();
	}

	window.saveSetting = function saveSetting(setting, value) {
		var obj = {};
		obj[setting] = value;
		chrome.storage.local.set(obj, function() {
		  // alert('Settings saved');
		});
	}

	window.onunload = function () {
		// saveSettings();
	};

	myedit.saveContent = function (content) {
		window.localStorage.myedit = content;
	};

	myedit.getLastSavedContent = function () {
		return window.localStorage.myedit || "";
	};

	myedit.setPreviewContent = function () {
		var self = this;
		var html = myedit.cm.html.getValue();
		var css = myedit.cm.css.getValue();
		var js = myedit.cm.js.getValue();


		html = '<html>\n<head>\n<style>\n' + css + '\n</style>\n</head>\n<body>\n' + html + '\n<script>\n' + js + '\n</script></body>\n</html>';
        
        console.log('before',frame);

		var fileWritten = false;

		var blob = new Blob([ html ], {type : "text/plain;charset=UTF-8"});

		function errorHandler() { console.log(arguments); }

		window.webkitRequestFileSystem(window.TEMPORARY, 1024 * 1024 * 5, function(fs){
			fs.root.getFile('preview.html', {create: true}, function(fileEntry) {
				fileEntry.createWriter(function(fileWriter) {
					function onWriteComplete() {
						if (fileWritten) {
							frame.src = 'filesystem:chrome-extension://' + chrome.i18n.getMessage('@@extension_id') + '/temporary/' + 'preview.html';
						}
						else {
							fileWritten = true;
							fileWriter.seek(0);
							fileWriter.write(blob);
						}
					}
					fileWriter.onwriteend = onWriteComplete;
					fileWriter.truncate(0)
				}, errorHandler);
			}, errorHandler);
		}, errorHandler);
	
     console.log('after',frame);
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
			keyMap: 'sublime',
			theme: 'monokai',
			// cursorScrollMargin: '20', has issue with scrolling
			profile: options.profile || ''
		});
		cm.on('change', function onChange() {
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
	myedit.cm.js = initEditor(jsCode, {
		mode: 'javascript'
	});

	function init () {
		layoutBtn1.addEventListener('click', function () { saveSetting('layoutMode', 1); toggleLayout(1); return false; });
		layoutBtn2.addEventListener('click', function () { saveSetting('layoutMode', 2); toggleLayout(2); return false; });
		layoutBtn3.addEventListener('click', function () { saveSetting('layoutMode', 3); toggleLayout(3); return false; });

		chrome.storage.local.get('layoutMode', function localGetCallback(result) {
			if (result.layoutMode) {
				toggleLayout(result.layoutMode);
			} else {
				toggleLayout(1);
			}
		});

		helpBtn.addEventListener('click', function () {
			helpModal.classList.toggle('is-modal-visible');
			return false;
		});

		codepenBtn.addEventListener('click', function (e) {
			var json = {
				title: 'A Web Maker experiment',
				html: myedit.cm.html.getValue(),
				css: myedit.cm.css.getValue(),
				js: myedit.cm.js.getValue()
			};
			json = JSON.stringify(json)
				.replace(/"/g, "&​quot;")
				.replace(/'/g, "&apos;")
			codepenForm.querySelector('input').value = json;
			codepenForm.submit();
			e.preventDefault();
		});

		saveHtmlBtn.addEventListener('click', function (e) {
			var html = myedit.cm.html.getValue();
			var css = myedit.cm.css.getValue();
			var js = myedit.cm.js.getValue();

			var fileContent = '<html><head>\n<style>\n'
				+ css + '\n</style>\n</head>\n<body>\n'
				+ html + '\n<script>\n' + js + '\n</script>\n\n</body>\n</html>';

			var d = new Date();
			var fileName = [ 'web-maker', d.getFullYear(), d.getMonth(), d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds() ].join('-');
			fileName += '.html';

			var a = document.createElement('a');
			var blob = new Blob([ fileContent ], {type : "text/html;charset=UTF-8"});
			a.href = window.URL.createObjectURL(blob);
			a.download = fileName;
			a.style.display = 'none';
			document.body.appendChild(a);
			a.click();
			a.remove();
		});

		window.addEventListener('click', function(e) {
			if (typeof e.target.className === 'string' && e.target.className.indexOf('modal-overlay') !== -1) {
				e.target.previousElementSibling.classList.toggle('is-modal-visible');
			}
		})
	}

	init();

})();