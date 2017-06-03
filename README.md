
<p align="center"><img src="/img/BracketteText_color.png"></p>

<img src = "/img/sample.gif" />

Manage your Challonge tournaments with ease. A beta application.

## What ? 

Simply put: Brackette allows you to send challonge matches to individual Wii U setups (like maybe have an iPad on each setup) to make it easier for players to report their match.

## Prerequesists

You will need:
* NodeJS 6x
* NPM 3x
* Internet Connection
* Local Network Connection

Later on there will be a build that will be easy for non-developers to use!

### How to run
Brackette is a server application that you run on your local machine. Other devices connect to your local server (via local network IP address) which then allow you to send open Challonge matches to those devices connected. 

##### Step 1:
* Rename config-example.json to config.json. There are three values in this json file. 
    * **setup** - tells the server whether you are setup or not. Allowed values: *true* or *false*
    * **apikey** - Your Challonge API key. See [here to learn more on how to get one](https://api.challonge.com/v1)
    * **password** - This password is non-secured password that allows you to reset the server API key in the browser. This is optional. *Note: As of v0.0.2b, the password field/functionality is not working yet*

* You do not have to edit these values individually as the browser will walk you thru the setup process much easier than editing these files. **Just make sure that you changed the file name to config.json and that's all**. It is recommend you walk thru the setup process in the browser as the browser will test to make sure your API Key is valid.

##### Step 2:

* Rename .env-example to .env
* This is the environment settings for the server. config.json is different as it contains settings that are mainly used in the client side. 
* If you have no clue just rename .env-example to .env and don't mess with anything inside that file.

* *Note: If you change the port in the .env file, you must also go into the package.json file and change the proxy port there manually. There will be an easier way to implement this so please hang on*

##### Step 3:
* Run the following to install the backend and frontend dependecies:
    ```
    npm i && cd client && npm i && cd ..
    ```
* If this command does not work, then you need to run 'npm i' in the root directory and in the client directory.

##### Step 4:
* Now simply run the command  
    ```
    npm start
    ```

* You should get a message on your console that the server is running on http://localhost:8080. If you did not edit the values in the config.json file, you will be walked thru a setup process. You must enter a valid API Key in order to continue.
    
##### Step 5: 
* That's it ! You now have your own Brackette serve running. You will be redirected to the home page and a pop up will ask you your name and role. How to use the application will be discussed next.

### How to use

Currently, you should have a Brackette server running.  If you are using the same computer in which you ran the server on, you can go to http://localhost:8080 and view the application running.

You can also get other devices connected to the server as long as they are in the same local network (aka, using the same wifi). For other devices to connect to your Brackette Server, obtain your local network ip adress via ~~you can go to http://localhost/ip to view your local network ip address.~~ Grab your phone or another computer and enter that ip address into the browser (again, must be in the same network!). Your other device (say your phone/iPad) should see the same popup menu. 

Everytime a new device connects to the Brackette server, you must assign it a name and role. Let's discuss these roles.

* **Host Role** - in Brackette, a host role is where the main central hub from where you control the Challonge tournament will appear. The host Role can view matches in progress and can send matches to individual *clients* (that is, other devices that connect to the host and assign themselves the Client Role). **At the moment, it is recommend you have only ONE host role. Brackette has not been fully tested for multiple host Roles so expect issues if there is more than one host Role.** The host Role is the one that will mainly be making connections to Challonge and updating matches.
* **Client Role** - in Brackette, a Client Role is a device that will receive matches. 

Each role has different views and settings. The host Role can configure the tournament match id while the Client Role cannot.

Now that you understand roles, assign yourself the **role of 'host'** and give yourself the name of "mainhost" (you can call yourself whatever you want). This popup won't go away unless you fill this form out. 

After that, you should get an alert message that there is some type of error. This is because the tournament id (currently nothing/undefined) is not valid. Go to the settings option on the top right and you should get a settings popup. Since you are a host Role, you can set the tournament id. You can also change your name or role if you desire. 

*FYI: The Tournament Id would be the name after the challoneg link, for example, if my tournament was http://challonge.com/nothingtournament, the tournament id that I would enter would be 'nothingtournament'. If you have a subdomain, it will currently not work!*

**Assure that you actually are the owner of this tournament. If you are not, you won't be able to update the matches.**

After you enter the tournament id and click 'Submit'. If the tournament id was valid, you will get a list of all avialable *Open Matches*. 

From there you can send an individual match to a connect Client Role device. The Client will receieve the match and update their display screen. The players will play their match, submit their results, and the host Role will update the match and update the Open Matches display. 

If there are no open tournaments you will not get an error message and will not see anything on your display.

### Known Issues
A more detailed documentation will be made later on. Please be aware that there are a view bugs so be sure to check those [here](https://github.com/HappyZombies/brackette/labels/bug). This app is in it's very very early Beta stages and will change. This current version v0.0.1b is a prototype.

### Developers

If you want to develop, you can run
    ```
    npm run dev
    ```
And start making changes to the files.

If you make any changes and make a pull request, be sure to run inside the CLIENT directory.
    ```
    npm run build
    ```
Before delivering.

Later on I will implement a tool to make this easier for developers.
