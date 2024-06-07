import { ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import { Vector } from "p5";
import { Force, Shape } from "../App";
import Ball from "./p5/Ball";
import Boundary from "./p5/Boundary";
import Drawer from "./p5/Drawer";

interface P5CanvasProps {
    shape: Shape;
    ballShape: Shape;
    ballCount: number;
    ballSize: number;
    boundarySize: number;
}

export default function P5Canvas(props: P5CanvasProps) {
    // const [rotation, setRotation] = useState(0);
    const balls: Ball[] = [];

    /*type sketchProps = SketchProps & {
        rotation: number;
    }*/

    const sketch: Sketch = p5 => {
        let boundary: Boundary;
        let edges: Vector[];
        const drawer = new Drawer(p5);
        p5.setup = () => {
            p5.createCanvas(600, 400, p5.WEBGL);
            boundary = new Boundary(p5, props.shape, props.boundarySize, p5.createVector(0, 0));
            edges = drawer.calculateVertices(boundary.shape, boundary.position, boundary.size, 30);
            for (let i = 0; i < props.ballCount; i++) {
                const startPosition = p5.createVector(Math.random() * 100, Math.random() * 100);
                balls.push(new Ball(p5, props.ballShape, props.ballSize, startPosition));
            }
        }

        p5.draw = () => {
            p5.background(100);
            p5.normalMaterial();
            /*if (rotation !== 0) {
                p5.rotateY(rotation);
            }*/
            // p5.push();
            boundary.createBoundary();

            balls.forEach(ball => {
                const gravity: Force = {
                    name: "Gravity",
                    value: p5.createVector(0, 0.1 * ball.size),
                    enabled: true
                };
                const rightForce: Force = {
                    name: "Right Force",
                    value: p5.createVector(0.1 * ball.size, 0),
                    enabled: false
                };
                ball.applyForce(gravity);
                ball.applyForce(rightForce); 
                ball.update();
                ball.display();
                ball.checkEdges(edges);
                ball.checkSiblingCollision(balls);
            });
            // TODO List: 
            // - Add collisions between balls: A
            // - Make immovable balls (possibly on timer): A
            // - Add a "random" boundary shape: S

            // - Allow user to set start drop position: S
            // - Allow user to add their own forces?: A

            // Must add
            // - Allow user to draw own boundary: S (attempt)

            // UI things
            // - DONE: Allow user to change size of boundary/ball: A
            // - If boundary is circle, let user change the number of segments: A
        }

        /*// Not liking how I'm redefining this locally. Might want to change later...
        p5.updateWithProps = (props: { rotation: number }) => {
            if (props.rotation) {
                setRotation((props.rotation * Math.PI) / 180);
            }
        };*/
    }

    /*useEffect(() => {
        const interval = setInterval(() => {
            setRotation(rotation => rotation + 100);
        }, 100);
        return () => {
            clearInterval(interval);
        };
    }, []);*/

    return <ReactP5Wrapper sketch={sketch} /*rotation={rotation}*/ />;
}