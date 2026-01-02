+++
title = "Dialogue"
date = 2026-01-02

weight = 2

subtitle = "(previously 'Deep Conversation, A')"
+++

- Testing an implementation of a dialogue system built on top of the
RenderString class.

- A basic three-dimensional scene rendered using a VertexBatch and Axis-Aligned
Billboards showcasing a custom dialogue engine that allows for a typewriter
style text animation, special control characters to change text style (weight
and colour) and to add custom animations, and which responds properly to a change
in textbox width/height. 

- Also demonstrates a simple game script system, mouse picking via pixel colour
(utilising Framebuffer and a custom Shader), a responsive layout for smaller
canvas widths by unprojecting screen coordinates and checking plane collisions,
and texture manipulation with ImageArrays.

  - Mouse Left or Touch "Super Batman" to **initiate conversation**
    - Mouse Left or Touch anywhere to **advance text**
  - Mouse Left or Touch UI button to toggle between **fullscreen**,
  **enable/disable debug**, or zoom camera in/out
