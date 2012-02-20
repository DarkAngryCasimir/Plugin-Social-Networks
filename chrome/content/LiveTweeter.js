// Make a namespace.
if (typeof livetweeter == 'undefined') {
  var livetweeter = {};
}

if (typeof Cc == 'undefined')
	var Cc = Components.classes;
if (typeof Ci == 'undefined')
	var Ci = Components.interfaces;

// Grab our preferences	
var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch2);	

//Twitter
var twitter_login           = prefs.getCharPref("extensions.livetweeter.twitter.login");
var twitter_password        = prefs.getCharPref("extensions.livetweeter.twitter.password");
var twitter_activate        = prefs.getBoolPref("extensions.livetweeter.twitter.activate");
var twitter_accountused     = prefs.getCharPref("extensions.livetweeter.twitter.accountused");
var twitter_messagebefore   = prefs.getCharPref("extensions.livetweeter.twitter.messagebefore");
var twitter_messageafter    = prefs.getCharPref("extensions.livetweeter.twitter.messageafter");
var twitter_info            = prefs.getBoolPref("extensions.livetweeter.twitter.info");    
//Identi.ca
var identica_login           = prefs.getCharPref("extensions.livetweeter.identica.login");
var identica_password        = prefs.getCharPref("extensions.livetweeter.identica.password");
var identica_activate        = prefs.getBoolPref("extensions.livetweeter.identica.activate");
var identica_accountused     = prefs.getCharPref("extensions.livetweeter.identica.accountused");
var identica_messagebefore   = prefs.getCharPref("extensions.livetweeter.identica.messagebefore");
var identica_messageafter    = prefs.getCharPref("extensions.livetweeter.identica.messageafter");
var identica_info            = prefs.getBoolPref("extensions.livetweeter.identica.info");
//Other    
var skype_activate          = prefs.getBoolPref("extensions.livetweeter.skype.activate");
var txtfile_activate        = prefs.getBoolPref("extensions.livetweeter.txtfile.activate");
var txtfile_path            = prefs.getCharPref("extensions.livetweeter.txtfile.path");
var order                   = prefs.getCharPref("extensions.livetweeter.order");
var paused                  = prefs.getBoolPref("extensions.livetweeter.paused");
    
/**
 * UI controller that is loaded into the main player window
 */
