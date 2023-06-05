# Google Analytics FLP Shell Plugin

This is a shell plugin for SAP Work Zone, standard (a.k.a SAP BTP Launchpad service), that enables Google Anaytics 4 data collection. It encapsulated the external GA lib so that it is locally served from the deployment target (Fiori Launchpad), instead of being loaded from the CDN.
This is just a PoC to demonstrate the initial steps to enable GA4 and it shows:

* General structure of a shell plugin
* Use of external libs in an shell plugin

## Recreate the project from scratch by following these steps

You can run these instruction in the SAP Business Application Studio or in your local Visual Studio Code editor.

1. Install yo generator as described here [github](https://github.com/ui5-community/generator-ui5-flp-plugin)
1. Create your project with

   ```bash
   yo easy-ui5 flp-plugin
   ````

1. Provide a name and a namespace as you like
1. Choose "SAP Launchpad Service" to host your application
1. Choose "Content Delivery Network" as serving lib location
1. Select any additional example code as you like. You can add more behavior than just GA to your extension

This creates a minimum shell plugin project.

Now, make sure your Google Analytics account is setup and you have a property defined in the GA Admin cockpit.

In the instructions in the GA Cockpit check the code for the manual setting up your site. It should look similar to this:

```javascript
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-XXXXXXXX');
</script>
```

Where G-XXXXXXXX is your personal GA token.

Download the script under src to your project and place it into a freshly created folder uimodule/webapps/libs and name it gtag.js.

Next, open the uimodule/webapp/Component.js and add the lib reference in the under sap.ui.define, such as:
```javascript
sap.ui.define([
	"sap/ui/core/Component",
	"sap/base/util/ObjectPath",
	"sap/m/Button",
	"sap/m/Bar",
	"sap/m/MessageToast",
	"your/component/name/from/manifest/libs/gtag"
]
```

Please check the component name in your manifest.json and place the appropriate path information into the list. Dots in the componant name will be replaced by slashes. Also notice, that you append "libs/gtag" without the ".js".

Next, add the gtag init script into to the init() component function as follows:

```javascript
window.dataLayer = window.dataLayer || [];

function gtag(){dataLayer.push(arguments)};
gtag('js', new Date());
gtag('config', 'G-XXXXXXXXX');
```

Please note that you substitute your personal GA token into the last config parameter.

You can now use cf cli to logon and deploy to your SAP BTP account:

```bash
cf login
npm run deploy
```

This deploys the plugin to SAP BTP. In the last step you need to navigate to your SAP Work Zone, standard admin cockpit and assign the plugin to a site and to the EVERYONE role.

Open your site in the browser. Make sure your Adblockers are disabled. Many will automatically block GA URLs.

## Warning

Do not use the gtag.js from this project. Always overwrite it with your own as it contains the individual GA token.
