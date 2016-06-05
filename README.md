# M'interessa web frontend

## Disclaimer

This repository stores one component of a more general project code-named "M'interessa" and that is expected to evaluate the knowledge acquired in the postgraduate

As of suche, this is an ongoing process (at least until version 1.0.0, which is expected to be the one to be presented as a final result) and by no means is a production-ready web application. Moreover, the main focus of the project is on the machine learning, natural language processing and scrapping steps, and this website is only intended to ease the review and evaluation of the outcomes of such steps.

The links to the repositories of the remaining components will be provided on further releases.

Also the application has many identified bugs that will be fixed along the time before the final release (and soon to be expected to create issues into github itself). The purpose of this first release is to publicly share the component with other members of the team, and to be linkable from the website/blog.  After we get a version tagged as 1.0.0, we'll be pleased to accept and review Pull Requests from other community members outside of the group.

## Objective of the project

The project is intended to use machine learning models, natural language processing and scrapping technologies to assist the user on choosing and receiving the most relevant tweets that are being distributed over the Twitter public streaming api, given a basic set of tweets provided by the user itself (whether from its timeline or from a twitter search) and from a progressive tweet selection.

The models are expected to learn progressively and specifically for each user's need.

You can read more on the [Link to be provided](#) companion website of the project, explaining the overall details and blog posts from the team members to come.

## Requirements

### Technical requirements

The only technical requirement as of now is [Docker](https://www.docker.com). The rest of the dependencies are handled by Docker itself inside of each container, and also from the Dockerfile provided into the repository.

### Third party requirements

For the usage of the application it'll be needed for you to create a [Twitter](https://www.twitter.com/) app token so that the users can accept it and allow to read their timeline and perform searches.  Please, log into Twitter, go to https://dev.twitter.com/, select the option [Manage Your Apps](https://apps.twitter.com/)

Please, be sure to add the callback URL as http://127.0.0.1:80800/auth/twitter/callback. Use the IP version (not localhost) as otherwise Twitter may complain that it's not a valid URL.

A soon you've got the app consumer key and secret, create a file named src/app/config.dev.js, containing the following code:

```javascript
module.exports = {
    auth: {
        twitter : {
            consumerKey       : 'consumer key',
            consumerSecret    : 'consumer-secret',
            callbackURL       : 'http://127.0.0.1:8080/auth/twitter/callback'
        }
    }
};
```
If you've installed the application into a publicly available domain, you can also change the callbackURL attribute (which should match with the one set into the Twitter app configuration).

This file will be used from the ExpressJS backend to connect (using passport-twitter module) to Twitter.

## Docker images build

There are two containers to be used for the web application:
* Storage container running MongDB 3.2 that will store the data both from the users and from the internally-filtered streams.
* Frontend container to accept requests and return response to web users, requires [nodejs](https://nodejs.org).

### Storage container

For the mongodb instance, it is a PoC container, and so there's not a special need to configure more a default database.  In further releases this container may be moved to other backend-centered containers, more near to scrapping, modelling and so on.

It may be required to tweak and configure the database so that it can work correctly in a production environment, so use it carefully if you expect to use it in a real environment.

```bash
$ docker run --name pgds-minteressa-webdb -d mongo:3.2
```
The first time docker will download the mongo 3.2 template from docker hub so that it may take a while.

If you would like to persist the data stored into mongo outiside of the current container, you can mount a volume

```bash
$ docker run --name pgds-minteressa-webdb -d mongo:3.2
```

Please, refer to [The Mongo docker hub page](https://hub.docker.com/_/mongo/) for more details on configuration options. The mongodb features used in this project are not specially demanding, and perhaps you can use an older mongodb version or to upgrade to newer ones.

### Frontend container

The NodeJS container requires to install the dependencies' packages

```bash
$ cd src
$ docker build --no-cache -t pgds-minteressa-webapp
```
You can avoid the *--no-cache* flag, it's only intended to avoid previous builds from being reused to build new versions of the template.


## Docker run the build

First should start the mongodb container:

```bash
docker run --name pgds-minteressa-webdb -d mongo:3.2
```

And then run the docker container for the web application, by including a link to the

```bash
docker run -it --rm -p 8080:8080 --link pgds-minteressa-webdb:pgds-minteressa-webdb pgds-minteressa-webapp
```

# Accessing to the website

As soon as you get it up and running, you can point your browser to http://127.0.0.1:8080/index.dev.html for the development version of the application.  This will be the initial frontend space.

The application asks the user to log in with your twitter account. After the user logs in and authorizes the M'interessa app to access to its account timeline, it's redirected to the website.