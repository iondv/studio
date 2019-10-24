<h1 align="center"> <a href="https://www.iondv.com/"><img src="/studio_logo_mini.png" alt="IONDV. Framework" width="600" align="center"></a>
</h1>  

<h4 align="center">JS framework for rapid business application development</h4>
  
<p align="center">
<a href="http://www.apache.org/licenses/LICENSE-2.0"><img src="https://img.shields.io/badge/license-Apache%20License%202.0-blue.svg?style=flat" alt="license" title=""></a>
</p>

<div align="center">
  <h3>
    <a href="https://www.iondv.com/" target="_blank">
      Website
    </a>
    <span> | </span>
    <a href="https://www.iondv.com/portal/get-it" target="_blank">
      Get it Free
    </a>
    <span> | </span>
    <a href="https://github.com/iondv/framework/docs/en/index.md" target="_blank">
      Documentation
    </a>
  </h3>
</div>

<p align="center">
<a href="https://twitter.com/ion_dv" target="_blank"><img src="/twitter.png" height="36px" alt="" title=""></a>
<a href="https://www.facebook.com/iondv/" target="_blank"><img src="/facebook.png" height="36px" margin-left="20px" alt="" title=""></a>
<a href="https://www.linkedin.com/company/iondv/" target="_blank"><img src="/linkedin.png" height="36px" margin-left="20px" alt="" title=""></a>
<a href="https://www.instagram.com/iondv/" target="_blank"><img src="/insta.png" height="36px" margin-left="20px" alt="" title=""></a> 
</p>

# IONDV. Studio

Эта страница на [Русском](/readme_ru.md)

**Studio** is an IONDV. Framework application. It may be used as a standalone node.js application or a Desktop application.

#### Start with IONDV. Framework

