import { P5CanvasInstance } from '@p5-wrapper/react';
import { Vector } from 'p5';
import { Shape } from './../../App';
export default class Boundary {
    p5: P5CanvasInstance;
    shape: Shape;
    size: number;
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    shapeMap: Map<Shape, () => void>;
    shapes: Shape[];
    constructor(p5: P5CanvasInstance, shape: Shape, shapes: Shape[], size?: number, position?: Vector) {
        this.p5 = p5;
        this.shape = shape;
        
        this.shapes = shapes;

        this.position = position?.copy() || p5.createVector(0, 0);
        this.size = size || 100;

        this.velocity = this.p5.createVector(0, 0);
        this.acceleration = this.p5.createVector(0, 0);
        this.shapeMap = new Map();
        this.populateShapeMap();
        // Purposefully not catching error. It is a developer's error, and thus needs to be uncaught
        this.ensureAllShapesInShapeMap();
    }

    private populateShapeMap(): void {
        this.shapeMap.set("Square", () => this.drawSquare());
        this.shapeMap.set("Circle", () => this.drawCircle());
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

    public createBoundary(): void {
        this.p5.noFill();
        this.p5.stroke(0);
        this.p5.strokeWeight(3);
        
        // ! is important as it tells compiler that the returned value cannot be undefined
        this.shapeMap.get(this.shape)!();
    }

    private drawSquare(): void {
        this.p5.rectMode(this.p5.CENTER);
        this.p5.square(this.position.x, this.position.y, this.size);
    }

    private drawCircle(): void {
        this.p5.circle(this.position.x, this.position.y, this.size);
    }

    // public contains(ball: Ball) {
    //     let pos = ball.position;
    // }
}