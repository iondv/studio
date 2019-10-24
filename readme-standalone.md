The **standalone** script to run the application allows you to access the file system via api.

## How to start?

Run node.js as a standalone application:
* Run the `git clone https://github.com/iondv/studio.git.` command. Change the local directory to **studio**.
* Run the `npm install` command to install all the necessary dependencies, including the local gulp build application.
* Please check that **Gulp** of the **4.0** version is installed globally.
* Run the `gulp build` command to build the app.
* Run the app with the `node standalone` command.
* Go to the browser at **http://localhost:8888** address.

## Create app

When creating the application, select the storage location - file system or browser storage. 
To select a file system, check the **"Server sync"** in the box, then a form will open with a field to fill in the application storage path.
When specifying the path, the system name of the application is automatically substituted in the corresponding field.
When creating the application, the structure of the application folders is formed in the file system,at the specified path. The new entities in the studio are displayed in the corresponding application folder.

## Change files

You can change files independently of the studio. When you click an object in the studio, the date of change is checked and if it's different and no new changes, the date is updated.
If the file has changes, the system will propose to update it.