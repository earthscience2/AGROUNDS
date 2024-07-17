import React from "react";
import useCanvas from "../../hook/useCanvas";
import mapBackground from "../../assets/playground.jpeg";
import { useEffect, useState, useRef } from "react";
const WIDTH = 400;
const HEIGHT = 200;
const Canvas = ({positions}) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        const image = new Image();
        image.src = mapBackground;
        image.onload = () => {
            context.drawImage(image, 0, 0, WIDTH, HEIGHT);

            // Draw path
            context.strokeStyle = 'blue';
            context.beginPath();
            context.moveTo(positions[0].x, positions[1].y);
            console.log(positions[0].x, positions[0].y)
            for (let i = 1; i < positions.length; i++) {
                context.lineTo(positions[i].x, positions[i].y);
            }
            context.stroke();

            // Draw current position
            context.fillStyle = 'red';
            context.beginPath();
            context.arc(positions[positions.length - 1].x, positions[positions.length - 1].y, 5, 0, 2 * Math.PI);
            context.fill();
        };
    }, [positions]);
    
    
    return (
        <>
            <canvas ref={canvasRef} width={WIDTH} height={HEIGHT} />
        </>
    )
}
export default Canvas;