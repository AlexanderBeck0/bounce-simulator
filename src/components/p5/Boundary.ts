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
    private drawer: Drawer;
    private vertices: Vector[] = []
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
    private drawnBoundary: Vector[] = []

    public addVertexToDrawnBoundary(vertex: Vector){
        this.drawnBoundary.push(vertex)
    }

    public clearCanvas(){
        this.p5.background(255)
    }

    // #endregion
    constructor(p5: P5CanvasInstance, shape: Shape, size?: number, position?: Vector) {
        this.p5 = p5;
        this.shape = shape;

        this.position = position || p5.createVector(0, 0);
        this.size = size || 100;

        this.velocity = this.p5.createVector(0, 0);
        this.acceleration = this.p5.createVector(0, 0);
        this.drawer = new Drawer(this.p5);
    }

    public createBoundary(segments?: number): Vector[] {
        this.p5.noFill();
        this.p5.stroke(0);
        this.p5.strokeWeight(3);

        if (this.shape === "Random" && this.vertices.length === 0) {
            this.vertices = this.drawer.calculateRandomShapeVertices(this.size)
        }
        if (this.shape === "Draw"){
            this.p5.beginShape()
            for (const vertex of this.drawnBoundary){
                this.p5.vertex(vertex.x, vertex.y)
            }
            this.p5.endShape(this.p5.CLOSE)
            return this.drawnBoundary
        }
        return this.drawer.draw(this.shape, this.position, this.size, this.shape === "Circle" ? segments : undefined, this.vertices);
    }

    // #endregion
}