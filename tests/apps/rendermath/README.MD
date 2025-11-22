DESCRIPTION

Test of the math involved in rendering (for example, projection matrices)
and the rendering pipeline.

A simple 4-sided Pyramid with basic diffuse lighting and simple transform-based
animation which can be rotated and spun freely (within constraints). The projection
matrix can be swapped between an orthographic or perspective projection, but should
maintain consistency between both with regards to current translation,
rotation, and scale (achieved by also manipulating the view matrix via 2D and
3D camera objects). Also includes mouse/touch input handling, basic UI rendering,
and mouse-picking via 2D mask projection.

---
CONTROLS

- Hold Mouse Left or Touch on Pyramid to **Grab the Pyramid**
  - (When Grabbed) Move Cursor or Drag to **Spin the Pyramid**
  - (On Release) Pyramid should maintain current rotational velocity
- Mouse Left or Touch UI button to  Toggle between **perspective and**
**orthographic projections**, or **enable/disable debug**
