import React from 'react'
import { useRef } from 'react'



const colors = [
    '#00ddff', // cyan
    '#ffe500', // yellow
    '#ff0093', // pink
    '#00ffa2', // green
    '#ff9917', // orange
    '#a78bfa' // purple
]
const FlightsList = ({ flights = [] }) => {
    const usedColors = useRef([])

    const generateRandomColor = () => {
        console.log('hello');
        let randomColor = Math.floor(Math.random() * (colors.length - 1))
        console.log(colors[randomColor]);
        while (usedColors?.current?.includes(colors[randomColor])) {
            randomColor = Math.floor(Math.random() * (colors.length - 1))
        }
        usedColors?.current?.push(colors[randomColor])
        return colors[randomColor]
    }
    return (
        <aside>
            <h2 className='title'>
                Flights List
            </h2>
            <ul>
                {
                    flights.map((flight, index) => {
                        return <div key={index} className='flight-item'>
                            <span>
                                {flight.src}
                            </span>
                            <span>
                                -
                            </span>
                            <span>
                                {flight.destination}
                            </span>
                            <span className='color' style={{ background: flight.color }}>

                            </span>

                        </div>
                    })
                }
            </ul>

        </aside>
    )
}

export default FlightsList
