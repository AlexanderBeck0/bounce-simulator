import { P5CanvasInstance } from '@p5-wrapper/react';
import { Vector } from 'p5';
import { Shape } from './../../App';
import Drawer from './Drawer';

/**
 * @example const boundary = new Boundary(p5, props.shape, props.shapes, 100);
            boundary.createBoundary();
 */
export default class Boundary {
    //#region Variables
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

    //#endregion
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

    //#region Collisions
    
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
     * @deprecated
     * @param point The position Vector of the point
     * @param vertices An array of Vectors representing the vertices of a boundary
     * @returns True if the point is in the shape
     */
    public isPointInShape(point: Vector, vertices: Vector[]): boolean {
        let isInside = false;
        let minX = this.p5.width,
            maxX = 0,
            minY = this.p5.height,
            maxY = 0;

        for (const v of vertices) {
            if (v.x < minX) minX = v.x;
            if (v.x > maxX) maxX = v.x;
            if (v.y < minY) minY = v.y;
            if (v.y > maxY) maxY = v.y;
        }


        if (point.x < minX || point.x > maxX || point.y < minY || point.y > maxY) {
            return false;
        }

        let j = vertices.length - 1;
        for (let i = 0; i < vertices.length; j = i++) {
            // console.log("vertices[i].y > point.y: " + (vertices[i].y > point.y))
            // console.log("vertices[j].y > point.y: " + (vertices[j].y > point.y))

            const vix = vertices[i].x;
            const viy = vertices[i].y;
            const vjy = vertices[j].y;
            const vjx = vertices[j].x;
            const px = point.x;
            const py = point.y;

            // ### DEBUGGING ###
            const doDebug = false;
            if (doDebug) {
                console.log('viy:', viy);
                console.log('vjy:', vjy);
                console.log('px:', px);
                console.log('py:', py);
                console.log('vjx:', vjx);
                console.log('vix:', vix);

                const isAboveVi = viy > py;
                const isAboveVj = vjy > py;
                console.log('Is above vi:', isAboveVi);
                console.log('Is above vj:', isAboveVj);
                const isAboveDifferent = isAboveVi !== isAboveVj;
                console.log('Is above different:', isAboveDifferent);

                if (isAboveDifferent) {
                    console.log('First condition met');

                    const vjxMinusVix = px - vix;
                    const pyMinusViy = py - viy;
                    const vjyMinusViy = vjy - viy;
                    const denominator = vjyMinusViy;

                    // if (vjxMinusVix === 0) isInside = true;
                    const numerator = vjxMinusVix * pyMinusViy;
                    console.log('vjx - vix:', vjxMinusVix);
                    console.log('py - viy:', pyMinusViy);
                    console.log('vjy - viy', vjyMinusViy);

                    console.log('Numerator:', numerator);
                    console.log('Denominator:', denominator);
                    const numeratorDividedByDenominator = numerator / denominator;
                    console.log('Numerator divided by denominator:', numeratorDividedByDenominator);

                    const isPxLessThanCalculation = px < numeratorDividedByDenominator;
                    console.log('Is px less than calculation:', isPxLessThanCalculation);

                    if (isPxLessThanCalculation) {
                        console.log('Second condition met');
                        isInside = true;
                    }
                }
                console.log('--------------------')
            }
            // ### END DEBUGGING ###

            if ((viy > py) != (vjy > py) &&
                px < ((vjx - vix) * (py - viy)) / ((vjy - viy) + vix)) {
                isInside = true;
            }
        }

        return isInside;
    }

    /**
     * Uses {@link containsMap this.containsMap}
     * @param point A position Vector of a point
     * @returns True if the object is in the shape
     */
    public contains(point: Vector): boolean {
        return this.containsMap.get(this.shape)!(point);
    }
    //#endregion
}