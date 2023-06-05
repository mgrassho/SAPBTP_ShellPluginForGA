sap.ui.define([
	"sap/ui/core/Component",
	"sap/base/util/ObjectPath",
	"sap/m/Button",
	"sap/m/Bar",
	"sap/m/MessageToast",
	"com/sap/btp/co/gaflpplugin/libs/gtag"
], function (Component, ObjectPath, Button, Bar, MessageToast, gtag) {

	return Component.extend("com.sap.btp.co.gaflpplugin.Component", {

		metadata: {
			"manifest": "json"
		},

		init: function () {
			var rendererPromise = this._getRenderer();
			var oResourceBundle = this.getModel("i18n").getResourceBundle();

			window.dataLayer = window.dataLayer || [];

  			function gtag(){dataLayer.push(arguments)};
  			gtag('js', new Date());
  			gtag('config', 'G-FL9Y3YTQB4');
			
		},

		/**
		 * Returns the shell renderer instance in a reliable way,
		 * i.e. independent from the initialization time of the plug-in.
		 * This means that the current renderer is returned immediately, if it
		 * is already created (plug-in is loaded after renderer creation) or it
		 * listens to the &quot;rendererCreated&quot; event (plug-in is loaded
		 * before the renderer is created).
		 *
		 *  @returns {Promise} a Promise which will resolve with the renderer instance, 
		 * 					   or be rejected with an error message.
		 */
		_getRenderer: function () {
			return new Promise(function(fnResolve, fnReject) {
				this._oShellContainer = ObjectPath.get("sap.ushell.Container");
				if (!this._oShellContainer) {
					fnReject(
						"Illegal state: shell container not available; this component must be executed in a unified shell runtime context."
					);
				} else {
					var oRenderer = this._oShellContainer.getRenderer();
					if (oRenderer) {
						fnResolve(oRenderer);
					} else {
						// renderer not initialized yet, listen to rendererCreated event
						this._onRendererCreated = function(oEvent) {
							oRenderer = oEvent.getParameter("renderer");
							if (oRenderer) {
								fnResolve(oRenderer);
							} else {
								fnReject(
									"Illegal state: shell renderer not available after receiving 'rendererLoaded' event."
								);
							}
						};
						this._oShellContainer.attachRendererCreatedEvent(
							this._onRendererCreated
						);
					}
				}
			}.bind(this));
		},

		exit: function () {
		    if (this._oShellContainer && this._onRendererCreated) {
			this._oShellContainer.detachRendererCreatedEvent(this._onRendererCreated);
		    }
		}
	});
});
