import { ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import { Vector } from "p5";
import { ReactNode, useRef } from "react";
import { BoundaryShape, Force, Shape } from "../App";
import Ball from "./p5/Ball";
import Boundary from "./p5/Boundary";

interface P5CanvasProps {
    addForce: (force: Force) => void;
    addBall: (ball: Ball) => void;
    removeBalls: (index: number, count: number) => void;
    balls: Ball[];
    shape: BoundaryShape;
    segments: number;
    ballShape: Shape;
    ballSize: number;
    boundarySize: number;
    isRaycastingEnabled: boolean;
    isCollisionRaysEnabled: boolean;
    isBallDroppingEnabled: boolean
    forces: Force[];

    // Additional props
    className?: string;
    children?: ReactNode;
}
// let rerenders = 0;
export default function P5Canvas(props: P5CanvasProps) {
    const boundaryRef = useRef<Boundary | null>(null);

    const sketch: Sketch = (p5) => {
        let isDrawingBoundary = false
        let lastVertex: Vector | undefined
        // console.log(rerenders++)
        /**
         * @tutorial force To add a new force, simply add a new object with the name, value, and enabled fields.
         */
        let forces: Force[] = [];
        if (props.forces.length > 0) forces = props.forces;

        p5.setup = () => {
            const canvas = p5.createCanvas(600, 400, p5.WEBGL);
            boundaryRef.current = new Boundary(p5, props.shape, props.boundarySize, p5.createVector(0, 0));
            canvas.elt.addEventListener("contextmenu", (e: MouseEvent) => e.preventDefault())
        }

        p5.draw = () => {
            p5.background(100);
            p5.normalMaterial();

            const edges = boundaryRef.current!.createBoundary(props.segments);

            if (isDrawingBoundary && boundaryRef.current && lastVertex) {
                boundaryRef.current.addVertexToDrawnBoundary(lastVertex)
            }
            props.balls.forEach((ball, index) => {
                ball.applyForces(forces);
                ball.update(edges, props.isRaycastingEnabled);
                p5.noStroke();
                p5.fill(0);
                p5.push();
                p5.beginShape();
                const verts = ball.drawer.calculateVertices(ball.shape, ball.position, ball.size, 30);
                for (const v of verts) {
                    p5.vertex(v.x, v.y);
                }
                p5.endShape(p5.CLOSE);
                p5.pop();
                ball.checkSiblingCollision(props.balls, boundaryRef.current!, props.isCollisionRaysEnabled);

                // Remove any balls that go off screen
                if (ball.position.x + ball.size > p5.width || ball.position.x + ball.size < -p5.width) props.removeBalls(index, 1);
                if (ball.position.y + ball.size > p5.height || ball.position.y + ball.size < -p5.height) props.removeBalls(index, 1);
            });

            p5.mousePressed = () => {
                if (p5.mouseButton === p5.RIGHT && p5.mouseX >= 0 && p5.mouseX <= p5.width && p5.mouseY >= 0 && p5.mouseY <= p5.height) {
                    const x = p5.mouseX - p5.width / 2
                    const y = p5.mouseY - p5.height / 2
                    props.addBall(new Ball(p5, props.ballShape, props.ballSize, p5.createVector(x, y)))
                }
                else if (props.shape === "Draw" && p5.mouseButton === p5.LEFT && p5.mouseX >= 0 && p5.mouseX <= p5.width && p5.mouseY >= 0 && p5.mouseY <= p5.height) {
                    isDrawingBoundary = true
                    boundaryRef.current!.clearDrawnBoundary()
                    const x = p5.mouseX - p5.width / 2
                    const y = p5.mouseY - p5.height / 2
                    lastVertex = p5.createVector(x, y)
                }
            }

            p5.mouseReleased = () => {
                isDrawingBoundary = false
                lastVertex = undefined
            }

            p5.mouseDragged = () => {
                if (isDrawingBoundary && p5.mouseX >= 0 && p5.mouseX <= p5.width && p5.mouseY >= 0 && p5.mouseY <= p5.height) {
                    const x = p5.mouseX - p5.width / 2
                    const y = p5.mouseY - p5.height / 2
                    lastVertex = p5.createVector(x, y)
                }
            }

            p5.mouseClicked = () => {
                if (p5.mouseButton === p5.LEFT && p5.mouseX >= 0 && p5.mouseX <= p5.width && p5.mouseY >= 0 && p5.mouseY <= p5.height && boundaryRef.current?.shape !== "Draw" && props.isBallDroppingEnabled) {
                    const x = p5.mouseX - p5.width / 2
                    const y = p5.mouseY - p5.height / 2
                    props.addBall(new Ball(p5, props.ballShape, 5, p5.createVector(x, y)))
                }
            }
        }
    }

    return (
        <div className={props.className}>
            <ReactP5Wrapper sketch={sketch} />
            {props.children}
        </div>
    );
}