livetweeter.Controller = {
	
  /**
   * Called when the window finishes loading
   */
  onLoad: function() {
	  
    var myPrefObserver = {  
      register: function() {  
        // First we'll need the preference services to look for preferences.  
        var prefService = Components.classes["@mozilla.org/preferences-service;1"]  
                                    .getService(Components.interfaces.nsIPrefService);  
      
        // For this._branch we ask that the preferences for extensions.myextension. and children  
        this._branch = prefService.getBranch("extensions.livetweeter.");  
      
        // Now we queue the interface called nsIPrefBranch2. This interface is described as:    
        // "nsIPrefBranch2 allows clients to observe changes to pref values."  
        this._branch.QueryInterface(Components.interfaces.nsIPrefBranch2);  
      
        // Finally add the observer.  
        this._branch.addObserver("", this, false);  
      },  
      
      unregister: function() {  
        if (!this._branch) return;  
        this._branch.removeObserver("", this);  
      },  
      
      observe: function(aSubject, aTopic, aData) {  
        if(aTopic != "nsPref:changed") return;  
        // aSubject is the nsIPrefBranch we're observing (after appropriate QI)  
        // aData is the name of the pref that's been changed (relative to aSubject)  
        switch (aData) {  
          case "statusbar":  
				if (prefs.getBoolPref("extensions.livetweeter.statusbar") == true) {
					document.getElementById("livetweeter-statusbar").setAttribute("hidden", "false");
				} else {
					document.getElementById("livetweeter-statusbar").setAttribute("hidden", "true");
				}
            break;  
          case "toolbar":  
				if (prefs.getBoolPref("extensions.livetweeter.toolbar") == true) {
					document.getElementById("livetweeter-toolbarbutton").setAttribute("hidden", "false");
				} else {
					document.getElementById("livetweeter-toolbarbutton").setAttribute("hidden", "true");
				}
            break;  
        }  
      }  
    }  
    myPrefObserver.register();	  
  
const SONGBIRD_DATAREMOTE_CONTRACTID = "@songbirdnest.com/Songbird/DataRemote;1";
var createDataRemote = new Components.Constructor( SONGBIRD_DATAREMOTE_CONTRACTID,
    Ci.sbIDataRemote, "init");

    // initialization code
    this._initialized = true;
    this._strings = document.getElementById("livetweeter-strings");
    
    // Make a local variable for this controller so that
    // it is easy to access from closures.
    var controller = this;
    
    // Perform extra actions the first time the extension is run
    if (Application.prefs.get("extensions.livetweeter.firstrun147").value) {
      Application.prefs.setValue("extensions.livetweeter.firstrun147", false);
      this._firstRunSetup147();
    }

    if (Application.prefs.get("extensions.livetweeter.firstrun150").value) {
      Application.prefs.setValue("extensions.livetweeter.firstrun150", false);
      this._firstRunSetup150();
    }         

  },
  
  /**
   * Perform extra setup the first time the extension is run
   */
  _firstRunSetup147 : function() {
	Application.prefs.setValue("extensions.livetweeter.twitter.activate", false);
  },
  
  _firstRunSetup150 : function() {
	// Setting up the localized version of "I am listening to" message
	if (Application.prefs.get("extensions.livetweeter.identica.messagebefore").value == "I am listening to") {
		Application.prefs.setValue("extensions.livetweeter.identica.messagebefore", this._strings.getString("iamlisteningto"));
	}
	if (Application.prefs.get("extensions.livetweeter.twitter.messagebefore").value == "I am listening to") {
		Application.prefs.setValue("extensions.livetweeter.twitter.messagebefore", this._strings.getString("iamlisteningto"));
	}
	
	// Add the toolbar button to the default item set of the browser toolbar
	this._insertToolbarItem("nav-bar", "livetweeter-toolbarbutton", "subscription-button");
	
  },
  
  /**
   * Helper to add a toolbaritem within a given toolbar
   * 
   *   toolbar - the ID of a toolbar element
   *   newItem - the ID of a toolbaritem element within the 
   *            associated toolbarpalette
   *   insertAfter - ID of an toolbaritem after which newItem should appear
   */
  _insertToolbarItem: function(toolbar, newItem, insertAfter) {
    var toolbar = document.getElementById(toolbar);
    var list = toolbar.currentSet || "";
    list = list.split(",");
    
    // If this item is not already in the current set, add it
    if (list.indexOf(newItem) == -1)
    {
      // Add to the array, then recombine
      insertAfter = list.indexOf(insertAfter);
      if (insertAfter == -1) {
        list.push(newItem);
      } else {
        list.splice(insertAfter + 1, 0, newItem);
      }
      list = list.join(",");
      
      toolbar.setAttribute("currentset", list);
      toolbar.currentSet = list;
      document.persist(toolbar.id, "currentset");
    }
  },
  
  
  /**
   * Called when the window is about to close
   */
  onUnLoad: function() {
    LiveTweeter.quit();
    this._initialized = false;
  },
};

window.addEventListener("load", function(e) { livetweeter.Controller.onLoad(e); }, false);
window.addEventListener("unload", function(e) { livetweeter.Controller.onUnLoad(e); }, false);

