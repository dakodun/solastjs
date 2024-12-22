DESCRIPTION

Test of the math involved in rendering (for example, projection matrices)
and the rendering pipeline.

A simple 4-sided Pyramid with basic diffuse lighting and animation which
can be rotated and spun freely (within constraints). The projection matrix
can be swapped between an orthographic or perspective projection but should
maintain consistency between both with regards to current translation,
rotation and scale, achieved by also manipulating the view matrix. Also
includes basic UI rendering and mouse-picking via 2d mask projection.

---
CONTROLS

Hold Mouse Left or Touch on Pyramid - Grab the Pyramid

(When Grabbed) Move Cursor or Drag - Spin the Pyramid

(On Release) - Pyramid should maintain current rotational velocity

Mouse Left or Touch UI button - Toggle between perspective and orthographic
projections, or enable/disable debug
