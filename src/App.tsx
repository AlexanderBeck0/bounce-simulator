import { useState } from 'react';
import './App.css';
import OptionsUI from './components/OptionsUI';
import P5Canvas from './components/P5Canvas';

const Shapes = ["Square", "Circle", "Triangle"];
const BoundaryShapes = ["Square", "Circle", "Triangle", "Random"]
export type Shape = typeof Shapes[number];
export type BoundaryShape = typeof BoundaryShapes[number];

export default function App() {

	const [currentShape, setCurrentShape] = useState<Shape>("Square");
	const [currentBallShape, setCurrentBallShape] = useState<Shape>("Circle");
	const [currentBallCount, setCurrentBallCount] = useState<number>(0);
	function changeShape(shape: Shape): void {
		setCurrentShape(shape);
	}

	function changeBallShape(shape: Shape): void {
		setCurrentBallShape(shape);
	}

	function changeBallCount(newCount: number): void {
		setCurrentBallCount(newCount);
	}

	return (
		<>
			<OptionsUI changeShape={changeShape}
				changeBallShape={changeBallShape}
				changeBallCount={changeBallCount}
				shapes={Shapes}
				boundaryShapes={BoundaryShapes}
				currentShape={currentShape}
				currentBallShape={currentBallShape}
				currentBallCount={currentBallCount}
			/>
			<P5Canvas shape={currentShape} ballShape={currentBallShape} ballCount={currentBallCount} shapes={Shapes} />
		</>
	)
}
