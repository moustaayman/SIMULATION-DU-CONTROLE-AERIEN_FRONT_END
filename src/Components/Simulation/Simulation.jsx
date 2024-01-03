
import FlightsList from './FlightsList'
import { useState } from 'react'
import axios from 'axios'
import { useEffect } from 'react'
import Map from './Map'
const colors = [
    '#00ddff', // cyan
    '#ffe500', // yellow
    '#ff0093', // pink
    '#00ffa2', // green
    '#ff9917', // orange
    '#a78bfa' // purple
]
const Simulation = () => {
    const [flights, setFlights] = useState()
    const fetchFlights = async () => {
        try {
            let { data } = await axios.get(
                "http://localhost:8080/vols/getAllVol"
            );
            const newFlights = data.map((flight, index) => {
                console.log(flight.aeroportDepart.name);
                return {
                    coordinates: [
                        [flight.aeroportDepart.x, flight.aeroportDepart.y],
                        ...flight.escale.map(escale => [escale.aeroportResponse.x, escale.aeroportResponse.y]),
                        [flight.aeroportArrive.x, flight.aeroportArrive.y]
                    ],
                    color: colors[index],
                    src: flight.aeroportDepart.name,
                    destination: flight.aeroportArrive.name
                }
            })
            setFlights(newFlights)


        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    useEffect(() => {
        fetchFlights()
        document.body.classList.add('black')
        return () => document.body.classList.remove('black')
    }, [])
    return (
        <div className='simulation-container'>
            <FlightsList flights={flights} />
            <Map flights={flights} />

        </div>
    )
}

export default Simulation