try {

  var LiveTweeter = {
  
	frame: null,
    artistdataremote: null,
    titledataremote: null,
    timeout: null,
    on_artist_change: null,
	pIdx: 0,
    lasturl: "",
    
    showPrefs: function() {
     var windowMediator = Cc["@mozilla.org/appshell/window-mediator;1"]
                               .getService(Ci.nsIWindowMediator);
     var window = windowMediator.getMostRecentWindow("Songbird:Main");
     window.SBOpenPreferences("paneLT");
	},
    
    getPlatform: function() {
	var platform;
	try {
	  var sysInfo = Cc["@mozilla.org/system-info;1"].getService(Ci.nsIPropertyBag2);
	  platform = sysInfo.getProperty("name");
	}
	catch (e) {
	  dump("System-info not available, trying the user agent string.\n");
	  var user_agent = navigator.userAgent;
	  if (user_agent.indexOf("Windows") != -1)
	    platform = "Windows_NT";
	  else if (user_agent.indexOf("Mac OS X") != -1)
	    platform = "Darwin";
	  else if (user_agent.indexOf("Linux") != -1)
	    platform = "Linux";
	  else if (user_agent.indexOf("SunOS") != -1)
	    platform = "SunOS";
	}
	return platform; 
},

    init: function() {
      
var musicListener = {
    onMediacoreEvent: function(ev) {
        switch (ev.type) {
            case Ci.sbIMediacoreEvent.TRACK_CHANGE:
                var mediaItem = ev.data;
                LiveTweeter.onArtistChange();
                break;
            case Ci.sbIMediacoreEvent.STREAM_PAUSE:
                    if (paused == true) {
                      LiveTweeter.quit();
                    }
                break;
            case Ci.sbIMediacoreEvent.STREAM_STOP:
                LiveTweeter.quit();
                break;
            case Ci.sbIMediacoreEvent.STREAM_START:
                    if (paused == true) {
                    //Disable the loadArtist to avoid spamming
                    //LiveTweeter.loadArtist();
                    }                
    }
}
}
gMM.addListener(musicListener);      
      
//this.timeout = setTimeout(function(obj) { obj.loadArtist(); }, 1000, this);
//this.which = 0;

    },

    reset: function() {
    
	  this.frame = null;
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.artistdataremote.unbind();
      this.artistdataremote = null;
      this.titledataremote.unbind();
      this.titledataremote = null;
      this.on_artist_change = null;
    },
    
    sendToImClient: function(exe, str) {
	    var file = Cc["@mozilla.org/file/directory_service;1"]
						    .getService(Ci.nsIProperties)
						    .get("ProfD", Ci.nsIFile);
	    file.append("extensions");
	    file.append("LiveTweeter@geekshadow.com");
	    file.append(exe);
		
		// check if the file exists in case of running the add-on in linked mode
		if (file.exists() == true) { 
	    // create an nsIProcess
	    var process = Cc["@mozilla.org/process/util;1"]
					.createInstance(Ci.nsIProcess);
	    process.init(file);
	    var args = [str];
	    process.run(false, args, args.length);
		}
    },

    toCharRefs: function(text) {
	    var charRefs = [];

	    var codePoint;
	    for( var i = 0; i < text.length; i++ ) {
		    codePoint = text.charCodeAt(i);

		    //if is high surrogate
		    if( 0xD800 <= codePoint && codePoint <= 0xDBFF ) {
			    i++;
			    codePoint = 0x2400 + ((codePoint - 0xD800) << 10) + text.charCodeAt(i);
		    }

            var tmp = codePoint.toString(16);
            if (tmp.length == 2) {
               tmp = '00' + tmp;
            }
            if (tmp.length == 3) {
               tmp = '0' + tmp;
            }
		    charRefs.push( '\\u' +  tmp);
	     }

	     return charRefs.join('');
    },      
	
    loadArtist: function(reset) {

    var platform = LiveTweeter.getPlatform();  

    var url;

    var artist1   = unescape(encodeURIComponent(gMM.sequencer.currentItem.getProperty(SBProperties.artistName)));
    var album1    = unescape(encodeURIComponent(gMM.sequencer.currentItem.getProperty(SBProperties.albumName)));
    var title1    = unescape(encodeURIComponent(gMM.sequencer.currentItem.getProperty(SBProperties.trackName)));
    var artist  = gMM.sequencer.currentItem.getProperty(SBProperties.artistName);
    var album   = gMM.sequencer.currentItem.getProperty(SBProperties.albumName);
    var title   = gMM.sequencer.currentItem.getProperty(SBProperties.trackName);
    var length   = gMM.sequencer.currentItem.getProperty(SBProperties.contentLength);
    var duration = gMM.sequencer.currentItem.getProperty(SBProperties.duration);
    var imageUrl = gMM.sequencer.currentItem.getProperty(SBProperties.primaryImageURL);
    
	  if (order == "artist-title") {
	  var songtext = artist1+" - "+title1;
	  }
	  if (order == "title-artist") {
	  var songtext = title1+" - "+artist1;
	  }	      

    const nsIIOService = Cc["@mozilla.org/network/io-service;1"]
                    .getService(Ci.nsIIOService);  
    
       /*if (imageUrl == "") {
         var image = "";
         }
         if (imageUrl != "") {
         var image = nsIIOService.newURI(imageUrl, null, null).QueryInterface(Ci.nsIFileURL).file.path
         }
         
         //Show picture path + file
         //alert(image); */
    
    var keyword = "";
      this.timeout = null;

  if ((txtfile_activate == true) && (txtfile_path != "")) {
    var file = Cc["@mozilla.org/file/local;1"]
            .createInstance(Ci.nsILocalFile);
    file.initWithPath(txtfile_path);

    var foStream = Cc["@mozilla.org/network/file-output-stream;1"]
            .createInstance(Ci.nsIFileOutputStream);
    // 0x02 = PR_WRONLY (write only)
    // 0x08 = PR_CREATE_FILE (create file if the file doesn't exist)
    // 0x10 = PR_APPEND (append to file with each write)
    foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0);
    if (order == "artist-title") {
    var data = artist1+' - '+title1;
    }
    if (order == "title-artist") {
    var data = title1+' - '+artist1;
    }
    foStream.write(data, data.length);
    foStream.close();
    }
    
		
	if  (skype_activate == true) {
		if (platform == "Linux") {
			if ((artist == "")  && (title == "")) {
				this.sendToImClient("now-playing-x-skype.sh", ""); }
			else {
				if (order == "artist-title") {
					this.sendToImClient("now-playing-x-skype.sh", this.toCharRefs(artist) + " - " + this.toCharRefs(title));
				}
				if (order == "title-artist") {
					this.sendToImClient("now-playing-x-skype.sh", this.toCharRefs(title) + " - " + this.toCharRefs(artist));
				}
			}
		}			
	}	
     
    this._strings = document.getElementById("livetweeter-strings");

   Components.utils.import("resource://livetweeter/twitterHelper.jsm");
   var application_name = "LiveTweeter";

    if (twitter_accountused == "mainaccount") {
    if (twitter_activate == true) {
    if (twitter_login == "Twitter") {
    var message = this._strings.getString("twitterpref");
    alert(message);
    return false
    }
    else

    var twh = new TwitterHelper(twitter_login, twitter_password, document.getElementById("tool-livetweeter"), "twitter");

	  if (artist == "") {
		return false
		}
	  else
	  if (order == "artist-title") {
	  twh.statuses.update(null, null, null, "xml", twitter_messagebefore+" "+ songtext +" "+twitter_messageafter, null, application_name);
	  }
	  if (order == "title-artist") {
    twh.statuses.update(null, null, null, "xml", twitter_messagebefore+" "+ songtext +" "+twitter_messageafter, null, application_name);
    }
    
	  }
	  }
	  
    if (identica_accountused == "mainaccount") {
    if (identica_activate == true) {
    if (identica_login == "Identi.ca") {
    var message = this._strings.getString("identicapref");
    alert(message);
    return false
    }
    else

    var twh = new TwitterHelper(identica_login, identica_password, document.getElementById("tool-livetweeter"), "identi.ca");

	  if (artist == "") {
		return false
		}
	  else
	  if (order == "artist-title") {
	  twh.statuses.update(null, null, null, "xml", identica_messagebefore+" "+ songtext +" "+identica_messageafter, null, application_name);
	  }
	  if (order == "title-artist") {
    twh.statuses.update(null, null, null, "xml", identica_messagebefore+" "+ songtext +" "+identica_messageafter, null, application_name);
    }
    
	  }
	  }
    
      
    },

postTwitterWeb: function(reset) {

	var url;
	var artist = unescape(encodeURIComponent(gMM.sequencer.currentItem.getProperty(SBProperties.artistName)));
	var album = unescape(encodeURIComponent(gMM.sequencer.currentItem.getProperty(SBProperties.albumName)));
	var title = unescape(encodeURIComponent(gMM.sequencer.currentItem.getProperty(SBProperties.trackName)));
	var keyword = "";
	this.timeout = null;

	if (artist == "") {
		return false
	}
	else
	
	if (order == "artist-title") {
	//twh.statuses.update(null, null, null, "xml", twitter_messagebefore+" "+artist+" - "+title+" "+twitter_messageafter, null, application_name);
    gBrowser.loadOneTab("http://twitter.com/?status="+twitter_messagebefore+" "+artist+" - "+title+" "+twitter_messageafter);
	}
	if (order == "title-artist") {
    //twh.statuses.update(null, null, null, "xml", twitter_messagebefore+" "+title+" - "+artist+" "+twitter_messageafter, null, application_name);
    gBrowser.loadOneTab("http://twitter.com/?status="+twitter_messagebefore+" "+title+" - "+artist+" "+twitter_messageafter);
    }      

},

postTwitter: function(reset) {

 function addNotification(aPriority, aMsg) {
      
      function notificationCallback(notificationElement, notifcationButton) {
	var url = "http://twitter.com/" + twitter_login;
	gBrowser.loadOneTab(url);
      }

    var mTop = gBrowser.getNotificationBox(gBrowser.selectedBrowser);
    
    var notificationImage = "http://a1.twimg.com/a/1261078355/images/favicon.ico";
    var notificationButtons = [{accessKey: null,
                                callback: notificationCallback,
                                label: "Go",
                                popup: null}]

    mTop.removeAllNotifications(false);
    mTop.appendNotification(aMsg,
                            aPriority,
                            notificationImage,
                            aPriority,
                            notificationButtons);
  }


      var url;
         var artist = unescape(encodeURIComponent(gMM.sequencer.currentItem.getProperty(SBProperties.artistName)));
         var album = unescape(encodeURIComponent(gMM.sequencer.currentItem.getProperty(SBProperties.albumName)));
         var title = unescape(encodeURIComponent(gMM.sequencer.currentItem.getProperty(SBProperties.trackName)));
      var keyword = "";
      this.timeout = null;
      
      this._strings = document.getElementById("livetweeter-strings");
     
    if (twitter_login == "Twitter") {
    var message = this._strings.getString("twitterpref");
    alert(message);
    return false
    }
  else

Components.utils.import("resource://livetweeter/twitterHelper.jsm");
var application_name = "LiveTweeter";
var twh = new TwitterHelper(twitter_login, twitter_password, document.getElementById("tool-livetweeter"), "twitter");

	  if (artist == "") {
		return false
		}
	  else
	  if (order == "artist-title") {
	  twh.statuses.update(null, null, null, "xml", twitter_messagebefore+" "+artist+" - "+title+" "+twitter_messageafter, null, application_name);
	  }
	  if (order == "title-artist") {
    twh.statuses.update(null, null, null, "xml", twitter_messagebefore+" "+title+" - "+artist+" "+twitter_messageafter, null, application_name);
    }
	         
addNotification(1,this._strings.getString("songposted") + " http://twitter.com/" + twitter_login);
	  
},

postIdentica: function(reset) {

 function addNotification(aPriority, aMsg) {
      
      function notificationCallback(notificationElement, notifcationButton) {
	var url = "http://identi.ca/" + identica_login;
	gBrowser.loadOneTab(url);
      }

    var mTop = gBrowser.getNotificationBox(gBrowser.selectedBrowser);
    
    var notificationImage = "http://identi.ca/favicon.ico";
    var notificationButtons = [{accessKey: null,
                                callback: notificationCallback,
                                label: "Go",
                                popup: null}]

    mTop.removeAllNotifications(false);
    mTop.appendNotification(aMsg,
                            aPriority,
                            notificationImage,
                            aPriority,
                            notificationButtons);
  }


      var url;
         var artist = unescape(encodeURIComponent(gMM.sequencer.currentItem.getProperty(SBProperties.artistName)));
         var album = unescape(encodeURIComponent(gMM.sequencer.currentItem.getProperty(SBProperties.albumName)));
         var title = unescape(encodeURIComponent(gMM.sequencer.currentItem.getProperty(SBProperties.trackName)));
      var keyword = "";
      this.timeout = null;
      
      this._strings = document.getElementById("livetweeter-strings");
     
    if (identica_login == "Identi.ca") {
    var message = this._strings.getString("identicapref");
    alert(message);
    return false
    }
  else

Components.utils.import("resource://livetweeter/twitterHelper.jsm");
var application_name = "LiveTweeter";
var twh = new TwitterHelper(identica_login, identica_password, document.getElementById("tool-livetweeter"), "identi.ca");

	  if (artist == "") {
		return false
		}
	  else
	  if (order == "artist-title") {
	  twh.statuses.update(null, null, null, "xml", identica_messagebefore+" "+artist+" - "+title+" "+identica_messageafter, null, application_name);
	  }
	  if (order == "title-artist") {
    twh.statuses.update(null, null, null, "xml", identica_messagebefore+" "+title+" - "+artist+" "+identica_messageafter, null, application_name);
    }
	         
addNotification(1,this._strings.getString("songposted") + " http://identi.ca/" + identica_login);
},

quit: function(reset) {

var platform = LiveTweeter.getPlatform(); 

      var url;
      var keyword = "";
      this.timeout = null;

    if ((txtfile_activate == true) && (txtfile_path != "")) {
    var file = Cc["@mozilla.org/file/local;1"]
            .createInstance(Ci.nsILocalFile);
    file.initWithPath(txtfile_path);

    var foStream = Cc["@mozilla.org/network/file-output-stream;1"]
            .createInstance(Ci.nsIFileOutputStream);
    // 0x02 = PR_WRONLY (write only)
    // 0x08 = PR_CREATE_FILE (create file if the file doesn't exist)
    // 0x10 = PR_APPEND (append to file with each write)
    foStream.init(file, 0x02 | 0x08 | 0x20, 0666, 0);
    var data = "";
    foStream.write(data, data.length);
    foStream.close();
    }
    
    if (skype_activate == true) {
		if  (platform == "Linux") {
			this.sendToImClient("now-playing-x-skype.sh", "");
		}
	 }    

},

    onArtistChange: function() {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(function(obj) { obj.loadArtist(); },
			  1000, this);
    }
  }
  
LiveTweeter.init();
} catch (e) {
}

