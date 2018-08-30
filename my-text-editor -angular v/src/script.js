
var myApp = angular.module('myApp', ['ui.codemirror']);
//var app = angular.module('flapperNews', ['ui.codemirror']);
myApp.value('ui.config', {
  codemirror: {
    mode: 'text/x-php',
    lineNumbers: true,
    matchBrackets: true,
    theme: 'monokai',
  }
});

function codeCtrl($scope, codeService) {
  $scope.html = '<h1 id="demo">Hellow editing</h1><button onclick="myFunction()">Click me</button>';
  $scope.css = "h1 {color: red}";
  $scope.js = "function myFunction() {document.getElementById('demo').innerHTML = 'Hello World';}";
  $scope.currentLayoutMode=2;
  
  $scope.$watch('html', function () { codeService.render($scope.html, $scope.css,$scope.js); }, true);
  $scope.$watch('css', function () { codeService.render($scope.html, $scope.css,$scope.js); }, true);
  $scope.$watch('js', function () { codeService.render($scope.html, $scope.css,$scope.js); }, true);

  Split(['#js-html-code', '#js-css-code', '#js-js-code'], {
      direction: ($scope.currentLayoutMode === 2 ? 'horizontal' : 'vertical')
    });
  Split(['#js-code-side', '#js-demo-side' ], {
      direction: ($scope.currentLayoutMode === 2 ? 'vertical' : 'horizontal')
    });

  document.body.classList.add('layout-2');

 //emmetCodeMirror(myedit.cm.html);
}

myApp.service('codeService', function () {
  this.render = function (html, css,js) {
    source = "<html><head><style>" + css + "</style></head><body>" + html +"<script>"+js+"</script></body></html>";
    
    var iframe = document.querySelector('#js-demo-side iframe'),
        iframe_doc = iframe.contentDocument;
     
    iframe_doc.open();
    iframe_doc.write(source);
    iframe_doc.close();
  }
})

// (function () {

// 	myedit = window.myedit || {};

// 	var $ = document.querySelector.bind(document);
// 	var $all = document.querySelectorAll.bind(document);

// 	var updateTimer
// 		, updateDelay = 100
// 		, currentLayoutMode
// 		, frame = $('#demo-frame')
// 		, htmlCode = $('#js-html-code')
// 		,cssCode = $('#js-css-code')
// 		, jsCode = $('#js-js-code');
		
	

// 	myedit.cm = {};
// 	myedit.demoFrameDocument = frame.contentDocument || frame.contentWindow.document;

// 	function resetSplitting() {
		
// 		$('#js-html-code').setAttribute('style', '');
// 		$('#js-css-code').setAttribute('style', '');
// 		$('#js-js-code').setAttribute('style', '');
// 		$('#js-code-side').setAttribute('style', '');
// 		$('#js-demo-side').setAttribute('style', '');

// 		Split(['#js-html-code', '#js-css-code', '#js-js-code'], {
// 			direction: (currentLayoutMode === 2 ? 'horizontal' : 'vertical')
// 		});
// 		Split(['#js-code-side', '#js-demo-side' ], {
// 			direction: (currentLayoutMode === 2 ? 'vertical' : 'horizontal')
// 		});
// 	}
// 	window.toggleLayout = function (mode) {
// 		currentLayoutMode = 2;
// 		document.body.classList.add('layout-2');

// 		resetSplitting();
// 	}

	
// 	myedit.setPreviewContent = function () {
// 		var self = this;
// 		var html = myedit.cm.html.getValue();
// 		var css = myedit.cm.css.getValue();
// 		var js = myedit.cm.js.getValue();


// 		html = '<html>\n<head>\n<style>\n' + css + '\n</style>\n</head>\n<body>\n' + html + '\n<script>\n' + js + '\n</script></body>\n</html>';

// 		frame.src="data:text/html;charset=utf-8," + escape(html);
// 		console.log(frame);
		
// 	};

// 	function initEditor(element, options) {
// 		var cm = CodeMirror(element, {
// 			mode: options.mode,
// 			lineNumbers: true,
// 			lineWrapping: true,
// 			autofocus: options.autofocus || false,
// 			autoCloseBrackets: true,
//     		matchBrackets: true,
// 			tabMode: 'indent',
// 			theme: 'monokai',
// 			// cursorScrollMargin: '20', has issue with scrolling
// 			profile: options.profile || ''
// 		});
// 		cm.on('change', function onChange() {
// 			console.log("changed");
// 			clearTimeout(updateTimer);
// 			updateTimer = setTimeout(function () {
// 				myedit.setPreviewContent();
// 			}, updateDelay);
// 		});
// 		return cm;
// 	}

// 	myedit.cm.html = initEditor(htmlCode, {
// 		mode: 'htmlmixed',
// 		autofocus: true,
// 		profile: 'xhtml'
// 	});
// 	emmetCodeMirror(myedit.cm.html);
// 	myedit.cm.css = initEditor(cssCode, {
// 		mode: 'css'
// 	});
// 	emmetCodeMirror(myedit.cm.css);
// 	myedit.cm.js = initEditor(jsCode, {
// 		mode: 'javascript'
// 	});

// 	function init () {
		
// 		toggleLayout(2);
// 	}

// 	init();

// })();