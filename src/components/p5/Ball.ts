import { P5CanvasInstance } from '@p5-wrapper/react';
import { Color, Vector } from 'p5';
import { Force, Shape } from './../../App';
import Drawer from './Drawer';
export default class Ball {
    // #region Variables
    p5: P5CanvasInstance;
    shape: Shape;
    /**
     * Defaults to 5
     */
    size: number;
    /**
     * Defaults to this.p5.width / 2, this.p5.height / 2
     */
    position: Vector;
    velocity: Vector;
    acceleration: Vector;
    drawer: Drawer;
    rayColor: Color;
    // #endregion
    /**
     * The constructor for creating a ball. Initializes acceleration and velocity to 0
     * @param p5 A p5 instance
     * @param shape The shape of the ball
     * @param size The size of the ball. Defaults to 5.
     * @param position The start position of the ball. Defaults to the center of the canvas.
     */
    constructor(p5: P5CanvasInstance, shape: Shape, size?: number, position?: Vector, color?: Color) {
        this.p5 = p5;
        this.shape = shape;

        // Start position at center of canvas by default
        this.position = position || this.p5.createVector(p5.width / 2, p5.height / 2);
        this.size = size || 5;

        this.acceleration = this.p5.createVector(0, 0);
        this.velocity = this.p5.createVector(0, 0);

        this.drawer = new Drawer(this.p5);
        this.rayColor = color || this.p5.color(this.p5.random(255), this.p5.random(255), this.p5.random(255));
    }

    public display(): void {
        this.p5.noStroke();
        this.p5.fill(0);
        this.drawer.draw(this.shape, this.position, this.size);
    }

    // #region Movement

    /**
     * Applys a force to the ball. Mutates {@link acceleration}
     * @param force The force to add to the ball's {@link acceleration}. Only adds when `force.enabled` is `true`
     */
    public applyForce(force: Force): void {
        if (force.enabled) {
            const forceValue: Vector = typeof force.value === "function" ? force.value(this.size) : force.value;
            this.acceleration.add(forceValue);
        }
    }

    /**
     * Applies all the forces in `forces` to the ball. Mutates {@link acceleration}
     * @param forces The forces to add to the ball's {@link acceleration}. Only adds the ones where `force.enabled` is `true`
     */
    public applyForces(forces: Force[]): void {
        forces.filter(force => force.enabled).forEach(this.applyForce.bind(this));
    }

    /**
     * Updates the ball's {@link velocity}, {@link position}, and sets its {@link acceleration} to 0
     */
    public update(edges: Vector[], enableRaycasting: boolean): void {
        this.velocity.add(this.acceleration);
        // Use steps instead of checking their positions directly to remove the change that a fast enough ball goes flying through the boundary
        const steps = Math.ceil(this.velocity.mag());
        const step = this.p5.createVector();
        // If the velocity is 0, just leave it in place
        if (this.velocity.equals(0, 0)) {
            return;
        }

        Vector.div(this.velocity, steps, step);

        for (let i = 0; i < steps; i++) {
            const nextPos = Vector.add(this.position, step);
            const collision = this.collides(nextPos, edges, enableRaycasting);
            if (collision) {
                const normal = collision.normal;
                this.velocity.reflect(normal);
                break;
            } else {
                this.position.add(step);
            }
        }
        this.acceleration.mult(0);
    }

    public collides(nextPosition: Vector, vertices: Vector[], enableRaycasting: boolean): { collided: boolean, normal: Vector } | null {
        let j = vertices.length - 1;
        for (let i = 0; i < vertices.length; j = i++) {
            const collision = this.edgeIntersectsPoint(vertices[i], vertices[j], nextPosition, this.size, enableRaycasting);
            if (collision) {
                const edge = Vector.sub(vertices[j], vertices[i]);
                const normal = this.p5.createVector(-edge.y, edge.x).normalize();
                return { collided: true, normal: normal };
            }
        }
        return null;
    }

    public edgeIntersectsPoint(edgeStart: Vector, edgeEnd: Vector, point: Vector, radius: number, enableRaycasting: boolean): boolean {
        const line = Vector.sub(edgeEnd, edgeStart);
        // Vector from edgeStart to point
        const vectorToPoint = Vector.sub(point, edgeStart);
        const endMinusStartMagSquared = line.magSq();

        // Prevent division by 0
        if (endMinusStartMagSquared === 0) {
            const distance = Vector.dist(point, edgeStart);
            return distance <= radius;
        }

        const dotProduct = vectorToPoint.dot(line);
        let projection = dotProduct / endMinusStartMagSquared;

        // Clamp projection to be on the edge
        projection = this.p5.constrain(projection, 0, 1);

        /*const closest = this.p5.createVector();
        Vector.mult(line, projection, closest);
        const closestToPoint = Vector.add(edgeStart, closest);*/
        const closest = line.copy().mult(projection).add(edgeStart);
        // const distance = Vector.dist(point, closestToPoint);
        const distance = Vector.dist(point, closest);

        // Note: This is SUPER laggy (did not realize when I wrote this because I was not on my laptop)
        if (enableRaycasting && distance > radius && distance < 200) {
            this.p5.push();
            this.p5.fill(this.rayColor);
            this.p5.stroke(this.rayColor);
            this.p5.strokeWeight(Math.floor(this.size / 4));
            /*this.p5.circle(closestToPoint.x, closestToPoint.y, this.size);
            this.p5.line(closestToPoint.x, closestToPoint.y, point.x, point.y);*/
            this.p5.circle(closest.x, closest.y, this.size);
            this.p5.line(closest.x, closest.y, point.x, point.y);
            this.p5.pop();
        }

        return distance <= radius;
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