import { P5CanvasInstance } from '@p5-wrapper/react';
import { Vector } from 'p5';
import { Shape } from './../../App';
export default class Ball {
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

        this.position = position || this.p5.createVector(0, 0);
        this.size = size || 10;

        this.acceleration = this.p5.createVector(0, 0);
        this.velocity = this.p5.createVector(0, 0);

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
        this.shapeMap.get(this.shape)!();
    }

    private drawSquare(): void {
        this.p5.rectMode(this.p5.CENTER);
        this.p5.square(this.position.x, this.position.y, this.size);
    }

    private drawCircle(): void {
        this.p5.circle(this.position.x, this.position.y, this.size);
    }

    public applyForce(force: Vector) {
        const forceToApply = this.p5.createVector(0, 0);
        Vector.div(force, this.size, forceToApply);
        this.acceleration.add(forceToApply);
    }

    public update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0); // Clear acceleration
    }

    public checkEdges() {
        if (this.position.y > this.p5.height - this.size * 20.65) {
            this.velocity.y *= -0.9;
            this.position.y = this.p5.height - this.size * 20.65;
        }
    }
}