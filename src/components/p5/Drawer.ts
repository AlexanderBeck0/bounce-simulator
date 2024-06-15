import { P5CanvasInstance } from "@p5-wrapper/react";
import { Vector } from "p5";
import { Shape } from './../../App';

export default class Drawer {
    p5: P5CanvasInstance;
    constructor(p5: P5CanvasInstance) {
        this.p5 = p5;
    }

    //#region Drawing
    public draw(shape: Shape, position: Vector, size: number, segments?: number, vertices?: Vector[]): void {
        switch(shape) {
            case "Square":
                this.drawSquare(position, size);
                break;
            case "Circle":
                this.drawCircle(position, size, segments);
                break;
            case "Triangle":
                this.drawTriangle(position, size);
                break;
            case "Random":
                if (vertices){
                    this.p5.beginShape()
                    for (const v of vertices){
                        this.p5.vertex(v.x, v.y)
                    }
                    this.p5.endShape(this.p5.CLOSE)
                }
                else{
                    this.drawRandomShape(position, size);
                }
                break;
            default:
                throw "Unknown shape. Cannot draw.";
        }
    }

    /**
     * Draws a square by calling {@link calculateVertices this.calculateVertices}
     * @param position The position to draw the square at
     * @param size The size of the square
     */
    private drawSquare(position: Vector, size: number): void {
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
    private drawCircle(position: Vector, size: number, segments?: number) {
        const circleVertices = this.calculateVertices("Circle", position, size, segments);
        this.p5.beginShape();
        for (let i = 0; i < circleVertices.length; i++) {
            this.p5.vertex(circleVertices[i].x, circleVertices[i].y);
        }
        this.p5.endShape(this.p5.CLOSE);
        // this.p5.circle(this.position.x, this.position.y, this.size);
    }

    private drawTriangle(position: Vector, size: number) {
        const vertices = this.calculateVertices("Triangle", position, size);
        this.p5.beginShape();
        for (let i = 0; i < vertices.length; i++) {
            this.p5.vertex(vertices[i].x, vertices[i].y);
        }
        this.p5.endShape(this.p5.CLOSE);
    }

    private drawRandomShape(position:Vector, size:number){
        const randomVertices = this.calculateVertices("Random", position, size)
        this.p5.beginShape()
        randomVertices.forEach(v => {
            this.p5.vertex(v.x, v.y)
        })
        this.p5.endShape(this.p5.CLOSE)
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
            case "Triangle":
                return this.calculateTriangleVertices(position, size);
            case "Random":
                return this.calculateRandomShapeVertices(size)
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

    private calculateTriangleVertices(position: Vector, size: number) {
        const vertices = [
            this.p5.createVector(position.x - size, position.y - size), // top-left
            this.p5.createVector(position.x + size, position.y - size), // top-right
            this.p5.createVector(position.x, position.y + size)  // bottom-left
        ];
        return vertices;
    }

    public calculateRandomShapeVertices(size: number) {
        const vertices: Vector[] = []
        const verticesCount = Math.floor(Math.random() * 10 + 3)
        for (let i = 0; i < verticesCount; i++) {
            const angle = i * this.p5.TWO_PI / verticesCount
            let x = size * this.p5.cos(angle)
            let y = size * this.p5.sin(angle)

            const noiseAmount = 50
            x += Math.random() * noiseAmount * 2 - noiseAmount
            y += Math.random() * noiseAmount * 2 - noiseAmount

            vertices.push(this.p5.createVector(x, y))
        }
        return vertices
    }

    //#endregion
}