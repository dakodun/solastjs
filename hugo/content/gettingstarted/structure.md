+++
title = "File Structure and Index Page"
date = 2025-11-15
summary = """Laying out our project files and creating a functional index.html to serve up our app."""

type = 'docs'
weight = 1
+++

# File Structure and Index Page

There's no one correct way to lay out your project files; as long as
the 'engine' files maintain their own internal folder structure and
you point to the correct location within your own code. The following
structure is only an example of how I would do it for my own projects
and thus these examples.

{{< codebox >}}
project
|-- script
|   |-- engine
|       |-- [engine files]
|-- index.html
|-- style.css
{{< /codebox >}}

For our index.html file there are only two things to consider with
respect to SolastJS: firstly, when loading our script the type is
'module' (we'll look into 'main.js' later). The second consideration
is the canvas element and its id (in this example 'canvas'). This is
how our script will find the canvas on the page (which we'll also see
later).

{{< codebox "html" >}}
<!DOCTYPE html>

<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link rel="stylesheet" type="text/css" href="style.css" />
    <script type="module" src="script/main.js"></script>
  </head>

  <body>
    <div id="container">
      <canvas id="canvas"></canvas>
    </div>
  </body>
</html>
{{< /codebox >}}

Here is the CSS stylesheet to go along with the example; place it
in the 'project' folder alongside the index.html (there is nothing
noteworthy in here).

{{< codebox "css" >}}
html, body {
  height: 100%;
  margin: 0;
}

#canvas {
  display: block;
  height: 100%;
}

#container {
  height: 100%;
}
{{< /codebox >}}
