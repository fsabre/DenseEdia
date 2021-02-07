# DenseEdia

A tool that let you store what you want, plus its API.

## What I wanted

I wanted to have a tool that allowed me to store data about various things I liked, such as musics, games or books.
I wanted them to be interconnected like in a web, so I could link an anime to its light novel counterpart, for instance.
I wanted to be able to easily retrieve/modify the data from a script.
I wanted it not to depend of an external graph database engine and to be easy for the commoner to install and use.

## Summary

DenseEdia is a database that stores Edia, which are the main pieces of information. Every Edium has a kind and an
optional name.
Then you can add Elements to them as you wish in order to get the structure you like.
Finally you can draw Links between two Edia. Those Links can be oriented in a way or the other, or not oriented at all.

You can interact with DenseEdia with a RESTful HTTP API, so you can create your own front-ends ou scripts that satisfy
your needs.

The advantages of DenseEdia are the following :

- Flexible
- Graph-like
- Accessible via an HTTP API

## Installation

Start by cloning the project on your computer :

```bash
git clone https://github.com/fsabre/DenseEdia.git
cd DenseEdia
```

### The server

Create a virtual environment for Python :

```bash
python3 -m venv venv
```

Activate it and install the dependencies :

```bash
source venv/bin/activate
pip install -r requirements.txt
```

Run the server :

```bash
python -m denseedia
```

### The React Web interface

Install the dependencies :

```bash
cd react-app
npm install
```

Build a production version :

```bash
npm run build
```

Run the built version on port 59131 :

```bash
npm install serve
serve -s build -l 59131
```

## API specification

TODO