* [IONDV. Framework](https://github.com/iondv/framework/)
* [IONDV. Framework Docs](https://github.com/iondv/framework/blob/master/docs/en/index.md)

<h1 align="center"> <a href="https://www.iondv.com/"><img src="/iondv-studio.png" alt="IONDV. Studio" align="center"></a>
</h1>  


## Description 

**Studio** is created to develop or edit metadata (for example class, navigation, view, workflow, 
portal interfaces) that can be deployed as an IONDV application. 

### How to create an app?

Watch a brief [video](https://www.youtube.com/watch?v=e201ko9fkQ8&t=331s) about the creation of a simple app - [IONDV. Nutrition-tickets](https://github.com/iondv/nutrition-tickets) in **IONDV. Studio**. [Tutorial](https://github.com/iondv/nutrition-tickets/blob/master/tutorial/en/index.md) is available in the **IONDV. Nutrition-Tickets** repository.

<a href="https://www.youtube.com/watch?v=e201ko9fkQ8&t=331s" target="_blank"><img src="/tickets_video.png" height="250px" alt="" title=""></a>

Steps to create an application using IONDV. Studio:

1. Create an application by clicking on the `+`. In the pop-up window, fill in the required fields. The tab of the application you created appears in the upper left corner and easy to control as a browser tabs.

2. A side menu appears - the application's work panel. The classes section is used to create classes and attributes.

3. An application starts with a class. Click on the class and in the workspace click `+ Class`. And in the pop-up window we fill in the required fields. Description of the fields can be found [here](https://github.com/iondv/framework/blob/master/docs/en/2_system_description/metadata_structure/meta_class/meta_class_main.md).

4. We have a class with the ID attribute which is created automatically.

5. When a class is highlighted, you can add attributes to it by clicking on the `+ attribute`. Description of properties and attribute types can be found [here](https://github.com/iondv/framework/blob/master/docs/en/2_system_description/metadata_structure/meta_class/meta_class_attribute.md).

6. When you have at least 2 classes, you can configure connections between them. This is done by setting the data type when creating a class attribute. The main types are [Collection](https://github.com/iondv/framework/blob/master/docs/en/2_system_description/metadata_structure/meta_class/atr_itemclass_backcoll.md) and [Reference](https://github.com/iondv/framework/blob/master/docs/en/2_system_description/metadata_structure/meta_class/atr_ref_backref.md). The specified data type of the attribute will be displayed in the workspace as a connecting line.

The classes you created and their attributes will appear in the "Class" section. This is called the project tree, which will guide you when the application classes become larger.

This is the basic steps to create an app.

### IONDV. Framework in brief

**IONDV. Framework** - is a node.js open source framework for developing accounting applications
or microservices based on metadata and individual modules. Framework is a part of 
instrumental digital platform to create enterprise 
(ERP) apps. This platform consists of the following open-source components: the [IONDV. Framework](https://github.com/iondv/framework), the
[modules](https://github.com/topics/iondv-module) и ready-made applications expanding it
functionality, visual development environment [Studio](https://github.com/iondv/studio) to create metadata for the app.

* For more details, see [IONDV. Framework site](https://iondv.com). 

* Documentation is available in the [Github repository](https://github.com/iondv/framework/blob/master/docs/en/index.md).

Below is a short introduction in the metadata types. Please read it to become more confident in using **IONDV. Studio**.

<details>
  <summary> 
    <h3> 
      Metadata Description
    </h3> 
  </summary>

[IONDV. Framework](https://iondv.com/) is based on metadata. Metadata (Meta) - a complex of JSON files that describe the set of structures, which the app uses to operate. We have three main types of meta: meta class, meta view and meta navigation. 

### Class

Click plus to create a new class, you will see a new window with five fields to fill in. Two of them - marked with a red asterisk - are mandatory to fill: Name and Caption. The other three fields are the properties that describe the class: Ancestor, Creation tracker, Modification tracker.

* **Name** - the system name.
* **Caption** - the logical name that is displayed in the UI.
* **Ancestor** - the inheritance that allows you to create a new meta class based on a parent one with all its attributes. [Read more](https://github.com/iondv/framework/blob/master/docs/en/2_system_description/metadata_structure/meta_class/ancestor.md).
* **Creation tracker**- the time tag of created objects: allows you to save the date/time of creation of the object in the class. It requires the corresponding class attribute, "name" of which should be entered into this field. [Read more](https://github.com/iondv/framework/blob/master/docs/en/2_system_description/metadata_structure/meta_class/time_user_tracker.md).
* **Modification tracker** - the time tag of committed changes: allows you to save the date/time of committed changes of the object in the class. It requires the corresponding class attribute, "name" of which be entered into this field. [Read more](https://github.com/iondv/framework/blob/master/docs/en/2_system_description/metadata_structure/meta_class/time_user_tracker.md).

### Class Attributes

Click plus to create a new class attribute, and you will see a new window with seven fildes to fill in.
Three of them are mandatory to fill - Name and Caption mean the same as for class.

* **Attribute types** - indicates the type of data supported by the attribute. [Read more](https://github.com/iondv/framework/blob/master/docs/en/2_system_description/metadata_structure/meta_class/property_types.md).
* **Order number** - sets the position of the attribute regarding the other attributes of the same class.
* **Hint** - specifies the message that will appear in the UI next to the attribute name.
* **Reference class** - is a data type that stores a simple value and that system interprets as a reference to the key attribute of an object of another class. [Read more](https://github.com/iondv/framework/blob/master/docs/en/2_system_description/metadata_structure/meta_class/atr_ref_backref.md).
* **Item class** - is a data type that allows you to display the list of other objects in one. [Read more](https://github.com/iondv/framework/blob/master/docs/en/2_system_description/metadata_structure/meta_class/atr_itemclass_backcoll.md).
* **Read-only** - allows or denies changing the attribute value.
* **Nullable** - allows or denies an empty attribute value.
* **Unique** - is a unique value that disables create two class objects with the same values.
* **Auto-assigned** - allows or denies autocompletion of the fields.

### IONDV. Framework Documentation
The IONDV.Framework documentation is available in two languages — English and Russian. See the full detailed information in our [documentation](https://github.com/iondv/framework/blob/master/docs/en/index.md).
 </details>

### Demo
Go to <a href="https://studio.iondv.com">studio.iondv.com</a> to try the demo. No registration or account needed.
You can also test the [simplified version](https://iondv.com/portal/index#page-try) with preloaded application.

## How to use?

### Github
In order to develop an application in the Studio, you need to run it in one of the following ways:

* Use the (demo version)[https://studio.iondv.com] of IONDV. Studio.
* Build Studio localy as an application of [IONDV. Framework](https://github.com/iondv/framework). 
Get source code from [github](https://github.com/iondv/studio). Build and deploy it, open Studio link `http://localhost:8888` in your browser
* Build Studio localy as standalone node.js version - see instructions below.
* Build Studio localy as Desktop application (node-webkit) - see instructions below.
* Run as docker container `docker run -d -p 8888:8888 --name studio iondv/studio`. Open Studio `http://localhost:8888` in your browser.

After that:
* Develop your application, by changing or adding the additional components.
* Please notice, it is saved only locally in the browser. Export all metadata as zip-file.
* Get the last version of the IONDV. Framework and the IONDV. Registry module: check out from the GitHub
[Framework](https://github.com/iondv/framework) and [Registry](https://github.com/iondv/registry) repositories.
* Follow the typical deployment instruction from git, but instead of the application, expand in the `applictions` folder your archive.
* Further you need to build and deploy your application as a typical 
[IONDV. Framework](https://github.com/iondv/framework) application.


### Docker
Follow these steps to deploy a docker container:

Start application as a docker container `docker run -d -p 8888:8888 --name studio iondv/studio`. 

Open the link `http://localhost:8888` in your browser.

## Specific Studio use
###  Standalone node.js app

IONDV. Studio as a standalone application does not require a database or IONDV. Framework.

Execute the `git clone https://github.com/iondv/studio.git` command. Change the folder to `studio`. 

Execute the `npm install` to install all key dependencies, including the `gulp` build-tool locally. Please make sure that the Gulp version is `4.0`. 

Further, execute the `gulp build` command to build the app.

Run the app, executing the `npm start` or `node www` command (`node standalone` to run the application as [standalone](/readme-standalone_ru.md).)

Open this link `http://localhost:8888` in your browser.

### Desktop IONDV. Studio (node-webkit)

First of all build the **Standalone node.js version**.

#### Build of node-webkit executable file

1. Download the latest **NORMAL** version of node-webkit from the website https://nwjs.io/.
2. Extract the contents of the archive to any convenient folder.
3. Use one of the available methods to connect the application and node-webkit.

Examples are described in the article 
https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps in paragraphs **2a** and **2b**.

A more convenient option is to use the package [**nw-builder**](https://github.com/nwjs-community/nw-builder).
For example: `nwbuild ./studio -p win64 -v 0.34.0 -o ./destination`. 
**Nw-builder** will download the required version of node-webkit.

As a result, you will get your application in the DLL folder that nwjs uses.

You can run the application using nw.exe file (name may vary).

#### Build of a single executable file

1. Download **Enigma virtual box** from the website **https://enigmaprotector.com/en/downloads.html** install and run
2. Enter the path to the executable file of your application in the first field. (You can choose)
3. Enter the path to save the executable file in the second field.
4. Enter in the field Files *ALL* files and folders from the directory of your application except the executable file 
5. In the menu Files options, check Compress. 
6. Click Process and wait for the result.

The original instruction in English is presented on the 
[website](https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps) in paragraph 
*An alternative way to make an executable file in Windows*

#### Links

* [Git repository](https://github.com/iondv/studio.git)
* [Node-webkit](https://nwjs.io/)
* [Node-webkit wiki](https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps)
* [Package for build execution file](https://github.com/nwjs-community/nw-builder)
* [Program for DLL link](https://enigmaprotector.com/en/downloads.html)
* [User's manual - russian version](manuals/RP_studio.docx)
* [Run the application as a standalone](/readme-standalone.md)
* [Tutorial "How to create an app using ION. Studio"](https://github.com/iondv/nutrition-tickets/blob/master/tutorial/en/index.md)

--------------------------------------------------------------------------  


 #### [License](/LICENSE) &ensp;  [Contact us](https://iondv.com) &ensp;  [Russian](/readme_ru.md)   &ensp; [FAQs](/faqs.md)          

<div><img src="https://mc.iondv.com/watch/github/docs/app/studio" style="position:absolute; left:-9999px;" height=1 width=1 alt="iondv metrics"></div>

--------------------------------------------------------------------------  

Copyright (c) 2019 **LLC "ION DV"**.  
All rights reserved. 