# Final project for course Basics of Web Applications - Juho Hietala (TVT23KMO)

**This repository contains the project files for the final project for the course Basics of Web Applications (Spring-04/TVT23KMO).**

The purpose of this assignment was to build a web-application with a responsive user interface, using good programming practices.

This web-application focuses on JavaScript programming. In the site, users can learn programming by completing programming quizes, and by using a browser based coderunner for
JavaScript code. The site also links together few similar external sites, that provide information, tutorials and quizes in many programming languages.

The main features of this web application are the coderunner and the quizes. Both use the same method for the code execution. The code is sent to the server, where it is executed, and the reponse is sent back to the frontend.

This web-application consist of static web-site files and server-side files. Originally the server was built with Node.js Express framework. In the course "Cloud services" there was a Google Firebase assignment, and I decided to merge these two assignments and host the entire application on Google Firebase. The backend files were modified to work as a Firebase function, and the static content was deployed on Firebase Hosting.
To acces the Firebase application, go to URL [https://learningjavascript-1288a.web.app/](https://learningjavascript-1288a.web.app/).

The purpose of this repository is to store the project files for reviewing purposes. Static web-site files can be found from this repository and the Node.js Express version of the server-side files from [JsRunner](https://github.com/JuhoHackspace/JsRunner.git) repository. 

### Instructions for running the application locally
gi
The server required to use the web-sites quizes and coderunner, is running publicly as a Google Firebase Function. The HTTP endpoints in the web-sites script files currently
match the Firebase Function endpoint. No changes are required to run the static content locally.

**Follow these instruction, if you wish to try review the site files, or host only the static content locally**
- Clone the repository.
- Review the files.
- To host the web-site, the easiest way is to use VSCode and the LiveServer extension. Install it, or choose another hosting method.
- Once you have completed these teps, you can launch and view the site, and try out the quizes and the coderunner.

**Follow these instructions carefully, if you wish to try out or review the functionality by hosting both the site and the server locally**

- Clone this repository locally.
- Clone [JsRunner](https://github.com/JuhoHackspace/JsRunner.git) repository locally.
- Install latest version of Node.js if you dont have it.
- Go to JsRunner directory and right-click with mouse, and select "Run in terminal".
- Once you are sure, that you are in the JsRunner root directory, and you have Node.js environment installed, type the following command
    > npm install
- Now, the server-side application modules are installed. To launch the application at "http://localhost:3000", run following command
    > node app.js
- Navigate to directory "LearningJavaScript" for the static web-site files.
- In the static web-site script files coderunner_script.js and quiz_script.js, change the fetch() methods HTTP endpoint to match "http://localhost:3000/runcode"
- To host the web-site, the easiest way is to use VSCode and the LiveServer extension. Install it, or choose another hosting method.
- Make sure the server is running.
- Once you have completed these teps you can launch and view the site, and try out the quizes and the coderunner.
