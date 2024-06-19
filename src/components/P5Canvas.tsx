import { ReactP5Wrapper, Sketch } from "@p5-wrapper/react";
import { BoundaryShape, Force, Shape } from "../App";
import Ball from "./p5/Ball";
import Boundary from "./p5/Boundary";
import { useRef } from "react";

interface P5CanvasProps {
    // changeForces: (newForces: Force[]) => void;
    addForce: (force: Force) => void;
    shape: BoundaryShape;
    segments: number;
    ballShape: Shape;
    ballCount: number;
    ballSize: number;
    boundarySize: number;
    isRaycastingEnabled: boolean;
    forces: Force[];

    // Additional props
    className?: string;
}
let rerenders = 0;
export default function P5Canvas(props: P5CanvasProps) {
    // const [rotation, setRotation] = useState(0);
    const balls: Ball[] = [];
    const boundaryRef = useRef<Boundary|null>(null);

    const sketch: Sketch = p5 => {
        console.log(rerenders++)
        // let boundary: Boundary;
        /**
         * @tutorial force To add a new force, simply add a new object with the name, value, and enabled fields.
         */
        let forces: Force[] = [
            {
                name: "Gravity",
                value: (size: number) => p5.createVector(0, 0.1 * size),
                enabled: true
            },
            {
                name: "Anti-Gravity",
                value: (size: number) => p5.createVector(0, -0.1 * size),
                enabled: false
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
        if (props.forces.length > 0) forces = props.forces;
        else forces.forEach(props.addForce);

        p5.setup = () => {
            p5.createCanvas(600, 400, p5.WEBGL);
            // boundary = new Boundary(p5, props.shape, props.boundarySize, p5.createVector(0, 0));
            boundaryRef.current = new Boundary(p5, props.shape, props.boundarySize, p5.createVector(0, 0));
            // Note: This is broken. Changing anything with the same shape hides the shape
            // if (!boundaryRef.current || props.shape !== boundaryRef.current.shape) {
            //     boundaryRef.current = new Boundary(p5, props.shape, props.boundarySize, p5.createVector(0, 0));
            // }

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
            // const edges = boundary.createBoundary(props.segments);
            const edges = boundaryRef.current!.createBoundary(props.segments);

            balls.forEach((ball, index) => {
                ball.applyForces(forces);
                ball.update(edges, props.isRaycastingEnabled);
                ball.display();
                ball.checkSiblingCollision(balls);

                // Remove any balls that go off screen
                if (ball.position.x + ball.size > p5.width || ball.position.x + ball.size < -p5.width) balls.splice(index, 1);
                if (ball.position.y + ball.size > p5.height || ball.position.y + ball.size < -p5.height) balls.splice(index, 1);
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