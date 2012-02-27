
// Make a namespace.
if (typeof PluginSocialNetworksForNightingale == 'undefined') {
  var PluginSocialNetworksForNightingale = {};
}

/**
 * UI controller that is loaded into the main player window
 */
PluginSocialNetworksForNightingale.Controller = {

  /**
   * Called when the window finishes loading
   */
  onLoad: function() {


    this.createServicepaneNode();


    // initialization code
    this._initialized = true;
    this._strings = document.getElementById("plugin-social-networks-for-nightingale-strings");
    
    // Perform extra actions the first time the extension is run
    if (Application.prefs.get("extensions.plugin-social-networks-for-nightingale.firstrun").value) {
      Application.prefs.setValue("extensions.plugin-social-networks-for-nightingale.firstrun", false);
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
    setTimeout(function(controller) { controller.doHelloWorld(); }, 3000, this); 
  
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

     
	var addonNode = this._servicePaneService.getNode('SB:PluginSocialNetworksForNightingale');
	if (!addonNode) {
		var myNode = this._servicePaneService.createNode();
		myNode.id = 'SB:PluginSocialNetworksForNightingale';
		myNode.url = 'chrome://plugin-social-networks-for-nightingale/content/mainview.xul';
		myNode.image = 'chrome://plugin-social-networks-for-nightingale/skin/node-icon.png';
		myNode.className = 'PluginSocialNetworksForNightingale';
		myNode.name = 'Plugin Social Networks for Nightingale';
		myNode.setAttributeNS('http://getnightingale.com/rdf/servicepane#',
                          "addonID",
                          "{6f0ce25d-11f6-4c7f-a224-b1b2474b8061}");

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

window.addEventListener("load", function(e) { PluginSocialNetworksForNightingale.Controller.onLoad(e); }, false);
window.addEventListener("unload", function(e) { PluginSocialNetworksForNightingale.Controller.onUnLoad(e); }, false);
