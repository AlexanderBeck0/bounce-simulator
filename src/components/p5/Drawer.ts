import { P5CanvasInstance } from "@p5-wrapper/react";
import { Vector } from "p5";
import { Shape } from './../../App';

export default class Drawer {
    p5: P5CanvasInstance;
    constructor(p5: P5CanvasInstance) {
        this.p5 = p5;
    }

    //#region Drawing
    /**
     * Draws a square by calling {@link calculateVertices this.calculateVertices}
     * @param position The position to draw the square at
     * @param size The size of the square
     */
    public drawSquare(position: Vector, size: number): void {
        const squareVertices = this.calculateVertices("Square", position, size);
        this.p5.beginShape();
        for (const v of squareVertices) {
            this.p5.vertex(v.x, v.y);
        }
        this.p5.endShape(this.p5.CLOSE);
        // this.p5.rectMode(this.p5.CENTER);
        // return this.p5.square(this.position.x, this.position.y, this.size);
    }

    /**
     * @param position The position to draw the circle at
     * @param size The radius of the circle
     * @param segments The number of segments for the circle. Defaults at 30. Note: The greater this value, the more resource intensive it is.
     */
    public drawCircle(position: Vector, size: number, segments?: number) {
        const circleVertices = this.calculateVertices("Circle", position, size, segments);
        this.p5.beginShape();
        for (let i = 0; i < circleVertices.length; i++) {
            this.p5.vertex(circleVertices[i].x, circleVertices[i].y);
        }
        this.p5.endShape(this.p5.CLOSE);
        // this.p5.circle(this.position.x, this.position.y, this.size);
    }

    //#endregion
    //#region Calculating
    /**
     * A wrapper function that, given a shape and all necessary values, will return the proper vertices
     * @param shape A {@link Shape} object to calculate the verticies from
     * @param position The position to start calculating the vertices at
     * @param size The size of the shape
     * @param segments Only necessary for circles. The number of segments for a circle. Defaults at 30. Note: The greater this value, the more resource intensive it is.
     * @returns An array of Vectors representing the Vertexs of the shape.
     */
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

    /**
     * Called by using {@link calculateVertices}
     * @param position The position to start calculating the vertices at
     * @param size The size of the square
     * @returns An array of Vectors representing the Vertexs of the square
     */
    private calculateSquareVertices(position: Vector, size: number) {
        const verticies = [
            this.p5.createVector(position.x - size, position.y - size), // top-left
            this.p5.createVector(position.x + size, position.y - size), // top-right
            this.p5.createVector(position.x + size, position.y + size), // bottom-right
            this.p5.createVector(position.x - size, position.y + size)  // bottom-left
        ];
        return verticies;
    }

    /**
     * Called by using {@link calculateVertices}
     * @param position The position to start calculating the vertices at
     * @param radius The radius of the circle
     * @param segments The number of segments for the circle. Defaults at 30. Note: The greater this value, the more resource intensive it is.
     * @returns An array of Vectors representing the Vertexs of the circle
     */
    private calculateCircleVertices(position: Vector, radius: number, segments: number) {
        const vertices = [];
        for (let i = 0; i < segments; i++) {
            const angle = this.p5.map(i, 0, segments, 0, this.p5.TWO_PI);
            const vx = position.x + this.p5.cos(angle) * radius ;
            const vy = position.y + this.p5.sin(angle) * radius;
            vertices.push(this.p5.createVector(vx, vy));
        }
        return vertices;
    }
    //#endregion
}