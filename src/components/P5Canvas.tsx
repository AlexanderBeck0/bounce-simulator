import { ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import { Vector } from "p5";
import { BoundaryShape, Force, Shape } from "../App";
import Ball from "./p5/Ball";
import Boundary from "./p5/Boundary";
import Drawer from "./p5/Drawer";

interface P5CanvasProps {
    // changeForces: (newForces: Force[]) => void;
    shape: BoundaryShape;
    segments: number;
    ballShape: Shape;
    ballCount: number;
    ballSize: number;
    boundarySize: number;
    isRaycastingEnabled: boolean;
    // forces: Force[];

    // Additional props
    className?: string;
}

export default function P5Canvas(props: P5CanvasProps) {
    // const [rotation, setRotation] = useState(0);
    const balls: Ball[] = [];

    const sketch: Sketch = p5 => {
        let boundary: Boundary;
        let edges: Vector[];
        const drawer = new Drawer(p5);
        const forces: Force[] = [
            {
                name: "Gravity",
                value: (size: number) => p5.createVector(0, 0.1 * size),
                enabled: true
            },
            {
                name: "Right Force",
                value: (size: number) => p5.createVector(0.1 * size, 0),
                enabled: false
            },
            {
                name: "Left Force",
                value: (size: number) => p5.createVector(-0.1 * size, 0),
                enabled: false
            },
        ];

        p5.setup = () => {
            p5.createCanvas(600, 400, p5.WEBGL);
            boundary = new Boundary(p5, props.shape, props.boundarySize, p5.createVector(0, 0));
            edges = drawer.calculateVertices(boundary.shape, boundary.position, boundary.size, props.segments);

            for (let i = 0; i < props.ballCount; i++) {
                const startPosition = p5.createVector(Math.random() * 100, Math.random() * 100);
                balls.push(new Ball(p5, props.ballShape, props.ballSize, startPosition));
            }
        }

        function enableForce(forceName: string): void {
            const foundForces: Force[] = forces.filter(force => force.name === forceName);
            if (foundForces.length > 0) {
                foundForces[0].enabled = true;
            }
        }

        function disableForce(forceName: string): void {
            const foundForces: Force[] = forces.filter(force => force.name === forceName);
            if (foundForces.length > 0) {
                foundForces[0].enabled = false;
            }

        }

        p5.draw = () => {
            p5.background(100);
            p5.normalMaterial();
            /*if (rotation !== 0) {
                p5.rotateY(rotation);
            }*/
            // p5.push();
            // if (props.shape === "Circle" && props.segments) {
            //     edges = drawer.calculateVertices(boundary.shape, boundary.position, boundary.size, props.segments);
            // }
            edges = boundary.createBoundary(props.segments) || edges;

            balls.forEach((ball, index) => {
                ball.applyForces(forces);
                ball.update(edges, props.isRaycastingEnabled);
                ball.display();
                ball.checkSiblingCollision(balls);

                // Remove any balls that go off screen
                if (ball.position.x + ball.size > 600 || ball.position.x + ball.size < -600) balls.splice(index, 1);
                if (ball.position.y + ball.size > 400 || ball.position.y + ball.size < -400) balls.splice(index, 1);
            });

            p5.mouseClicked = () => {
                if (p5.mouseButton === p5.LEFT && p5.mouseX >= 0 && p5.mouseX <= p5.width && p5.mouseY >= 0 && p5.mouseY <= p5.height) {
                    const x = p5.mouseX - p5.width / 2
                    const y = p5.mouseY - p5.height / 2
                    balls.push(new Ball(p5, props.ballShape, 5, p5.createVector(x, y)))
                }
            }

            // TODO List:
            // - Add collisions between balls: A
            //  - Make it so collisions do not force other balls out
            // - Make immovable balls (possibly on timer): A
            // - DONE: Add a "random" boundary shape: S

            // - DONE: Allow user to set start drop position: S
            // - Allow user to add their own forces?: A


            // Must add
            // - Allow user to draw own boundary: S (attempt)

            // UI things
            // - DONE: Allow user to change size of boundary/ball: A
            // - DONE: If boundary is circle, let user change the number of segments: A
        }



        //p5.updateWithProps = props => {
        //};
    }


    /*useEffect(() => {
        const interval = setInterval(() => {
            setRotation(rotation => rotation + 100);
        }, 100);
        return () => {
            clearInterval(interval);
        };
    }, []);*/

    return (
        <div className={props.className}>
            <ReactP5Wrapper sketch={sketch} /*rotation={rotation}*/ />
        </div>
    );
}