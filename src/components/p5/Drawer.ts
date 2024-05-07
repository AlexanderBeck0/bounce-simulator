import { P5CanvasInstance } from "@p5-wrapper/react";
import { Shape } from "../../App";
import { Vector } from "p5";

export default class Drawer {
    p5: P5CanvasInstance;
    constructor(p5: P5CanvasInstance) {
        this.p5 = p5;
    }

    public drawSquare(position: Vector, size: number) {
        const squareVertices = this.calculateVertices("Square", position, size);
        this.p5.beginShape();
        for (const v of squareVertices) {
            this.p5.vertex(v.x, v.y);
        }
        this.p5.endShape(this.p5.CLOSE);
        // this.p5.rectMode(this.p5.CENTER);
        // return this.p5.square(this.position.x, this.position.y, this.size);
    }

    public drawCircle(position: Vector, size: number, segments?: number) {
        const circleVertices = this.calculateVertices("Circle", position, size, segments);
        this.p5.beginShape();
        for (let i = 0; i < circleVertices.length; i++) {
            this.p5.vertex(circleVertices[i].x, circleVertices[i].y);
        }
        this.p5.endShape(this.p5.CLOSE);
        // this.p5.circle(this.position.x, this.position.y, this.size);
    }

    public calculateVertices(shape: Shape, position: Vector, size: number, segments?: number): Vector[] {
        switch (shape) {
            case "Square":
                return this.calculateSquareVertices(position, size);
            case "Circle":
                return this.calculateCircleVertices(position, size, segments || 30);
            default:
                return [];
        }
    }

    public calculateSquareVertices(position: Vector, size: number) {
        // const squareCenterX = this.p5.width / 2;
        // const squareCenterY = this.p5.height / 2;
        const half = size / 2;
        return [
            this.p5.createVector(position.x - half, position.y - half), // top-left
            this.p5.createVector(position.x + half, position.y - half), // top-right
            this.p5.createVector(position.x + half, position.y + half), // bottom-right
            this.p5.createVector(position.x - half, position.y + half)  // bottom-left
        ];
    }

    public calculateCircleVertices(position: Vector, radius: number, segments: number) {
        const vertices = [];
        for (let i = 0; i < segments; i++) {
            const angle = this.p5.map(i, 0, segments, 0, this.p5.TWO_PI);
            const vx = position.x + this.p5.cos(angle) * radius;
            const vy = position.y + this.p5.sin(angle) * radius;
            vertices.push(this.p5.createVector(vx, vy));
        }
        return vertices;
    }
}