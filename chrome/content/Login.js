function openLoginTwitter() {
	//window.openDialog("chrome://plugin-social-networks-for-nightingale/content/twitLog.xul", "_blank", "chrome,modal=no,titlebar=no,resizable=no", null);
	var windowWidth = 500;
	var windowHeight = 200;
	
	window.openDialog('twitLog2.xul','Connection_to_Twitter','left='+((window.outerWidth/2)-(windowWidth/2))+','
                                                + 'top='+((window.outerHeight/2)-(windowHeight/2))+','
												+ 'width=' + windowWidth + ','
												+ 'height=' + windowHeight + ','
												+ 'chrome,modal=no,titlebar=no,resizable=no', null);
}