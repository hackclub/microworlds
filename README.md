# Microworlds are a place to discover powerful ideas!

This is Hack Club's code editor which integrates workshops, documentation, and sharing tools.

## What is a Microworld?

A microworld is a single page code editor environment. Each microworld loads in an interpreter which will receive your code, evaluate it, and render accordingly. Each microworld also provides documentation which you can access by hitting `docs`. After creating something in your microworld share it to Scrapbook by hitting `share`, pressing the link, and filling out the sharing form.

## Running Locally

To run the microworld editor locally just download the repo and run a server. I reccomend the npm package [live-server](https://www.npmjs.com/package/live-server).

1. Clone this repository
   - `git clone https://github.com/hackclub/microworlds.git && cd microworlds`
1. Install `live-server`
   - `npm install -g live-server`
1. Run server
   - `live-server`

## Creating a Microworld

To create a new microworld, make a Pull Request on this repository with a new
directory containing your world inside of the `micros` directory.

Your new microworld directory must contain a `JSON` file with the same name as the
directory. That `JSON` file must contain the following information (linking to your
new microworld files):

```
{
  "name": "example",
  "documentation": "docs.md",
  "template": "template.js",
  "programAddress": "default.js"
}
```

To navigate to your microworld type in the local address and pass the name of your microworld as a url parameter for `file`.

For example: `localhost:8080?file=example`
