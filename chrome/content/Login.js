function openLoginTwitter() {
	var windowWidth = 500;
	var windowHeight = 200;
	
	window.openDialog('twitLog.xul','Connection_to_Twitter','left='+((window.outerWidth/2)-(windowWidth/2))+','
                                                + 'top='+((window.outerHeight/2)-(windowHeight/2))+','
												+ 'width=' + windowWidth + ','
												+ 'height=' + windowHeight + ','
												+ 'chrome,modal=no,titlebar=no,resizable=no', null);
}