# WebHarjoitustyo - Juho Hietala (TVT23KMO)

**This repository contains the practice assignment for the course Basics of Web Development (Spring-04/TVT23KMO).**

The purpose of this assignment was to build a responsive web-site or web-application, using good programming practices.

This web-site focuses on JavaScript programming. In the site, users can learn programming by completing programming quizes, and by using a browser based coderunner for
JavaScript code. The site also links together few similar external sites, that provide information, tutorials and quizes in many programming languages. The site was built
"self-explanatory" and provides information about the site in one of the pages.

This web-application consist of static web-site files and a Node.js Express backend. The entire application is running on Google Firebase. The Node.js backend is running as a Firebase
Function, and the site is hosted using Firebase Hosting. To acces the site, go to **link to site**.

The purpose of this repository is to store the project files for reviewing purposes. Static web-site files can be found under the "LearningJavaScript" directory, and the server-side
files under "JsRunner" directory.

###Instructions for running the application locally

The server required to use the web-sites quizes and coderunner, is running publicly as a Google Firebase Function. The HTTP endpoint in the web-sites script files currently
match the Firebase Function endpoint. This repository contains the Node.js Express version of the server.

**Follow these instruction carefully, if you wish to try out or review the site by hosting only the web-site locally**
- Clone the repository
- To host the web-site, the easiest way is to use VSCode and the LiveServer extension. Install it, or choose another hosting method.
- Once you have completed these teps, you can launch and view the site, and try out the quizes and the coderunner

**Follow these instructions carefully, if you wish to try out or review the functionality by hosting both the site and the server locally**

- Clone the repository locally
- Install latest version of Node.js if you dont have it
- Go to JsRunner directory and right-click with mouse, and select "Run in terminal"
- Once you are sure, that you are in the JsRunner root directory, and you have Node.js environment installed, type the following command
    > npm install
- Now, the server-side application modules are installed. To launch the application at "http://localhost:3000", run following command
    > node app.js
- In the static web-site script files coderunner_script.js and quiz_script.js change the fetch() methods HTTP endpoint to match "http://localhost:3000/runcode"
- To host the web-site, the easiest way is to use VSCode and the LiveServer extension. Install it, or choose another hosting method.
- Once you have completed these teps, you can launch and view the site, and try out the quizes and the coderunner
