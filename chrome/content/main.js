
// Make a namespace.
if (typeof Socialnetworks == 'undefined') {
  var Socialnetworks = {};
}

/**
 * UI controller that is loaded into the main player window
 */
Socialnetworks.Controller = {

  /**
   * Called when the window finishes loading
   */
  onLoad: function() {


    this.createServicepaneNode();


    // initialization code
    this._initialized = true;
    this._strings = document.getElementById("socialnetworks-strings");
    
	
    // Perform extra actions the first time the extension is run
    if (Application.prefs.get("extensions.socialnetworks.firstrun").value) {
      Application.prefs.setValue("extensions.socialnetworks.firstrun", false);
      this._firstRunSetup();
    }


    

  },
  

  /**
   * Called when the window is about to close
   */
  onUnLoad: function() {
    this._initialized = false;
  },
  

  
  /**
   * Perform extra setup the first time the extension is run
   */
  _firstRunSetup : function() {
  
    // Call this.doHelloWorld() after a 3 second timeout
    alert("premier lancement");
  
  },


  createServicepaneNode: function() {
	  this._servicePaneService =
      Components.classes['@getnightingale.com/servicepane/service;1']
                .getService(Components.interfaces.sbIServicePaneService);
	try{
	
	var servicesNode = this._servicePaneService.getNode('SB:Services');
    if (!servicesNode) {
      servicesNode = this._servicePaneService.createNode();
      servicesNode.id = 'SB:Services';
      servicesNode.className = 'folder services';
      servicesNode.editable = false;
      servicesNode.name = SBString("servicesource.services");
      servicesNode.setAttributeNS('http://getnightingale.com/rdf/servicepane#',
                                  'Weight',
                                  1);
      this._servicePaneService.root.appendChild(servicesNode);
    } else {
      servicesNode.hidden = false;
    }

     
	var addonNode = this._servicePaneService.getNode('SB:Socialnetworks');
	if (!addonNode) {
		var myNode = this._servicePaneService.createNode();
		myNode.id = 'SB:Socialnetworks';
		myNode.url = 'chrome://socialnetworks/content/mainview.xul';
		myNode.image = 'chrome://socialnetworks/skin/node-icon.png';
		myNode.className = 'Socialnetworks';
		myNode.name = 'Social-Networks';
		myNode.setAttributeNS('http://getnightingale.com/rdf/servicepane#',
                          "addonID",
                          "{cc4721c3-4a77-4462-a8cf-e9ec6939452e}");

		servicesNode.appendChild(myNode);


  }
  else {
     addonNode.hidden = false;
  }
	} catch (e) {
    Cu.reportError(e);
  }
  },
  


  
};

window.addEventListener("load", function(e) { Socialnetworks.Controller.onLoad(e); }, false);
window.addEventListener("unload", function(e) { Socialnetworks.Controller.onUnLoad(e); }, false);
