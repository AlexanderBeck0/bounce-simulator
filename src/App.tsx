import { Vector } from 'p5';
import { useRef, useState } from 'react';
import './App.css';
import OptionsUI from './components/OptionsUI';
import P5Canvas from './components/P5Canvas';
import Ball from './components/p5/Ball';

const Shapes = ["Square", "Circle", "Triangle"];
const BoundaryShapes = ["Square", "Circle", "Triangle", "Random"]
export type Shape = typeof Shapes[number];
export type BoundaryShape = typeof BoundaryShapes[number];

export type Force = {
	name: string;
	value: Vector | ((size: number) => Vector);
	enabled: boolean;
}

export default function App() {
	const [currentShape, setCurrentShape] = useState<Shape>("Square");
	const [currentBallShape, setCurrentBallShape] = useState<Shape>("Circle");
	const [currentBallCount, setCurrentBallCount] = useState<number>(0);
	const [currentBallSize, setCurrentBallSize] = useState<number>(5);
	const [currentBoundarySize, setCurrentBoundarySize] = useState<number>(100);
	const [segments, setSegments] = useState<number>(30);
	const [isRaycastingEnabled, setIsRaycastingEnabled] = useState<boolean>(false);
	const forcesRef = useRef<Force[]>([]);
	// const collisionsRef = useRef<boolean[]>([true, true]);
	const ballsRef = useRef<Ball[]>([]);

	/**
	 * Adds a force to {@link forcesRef}
	 * @param force The force to add
	 */
	function addForce(force: Force): void {
		const isDuplicate = forcesRef.current.some(newForce => newForce.name === force.name);
		if (!isDuplicate) {
			forcesRef.current.push(force);
		} else {
			forcesRef.current.find(existingForce => existingForce.name === force.name)!.enabled = force.enabled;
		}
	}

	/**
	 * Removes a force from {@link forcesRef}
	 * @param forceName The name of the force to remove
	 */
	function removeForce(forceName: string): void {
		const indexOfForce = forcesRef.current.findIndex(existingForce => existingForce.name === forceName);
		if (indexOfForce !== -1) {
			forcesRef.current.splice(indexOfForce, 1);
		}
	}

	// function addCollision(collisionIndex: number) {
	// 	throw "not finished"
	// }

	/**
	 * Adds a ball to {@link ballsRef}
	 * @param ball The ball to add
	 */
	function addBall(ball: Ball) {
		ballsRef.current.push(ball);
	}

	/**
	 * Removes balls from {@link ballsRef}
	 * @param index The zero-based location in the array from which to start removing balls.
	 * @param count The number of balls to remove.
	 */
	function removeBalls(index: number, count: number) {
		ballsRef.current.splice(index, count);
	}

	/**
	 * Calls {@link removeBalls()} to remove all the balls from {@link ballsRef}
	 */
	function clearBalls() {
		removeBalls(0, ballsRef.current.length);
	}


	return (
		<div className="flex-col">
			<div>
				<OptionsUI changeShape={setCurrentShape}
					changeBallShape={setCurrentBallShape}
					changeBallCount={setCurrentBallCount}
					changeBallSize={setCurrentBallSize}
					changeBoundarySize={setCurrentBoundarySize}
					changeSegments={setSegments}
					changeRayCasting={setIsRaycastingEnabled}
					clearBalls={clearBalls}
					removeForce={removeForce}
					shapes={Shapes}
					boundaryShapes={BoundaryShapes}
					currentShape={currentShape}
					currentBallShape={currentBallShape}
					currentBallCount={currentBallCount}
					currentBallSize={currentBallSize}
					currentBoundarySize={currentBoundarySize}
					segments={segments}
					isRaycastingEnabled={isRaycastingEnabled}
					forces={forcesRef.current}
				/>
			</div>
			<div className="mt-2 flex items-center justify-center">
				<P5Canvas
					// changeForces={setForces}
					addForce={addForce}
					addBall={addBall}
					removeBalls={removeBalls}
					balls={ballsRef.current}
					shape={currentShape}
					segments={segments}
					ballShape={currentBallShape}
					ballCount={currentBallCount}
					ballSize={currentBallSize}
					boundarySize={currentBoundarySize}
					isRaycastingEnabled={isRaycastingEnabled}
					forces={forcesRef.current}
				/>
			</div>
		</div>
	)
}
