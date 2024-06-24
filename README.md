# Bounce Simulator

### Authors: [@AlexanderBeck0](https://github.com/AlexanderBeck0) and [@Szlamon](https://github.com/Szlamon)

A summer project turned into a ISP. It uses p5.js, DaisyUI, Tailwind, React, and Typescript.

## Instructions for use
### Shapes
There are two places to change shapes. One under `Boundary Shape`, and the other under `Ball Shape`. `Ball Shape` has the options of `Square`, `Circle`, and `Triangle`, with the default being `Circle`. `Boundary Shape`, on the other hand, has all the above, in addition to `Random` and `Draw`.
#### Square
A `Ball Shape` and `Boundary Shape`.
#### Circle
A `Ball Shape` and `Boundary Shape`. If `Circle` is selected, a `Segments` input field will appear. This affects the `Boundary Shape`, and is used to determine how many segments the boundary should have. Note that higher `Segments` require more resources. Does not affect the `Ball Shape`.
#### Triangle
A `Ball Shape` and `Boundary Shape`.
#### Random
A `Boundary Shape`. The `Random` shape creates a random closed polygon.
#### Draw
A `Boundary Shape`. `Draw` allows the user to draw on the canvas a boundary shape of their liking. To draw a shape, select the `Draw` shape. Once `Draw` has been selected, hold down `Left Mouse Button` and release when you wish to finish the shape.

### Sizes
#### Size of Boundary
Defaults to `100`. Is not shown when `Draw` is selected.
#### Size of Balls
Changes the size of the balls that will be dropped. Does not affect those already on the screen.
### Collisions
The balls will collide with each other, and hitting the edge of a boundary will cause them to bounce. There will be a slight energy loss on each bounce.
### Forces
Forces are what make the balls move. They add an `x` and `y` value to the ball's acceleration every tick. There are a few built in forces, such as `Gravity`, `Anti-Gravity`, `Right Force`, and `Left Force`. All the forces are toggleable by clicking on `Open Forces`, and checking the checkbox next to each force's name. A user can also add their own forces. Additionally, a user can remove any force by clicking the red `X` to the right of the forces.
#### Built in forces
##### Gravity
`Gravity` is checked by default. Does not affect the `x` acceleration, and adds `0.1 * size` to the ball's `y` acceleration. 
##### Anti-Gravity
Does not affect the `x` acceleration. Adds `-0.1 * size` to the ball's `y` acceleration.
##### Right Force
Adds `0.1 * size` to the ball's `x` acceleration. Does not affect the `y` acceleration.
##### Left Force
Adds `-0.1 * size` to the ball's `x` acceleration. Does not affect the `y` acceleration.
#### Add your own forces
A user has the ability to add their own forces as well. By clicking `Open Forces` and then `Add a new force`, a user can type a unique alphanumerical (plus `_`, `-`, `&`, `,`, `!`, `?`, and spaces) force name. Then, they can type the `x` and `y` acceleration forces in their respective input fields. 

The `x` and `y` fields have an arbitrary minimum of `-2`, and no maximum. Both the `x` and the `y` fields are then multiplied by the size of the ball, so each tick the acceleration would be `(x * size, y * size)`. 
### Optional Visuals
#### Ray Casting
Checking `Enable Ray-casting lines` will do just that. A Ray cast is what goes on behind the scenes to determine if a ball has collided with a boundary or not. Each ball shoots out a line, called a ray, and sees if there is an intersection between the boundary and the ball. If the length of the ray is smaller than the size of the ball, it means there is a collision. 

Enabling Ray Casting will show the lines, with each ball having a randomized color for the rays. Note, enabling Ray Casting can be very resource intensive, so do not enable if you intend to use lots of balls.
#### Collision Rays
Checking `Enable Collision Rays` will show lines between the different balls. It can create some pretty cool paterns. Note, while not as resource intensive as `Enable Ray-casting lines`, collision rays are resource intensive.
### Additional Controls
There are two additional controls: `Drop Balls on Click` and `Clear Balls`. Checking `Drop Balls on Click` will allow the user to left click to drop balls, but only if `Draw` is not enabled. `Clear Balls` will remove all the balls on the canvas.

---
Attributions: See [attributions.md](https://github.com/AlexanderBeck0/bounce-simulator/blob/main/public/attributions.md)