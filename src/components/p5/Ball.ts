import { P5CanvasInstance } from '@p5-wrapper/react';
import { Vector } from 'p5';
import { Shape } from './../../App';
import Drawer from './Drawer';
export default class Ball {
    // #region Variables
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
    drawer: Drawer;
    // #endregion
    /**
     * The constructor for creating a ball. Initializes acceleration and velocity to 0
     * @param p5 A p5 instance
     * @param shape The shape of the ball
     * @param size The size of the ball. Defaults to 10.
     * @param position The start position of the ball. Defaults to the center of the canvas.
     */
    constructor(p5: P5CanvasInstance, shape: Shape, size?: number, position?: Vector) {
        this.p5 = p5;
        this.shape = shape;

        // Start position at center of canvas by default
        this.position = position || this.p5.createVector(p5.width / 2, p5.height / 2);
        this.size = size || 10;

        this.acceleration = this.p5.createVector(0, 0);
        this.velocity = this.p5.createVector(0, 0);

        this.drawer = new Drawer(this.p5);
    }

    public display(): void {
        this.p5.noStroke();
        this.p5.fill(0);
        this.drawer.draw(this.shape, this.position, this.size);
    }

    // #region Movement

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

    public checkSiblingCollision(balls: Ball[]) {
        // Get siblings within a certain radius of this ball (to improve performance)
        // For now, get all balls (will improve performance later)
        // https://www.gorillasun.de/blog/an-algorithm-for-particle-systems-with-collisions/
        for (const ball of balls) {
            if (this === ball) continue;
            const distance = this.position.dist(ball.position);
            const sizeDistance = ball.size + this.size;

            if (distance <= sizeDistance) {
                const normal = Vector.sub(ball.position, this.position).normalize();
                const velocity = Vector.sub(ball.velocity, this.velocity);
                const dot = Vector.dot(velocity, normal);
                const impulse = this.p5.createVector();
                Vector.mult(normal, 2 * dot / (ball.size + this.size), impulse);

                const bounce = this.p5.createVector();
                Vector.mult(normal, sizeDistance - distance, bounce);

                const adjustedVelocity = this.p5.createVector();
                Vector.div(impulse, this.size, adjustedVelocity);

                const adjustedBallVelocity = this.p5.createVector();
                Vector.div(impulse, ball.size, adjustedBallVelocity);

                this.velocity.add(adjustedVelocity);
                ball.velocity.sub(adjustedBallVelocity);

                const adjustedPosition = this.p5.createVector();
                Vector.div(bounce, this.size, adjustedPosition);

                const adjustedBallPosition = this.p5.createVector();
                Vector.div(bounce, ball.size, adjustedBallPosition);

                this.position.sub(adjustedPosition);
                ball.position.add(adjustedBallPosition);

            }
        }
    }
    // #endregion
}