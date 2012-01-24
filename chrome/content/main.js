
// Make a namespace.
if (typeof SocialNetworksPlugin == 'undefined') {
  var SocialNetworksPlugin = {};
}

/**
 * UI controller that is loaded into the main player window
 */
SocialNetworksPlugin.Controller = {

  /**
   * Called when the window finishes loading
   */
  onLoad: function() {


    this.createServicepaneNode();


    // initialization code
    this._initialized = true;
    this._strings = document.getElementById("social-networks-plugin-strings");
    
    // Perform extra actions the first time the extension is run
    if (Application.prefs.get("extensions.social-networks-plugin.firstrun").value) {
      Application.prefs.setValue("extensions.social-networks-plugin.firstrun", false);
      this._firstRunSetup();
    }


    // Add the toolbar button to the default item set of the browser toolbar.
    // TODO: Should only do this on first run, but Bug 6778 requires doing it
    // every load.
    this._insertToolbarItem("nav-bar", "social-networks-plugin-toolbarbutton", "subscription-button");

    

    // Make a local variable for this controller so that
    // it is easy to access from closures.
    var controller = this;
    
    // Attach doHelloWorld to our helloworld command
    this._helloWorldCmd = document.getElementById("social-networks-plugin-helloworld-cmd");
    this._helloWorldCmd.addEventListener("command", 
         function() { controller.doHelloWorld(); }, false);

  },
  

  /**
   * Called when the window is about to close
   */
  onUnLoad: function() {
    this._initialized = false;
  },
  

  /**
   * Sample command action
   */
  doHelloWorld : function() {
    var message = "SocialNetworksPlugin: " + this._strings.getString("helloMessage");
    alert(message);
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

	
	var radioNode = this._servicePaneService.getNode('SB:RadioStations');
    if (!radioNode) {
      radioNode = this._servicePaneService.createNode();
      radioNode.id = 'SB:RadioStations';
      radioNode.className = 'folder radio';
      radioNode.editable = false;
      radioNode.name = SBString("servicesource.radio");
      radioNode.setAttributeNS('http://getnightingale.com/rdf/servicepane#',
                               'Weight',
                               1);
      this._servicePaneService.root.appendChild(radioNode);
    } else {
      radioNode.hidden = false;
    }
     
	var addonNode = this._servicePaneService.getNode('SB:SocialNetworksPlugin');
	if (!addonNode) {
		var myNode = this._servicePaneService.createNode();
		myNode.id = 'SB:SocialNetworksPlugin';
		myNode.url = 'chrome://social-networks-plugin/content/mainview.xul';
		myNode.image = 'chrome://social-networks-plugin/skin/node-icon.png';
		myNode.className = 'SocialNetworksPlugin';
		myNode.name = 'Social Networks plugin';
		myNode.setAttributeNS('http://getnightingale.com/rdf/servicepane#',
                          "addonID",
                          "{b359fb9e-293e-4bc7-af6f-388ae1201aaa}");

		servicesNode.appendChild(myNode);


		radioNode.appendChild(myNode);

  }
  else {
     addonNode.hidden = false;
  }
	} catch (e) {
    Cu.reportError(e);
  }
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
  }

  
};

window.addEventListener("load", function(e) { SocialNetworksPlugin.Controller.onLoad(e); }, false);
window.addEventListener("unload", function(e) { SocialNetworksPlugin.Controller.onUnLoad(e); }, false);
