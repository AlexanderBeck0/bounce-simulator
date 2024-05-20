import { P5CanvasInstance } from '@p5-wrapper/react';
import { Vector } from 'p5';
import { Shape } from './../../App';
import Drawer from './Drawer';
export default class Ball {
    //#region Variables
    p5: P5CanvasInstance;
    shape: Shape;
    size: number;
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    shapeMap: Map<Shape, () => void>;
    shapes: Shape[];
    drawer: Drawer;
    //#endregion
    constructor(p5: P5CanvasInstance, shape: Shape, shapes: Shape[], size?: number, position?: Vector) {
        this.p5 = p5;
        this.shape = shape;
        this.shapes = shapes;

        this.position = position || this.p5.createVector(0.1, 0);
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
        this.shapeMap.get(this.shape)!();
    }

    //#region Movement

    /**
     * Applys a force to the ball. Mutates {@link acceleration}
     * @param force The force Vector to add to the ball
     */
    public applyForce(force: Vector) {
        const forceToApply = this.p5.createVector(0, 0);
        Vector.div(force, this.size, forceToApply);
        this.acceleration.add(forceToApply);
    }

    /**
     * Updates the ball's {@link velocity}, {@link position}, and sets its {@link acceleration} to 0
     */
    public update() {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.mult(0); // Clear acceleration
    }

    /**
     * @param point The position Vector of the point
     * @param vertices An array of Vectors representing the vertices of a boundary
     * @returns True if the point is in the shape
     * @throws "Invalid Shape" if there are 3 or less vertices
     */
    public isPointInShape(vertices: Vector[]): boolean {
        if (vertices.length <= 3) {
            // Not a valid polygon
            throw "Invalid Shape";
        }
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


        if (this.position.x < minX || this.position.x > maxX || this.position.y < minY || this.position.y > maxY) {
            return false;
        }

        let j = vertices.length - 1;
        for (let i = 0; i < vertices.length; j = i++) {
            // console.log("vertices[i].y > point.y: " + (vertices[i].y > point.y))
            // console.log("vertices[j].y > point.y: " + (vertices[j].y > point.y))

            const vix = +vertices[i].x.toPrecision(4);
            const viy = +vertices[i].y.toPrecision(4);
            const vjy = +vertices[j].y.toPrecision(4);
            const vjx = +vertices[j].x.toPrecision(4);
            const px = +this.position.x.toPrecision(4);
            const py = +this.position.y.toPrecision(4);

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

                    const pxMinusVix = px - vix;
                    const pyMinusViy = py - viy;
                    const vjyMinusViy = vjy - viy;
                    const denominator = vjyMinusViy;

                    if (pxMinusVix === 0) isInside = true;
                    const numerator = pxMinusVix * pyMinusViy;
                    console.log('vjx - vix:', pxMinusVix);
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
                        // isInside = true;
                    }
                }
                console.log('--------------------')
            }

            // ### END DEBUGGING ###
            if ((viy > py) !== (vjy > py) &&
                px < ((px - vix) * (py - viy)) / ((vjy - viy) + vix)) {
                isInside = true;
            }
        }

        return isInside;
    }

    public checkEdges(edges: Vector[]) {
        // I think 20.65 is an arbitrary number? Without it, the ball moves off the screen before bouncing.
        if (this.position.y > this.p5.height - this.size * 20.65) {
            this.velocity.y *= -0.9;
            this.position.y = this.p5.height - this.size * 20.65;
        }

        if (this.position.y < this.size * 20.65 - this.p5.height) {
            this.velocity.y *= -0.9;
            this.position.y = this.size * 20.65 - this.p5.height;
        }

        if (this.position.x > this.p5.width - this.size * 20.65) {
            this.velocity.x *= -0.9;
            this.position.x = this.p5.width - this.size * 20.65;
        }

        if (this.position.x < this.size * 20.65 - this.p5.width) {
            this.velocity.x *= -0.9;
            this.position.x = this.size * 20.65 - this.p5.width;
        }

        const isInside = this.isPointInShape(edges);
        if (!isInside) {
            this.velocity.y *= -0.9;
            this.velocity.x *= -0.9;
            // Dividing by 2 dampens the bounce effect
            if (this.velocity.y < 0) {
                this.position.y = this.position.y - this.size / 2;
            }
            if (this.velocity.x < 0) {
                this.position.x = this.position.x - this.size / 2;
            }
            if (this.velocity.y > 0) {
                this.position.y = this.position.y + this.size / 2;
            }
            if (this.velocity.x > 0) {
                this.position.x = this.position.x + this.size / 2;
            }
        }
    }
    //#endregion
}