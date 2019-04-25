<h1 align="center"> <a href="https://www.iondv.com/"><img src="/ion-logo-black-mini.png" alt="IONDV. Framework" width="600" align="center"></a>
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

Studio is a IONDV. Framework application. Also it may be used as standalone node.js application or Desktop application.

#### Start with IONDV. Framework

* [IONDV. Framework](https://github.com/iondv/framework/)
* [IONDV. Framework Docs](https://github.com/iondv/framework/blob/master/docs/en/index.md)

<h1 align="center"> <a href="https://www.iondv.com/"><img src="/iondv-studio.png" alt="IONDV. Studio" align="center"></a>
</h1>  


## Description 

**Studio** is created for developing or editing metadata (for example class, navigation, view, workflow, 
portal interface) that can be deployed as an IONDV application. 



### Demo
Go to <a href="https://studio.iondv.com">studio.iondv.com</a>. No registration or account needed.
You can also see [simplified version](https://iondv.com/portal/index#page-try) with preloaded application.

## Use

### Github
In order to develop an application in the Studio, you need to run it in one of the following ways:

* Go to https://studio.iondv.com and use.
* Build Studio localy as an application of [IONDV. Framework](https://github.com/iondv/framework). 
Get source from [github](https://github.com/iondv/studio). Build and deploy it, open Studio link `http://localhost:8888` in your browser
* Build Studio localy as standalone node.js version - see bellow...
* Build Studio localy as Desktop application (node-webkit) - see bellow...
* Run as docker container `docker run -d -p 8888:8888 --name studio iondv/studio`. Open Studio link `http://localhost:8888` in your browser

After that  and:
* Develop your application, by changing or adding the additional components.
* Please notice, it is saved only locally in the browser. Export all metadata as zip-file.
* Get the last version of the IONDV. Framework and the IONDV. Registry module: check out from the GitHub
[Framework](https://github.com/iondv/framework) and [Registry](https://github.com/iondv/registry) repositories.
* Follow the model of the user application deployment from git, with the exception of applications - instead of 
application extract in the `applications` folder of your application package.
* Further you need to build and deploy your application as typical 
[IONDV. Framework](https://github.com/iondv/framework) application


### Docker
Follow these steps to deploy docker container:

Start application as docker container `docker run -d -p 8888:8888 --name studio iondv/studio`. 

Open Studio link `http://localhost:8888` in your browser

## Specific Studio use
###  Standalone node.js version

A use standalone application does not require a database or IONDV. Framework.

Execute the command `git clone https://github.com/iondv/studio.git`. Change the folder to `studio`. 

Execute the `npm install`, for installs all key dependencies, including locally the `gulp` build-tool. Please make sure that the Gulp 
version - is `4.0`. 

Further, execute the `gulp build` command to build  the application.

Run the app, executing the `npm start` or `node www` command. 

Open this link `http://localhost:8888` in a browser.

### Desktop version IONDV. Studio (node-webkit)

Before make desktop Studio version, build of **Standalone node.js version**

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

You can run the application using nw.exe file (name may vary)

#### Build of a single executable file

1. Download **Enigma virtual box** from the website **https://enigmaprotector.com/en/downloads.html** install and run
2. Enter the path to the executable file of your application in the first field. (You can choose)
3. Enter the path to save the executable file in the second field.
4. Enter in the field Files *ALL* files and folders from the directory of your application except the executable file 
5. In the menu Files options.. check Compress... 
6. Click Process and wait for the result.

The original instruction in English is presented on the 
[website](https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps) in paragraph 
*An alternative way to make an executable file in Windows*

#### Links

* https://github.com/iondv/studio.git - git repo
* https://nwjs.io/ - node-webkit
* https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps - node-webkit wiki
* https://github.com/nwjs-community/nw-builder - package for build execution file
* https://enigmaprotector.com/en/downloads.html - program for DLL link

--------------------------------------------------------------------------  


 #### [License](/LICENSE) &ensp;  [Contact us](https://iondv.com) &ensp;  [Russian](/docs/ru/readme.md)   &ensp; [FAQs](/faqs.md)          

<div><img src="https://mc.iondv.com/watch/github/docs/app/studio" style="position:absolute; left:-9999px;" height=1 width=1 alt="iondv metrics"></div>

--------------------------------------------------------------------------  

Copyright (c) 2019 **LLC "ION DV"**.  
All rights reserved. 