/**
 * Ready helper that sets the function when device ready or dom ready
 */
var Ready = function(func){
	var event = /https?:\/\//.test(window.document.URL) ? 'DOMContentLoaded' : 'deviceready';
	window.document.addEventListener(event, func, false);
};


/**
 * Write and read files helper for cordova apps
 * Requires cordova-plugin-file
 * https://github.com/apache/cordova-plugin-file
 */

var fileWR = {
	directory : 'cdvfile://localhost/persistent/',

	/**
	 * @param string
	 * @param content
	 * @param function (optional)
	 * @param function (optional)
	 * @param boolean (optional)
	 * @return void
	 * On success pass the fileEntry object
	 */
	save2file : function(filename, content, onSuccess, onError, rewrite){ alert('save2file')
		var rewrite =
			typeof rewrite === 'boolean' ?
				rewrite :
				typeof onError === 'boolean' ?
					onError :
					true;
		var onError =
			onError && onError.call ?
				onError :
				function(){};

		window.resolveLocalFileSystemURL(this.directory, function(dir) {
			dir.getFile(filename, {create:true}, function(file) {
				file.createWriter(function(fileWriter) {
					fileWriter.onwriteend = function(e) {
						if (onSuccess && onSuccess.call)
							// pass the fileEntry
							onSuccess(file);
				    };

				    fileWriter.onerror = onError;

					if (!rewrite)
						fileWriter.seek(fileWriter.length);

					var bb = new Blob([content], {type: 'text/plain'});
					fileWriter.write(bb);
				}, onError);
			}, onError);
		}, onError);

	},



	/**
	 * @param string
	 * @param function
	 * @param function (optional)
	 * @return void
	 * On succes pass the reader object as this
	 */
	readFile : function(filename, onSuccess, onError){
		var onError = onError || function(){};
		if (onSuccess == []._)
			return null;
		window.resolveLocalFileSystemURL(this.directory, function(dir) {
			dir.getFile(filename, {create:true}, function(file) {
				file.file(function(file) {
					var reader = new FileReader();
					reader.onload = function(){
						// pass the reader object
						onSuccess.call(this);
					};
					reader.onerror = onError;
					reader.readAsText(file);
				}, onError);
			}, onError);
		}, onError);
	},

	/**
	 * @param string
	 * @param function (optional)
	 * @param function (optional)
	 * @return void
	 */
	removeFile : function(filename, onSuccess, onError){
		var onError = onError || function(){},
			onSuccess = onSuccess || function(){};
		window.resolveLocalFileSystemURL(this.directory, function(dir) {
			dir.getFile(filename, {create:true}, function(file) {
				file.remove(onSuccess, onError);
			}, onError);
		}, onError);
	}
};

/**
 * Example
 */
Ready(function(){
	setTimeout(function(){
		fileWR.save2file('huha.txt', 'success', function(){ alert(899)
			fileWR.readFile('huha.txt', function(){
				document.body.innerHTML = this.result;
			});
		}, false);
	},2000);
});