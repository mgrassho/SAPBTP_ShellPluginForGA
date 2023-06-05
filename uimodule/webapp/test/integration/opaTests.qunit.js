/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/sap/btp/co/gaflpplugin/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
