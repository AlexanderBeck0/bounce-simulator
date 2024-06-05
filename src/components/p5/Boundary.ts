import { P5CanvasInstance } from '@p5-wrapper/react';
import { Vector } from 'p5';
import { Shape } from './../../App';
import Drawer from './Drawer';

/**
 * @example const boundary = new Boundary(p5, props.shape, props.shapes, 100);
            boundary.createBoundary();
 */
export default class Boundary {
    // #region Variables
    velocity: Vector;
    acceleration: Vector;
    private p5: P5CanvasInstance;
    public shape: Shape;
    private shapes: Shape[];
    private drawer: Drawer;
    /**
     * @default 100
     * The size of the boundary.
     */
    public size: number;
    /**
     * @default p5.createVector(0, 0);
     * The position of the boundary.
     */
    public position: Vector;
    /**
     * @example this.shapeMap.get(this.shape)!();
     */
    private shapeMap: Map<Shape, () => void>;
    /**
     * @example this.containsMap.get(this.shape)!(point);
     */
    private containsMap: Map<Shape, (point: Vector) => boolean>;

    // #endregion
    constructor(p5: P5CanvasInstance, shape: Shape, shapes: Shape[], size?: number, position?: Vector) {
        this.p5 = p5;
        this.shape = shape;

        this.shapes = shapes;

        this.position = position || p5.createVector(0, 0);
        this.size = size || 100;

        this.velocity = this.p5.createVector(0, 0);
        this.acceleration = this.p5.createVector(0, 0);
        this.shapeMap = new Map();
        this.drawer = new Drawer(this.p5);
        this.containsMap = new Map();
        this.populateShapeMap();
        this.populateContainsMap();
        // Purposefully not catching error. It is a developer's error, and thus needs to be uncaught
        this.ensureAllShapesInShapeMap();
    }

    /**
     * Used for initializing {@link shapeMap}
     */
    private populateShapeMap(): void {
        this.shapeMap.set("Square", () => this.drawer.drawSquare(this.position, this.size));
        this.shapeMap.set("Circle", () => this.drawer.drawCircle(this.position, this.size));
        this.shapeMap.set("Triangle", () => this.drawer.drawTriangle(this.position, this.size));
    }

    /**
     * Used for initializing {@link containsMap}
     */
    private populateContainsMap(): void {
        this.containsMap.set("Square", (point: Vector) => this.pointInSquare(point));
        this.containsMap.set("Circle", (point: Vector) => this.pointInCircle(point));
    }

    /**
     * @throws {Error} Thrown if {@link shapes this.shapes} is undefined
     */
    private ensureAllShapesInShapeMap(): void {
        if (!this.shapes) {
            throw new Error("Shapes is not defined in Boundary.ts. Cannot ensure all shapes are in shape map.");
        }

        this.shapes.forEach(validShape => {
            if (!this.shapeMap.has(validShape)) {
                throw new Error(validShape + " is not a defined shape in the shape map!");
            }
        });

    }

    public createBoundary() {
        this.p5.noFill();
        this.p5.stroke(0);
        this.p5.strokeWeight(3);

        // ! is important as it tells compiler that the returned value cannot be undefined
        this.shapeMap.get(this.shape)!();
    }

    // #region Collisions

    private pointInCircle(point: Vector): boolean {
        /*console.log('point x: ', point.x)
        console.log('point y: ', point.y)
        console.log('x: ', this.position.x)
        console.log('y: ', this.position.y)
        console.log('Dist: ', this.p5.dist(point.x, point.y, this.position.x, this.position.y));
        console.log('Size: ', this.size);
        console.log('----------------');
        */
        return this.p5.dist(point.x, point.y, this.position.x, this.position.y) <= this.size;
    }

    private pointInSquare(point: Vector): boolean {
        // return (
        //     point.x >= this.position.x &&
        //     point.x <= (this.position.x) + this.p5.width &&
        //     point.y >= this.position.y &&
        //     point.y <= (this.position.y) + this.p5.height
        // );
        return this.p5.dist(point.x, point.y, this.position.x, this.position.y) <= this.size;
    }

    /**
     * Uses {@link containsMap this.containsMap}
     * @param point A position Vector of a point
     * @returns True if the object is in the shape
     */
    public contains(point: Vector): boolean {
        return this.containsMap.get(this.shape)!(point);
    }
    // #endregion
}