import { P5CanvasInstance } from '@p5-wrapper/react';
import { Vector } from 'p5';
import { Shape } from './../../App';
import Drawer from './Drawer';
export default class Ball {
    //#region Variables
    p5: P5CanvasInstance;
    shape: Shape;
    /**
     * Defaults to 10
     */
    size: number;
    /**
     * Defaults to this.p5.width / 2, this.p5.height / 2
     */
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    shapeMap: Map<Shape, () => void>;
    shapes: Shape[];
    drawer: Drawer;
    //#endregion
    /**
     * The constructor for creating a ball. Initializes acceleration and velocity to 0,
     * populates a shape map, and ensures that all the shapes are within the shape map.
     * @param p5 A p5 instance
     * @param shape The shape of the ball. Must be in {@link shapes}
     * @param shapes An array of {@link Shape} objects 
     * @param size The size of the ball. Defaults to 10.
     * @param position The start position of the ball. Defaults to the center of the canvas.
     */
    constructor(p5: P5CanvasInstance, shape: Shape, shapes: Shape[], size?: number, position?: Vector) {
        this.p5 = p5;
        this.shape = shape;
        this.shapes = shapes;

        // Start position at center of canvas by default
        this.position = position || this.p5.createVector(p5.width / 2, p5.height / 2);
        this.size = size || 10;

        this.acceleration = this.p5.createVector(0, 0);
        this.velocity = this.p5.createVector(0, 0);

        this.shapeMap = new Map();
        this.drawer = new Drawer(this.p5);
        this.populateShapeMap();
        // Purposefully not catching error. It is a developer's error, and thus needs to be uncaught
        this.ensureAllShapesInShapeMap();
    }

    private populateShapeMap(): void {
        this.shapeMap.set("Square", () => this.drawer.drawSquare(this.position, this.size));
        this.shapeMap.set("Circle", () => this.drawer.drawCircle(this.position, this.size));
    }


    /**
     * @throws {Error} Thrown if {@link shapes this.shapes} is undefined
     */
    private ensureAllShapesInShapeMap(): void {
        if (!this.shapes) {
            throw new Error("Shapes is not defined in Ball.ts. Cannot ensure all shapes are in shape map.");
        }

        this.shapes.forEach(validShape => {
            if (!this.shapeMap.has(validShape)) {
                throw new Error(validShape + " is not a defined shape in the shape map!");
            }
        });

    }

    public display(): void {
        this.p5.noStroke();
        this.p5.fill(0);
        // ! is important as it tells compiler that the returned value cannot be undefined
        this.shapeMap.get(this.shape)?.();
    }

    //#region Movement

    /**
     * Applys a force to the ball. Mutates {@link acceleration}
     * @param force The force Vector to add to the ball
     */
    public applyForce(force: Vector): void {
        this.acceleration.add(force);
    }

    /**
     * Updates the ball's {@link velocity}, {@link position}, and sets its {@link acceleration} to 0
     */
    public update(): void {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    /**
     * @param point The position Vector of the point
     * @param vertices An array of Vectors representing the vertices of a boundary
     * @returns True if the point is in the shape
     * @throws "Invalid Shape" if there are 3 or less vertices
     */
    public isPointInShape(point: Vector, vertices: Vector[]): boolean {
        if (vertices.length < 3) {
            throw "Invalid Shape";
        }

        let isInside = false;

        let j = vertices.length - 1;
        for (let i = 0; i < vertices.length; j = i++) {
            const vi = vertices[i];
            const vj = vertices[j];
            if ((vi.y > point.y) !== (vj.y > point.y) &&
                (point.x < (vj.x - vi.x) * (point.y - vi.y) / (vj.y - vi.y) + vi.x)) {
                isInside = !isInside;
            }
        }

        return isInside;
    }

    /**
     * Checks if {@link position} is within {@link edges}. If it bounces on the boundary, it will be bounced with no energy loss
     * @param edges The edges of the Boundary
     */
    public checkEdges(edges: Vector[]): void {
        for (let i = 0; i < edges.length; i++) {
            const start = edges[i];
            const end = edges[(i + 1) % edges.length];
            const edge = Vector.sub(end, start);
            const normal = edge.cross(this.p5.createVector(0, 0, 1)).normalize().mult(-1);
            const ballToStart = Vector.sub(this.position, start);
            const projection = Vector.dot(ballToStart, normal);

            if (Math.abs(projection) < this.size) {
                // Correct position and reflect velocity
                const distance = Vector.dot(ballToStart, edge) / edge.mag();
                const closestPoint = Vector.add(start, edge.copy().setMag(distance));
                const distanceToClosestPoint = Vector.sub(this.position, closestPoint).mag();

                if (distanceToClosestPoint < this.size) {
                    // Adjust position to the closest point
                    const adjustment = this.p5.createVector();
                    Vector.mult(normal, this.size - distanceToClosestPoint, adjustment);
                    this.position.add(adjustment);

                    // Reflect velocity
                    const dotProduct = this.velocity.dot(normal);
                    const newVelocity = this.p5.createVector();
                    Vector.mult(normal, 2 * dotProduct, newVelocity);
                    this.velocity.sub(newVelocity);

                    // Add a small offset to prevent sticking
                    this.position.add(normal.mult(0.1));
                }
            }
        }
    }
    //#endregion
}