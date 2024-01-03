import { ComposableMap, Geographies, Geography, Line, Marker, ZoomableGroup } from "react-simple-maps"
import React, { useCallback, useEffect, useRef, useState } from "react";
import { geoCentroid } from "d3-geo";
import Plane from "./Plane";
import Location from "./Location";
const geoUrl =
    "/map.json"

const Map = ({ flights = [] }) => {
    const [scale, setScale] = useState(300)
    const center = useRef([-12.36, 28.16])
    const [countries, setCountries] = useState({})
    const [planesPositions, setPlanesPositions] = useState([]);
    const lineRef = useRef(null)
    const [tooltip, setTooltip] = useState({ show: false, country: '', coordinates: [0, 0] })
    const zoomIn = () => {
        setScale((prevScale) => prevScale + 300)
    }
    const zoomOut = () => {
        setScale((prevScale) => prevScale - 100 > 100 ? prevScale - 100 : prevScale)
    }
    const handleMoveEnd = useCallback((event) => {
        // Update the center coordinates when the map is moved
        center.current = event.coordinates
    }, []);
    const getFrom = () => {
        return countries.morocco
    }
    const getTo = () => {
        return countries.egypt
    }
    const handlePosition = () => {
        console.log("handling....");
        flights.forEach((flight, index) => {
            flight.coordinates.forEach((item, item_index) => {
                setTimeout(() => {
                    setPlanesPositions((prevValue) => {
                        const newValue = [...prevValue]
                        newValue[index] = item
                        return newValue
                    })
                }, 1000 * item_index)
            })
        })

    }

    const handleCountries = (geo) => {
        if (geo.properties.name === 'Morocco'
            || geo.properties.name === 'Egypt'
            || geo.properties.name === 'Algeria'
            || geo.properties.name === 'Libya'
        ) {
            if (!countries[geo.properties.name.toLowerCase()]) {
                setTimeout(() => {
                    setCountries((prevCountries) => {
                        return { ...prevCountries, [geo.properties.name.toLowerCase()]: geoCentroid(geo) }
                    })
                }, 100)
            }
        }
    }
    const calculateArea = (coordinates) => {
        let area = 0;
        if (isNaN(coordinates[0][0])) {
            coordinates = coordinates[0]
        }
        // console.log(coordinates);
        for (let i = 0; i < coordinates.length - 1; i++) {

            area +=
                coordinates[i][0] * coordinates[i + 1][1] -
                coordinates[i + 1][0] * coordinates[i][1];
        }

        area +=
            coordinates[coordinates.length - 1][0] * coordinates[0][1] -
            coordinates[0][0] * coordinates[coordinates.length - 1][1];

        area = Math.abs(area) / 2;
        area *= (scale / 200)
        return area;
    };

    const displayTooltip = (country) => {
        console.log('entering...');
        setTooltip((prevValue) => {
            return { ...prevValue, show: true, country }
        })
    }
    const hideTooltip = () => {
        setTooltip({ show: false, country: '', coordinates: [] })
    }
    const handleMouseMove = (e) => {
        setTooltip((prevValue) => {
            return { ...prevValue, coordinates: [e.clientX, e.clientY] }
        })
    }
    const displayCountry = (name) => {
        const countries = ['Morocco', 'Algeria', 'Libya', 'Egypt', 'Saudi Arabia', 'Russia', 'United States', 'Brazil', 'Norway', 'Tunisia']
        return countries.includes(name);
    }

    useEffect(() => {
        handlePosition()
    }, [flights])

    return (
        <div>
            <div className="zoom-controls">
                <button onClick={zoomIn}>+</button>
                <button onClick={zoomOut}>-</button>
            </div>
            <ComposableMap
                style={{ width: 'calc( 100vw - 300px )', height: '99.3vh', userSelect: 'none' }}
                projectionConfig={{ scale, }}
            >
                <ZoomableGroup onMoveEnd={handleMoveEnd} center={center.current} zoom={1}>
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => {
                                handleCountries(geo)
                                return <React.Fragment key={geo.rsmKey}>
                                    <Geography
                                        // onMouseEnter={() => displayTooltip(geo.properties.name)}
                                        // onMouseLeave={() => hideTooltip()}
                                        onMouseMove={handleMouseMove}
                                        geography={geo}
                                        style={{
                                            default: {
                                                fill: "#1a1a1a",
                                                stroke: "#ffffff24",
                                            },
                                            hover: {
                                                fill: "#1a1a1a",
                                                stroke: "white"
                                            },

                                        }}
                                    />
                                    {
                                        displayCountry(geo.properties.name) && <Marker key={geo.rsmKey} coordinates={geoCentroid(geo)}>

                                            {
                                                <text
                                                    style={{
                                                        fill: '#797777',
                                                        strokeWidth: 0,
                                                        fontSize: 10,
                                                        fontWeight: 'bold'
                                                    }}
                                                    textAnchor='middle'
                                                >

                                                    {geo.properties.name}
                                                </text>
                                            }

                                        </Marker>
                                    }



                                </React.Fragment>
                            })
                        }


                    </Geographies>
                    {
                        flights.map((flight, index) => {
                            return <React.Fragment key={index}>
                                <Line

                                    stroke={flight.color}
                                    strokeWidth={1}
                                    strokeLinecap="round"
                                    strokeDasharray={10}
                                    coordinates={flight.coordinates}
                                />
                                <Marker
                                    coordinates={flight.coordinates[0]}
                                >
                                    <Location stroke={flight.color} />
                                </Marker>
                                <Marker
                                    coordinates={flight.coordinates[flight.coordinates.length - 1]}
                                >
                                    <Location stroke={flight.color} />
                                </Marker>
                                {
                                    planesPositions.length && <Marker
                                        coordinates={planesPositions[index]}
                                    >
                                        <Plane />
                                    </Marker>
                                }
                            </React.Fragment>
                        })
                    }
                    {
                        // planePosition.coordinates[0] !== 0 && <Marker
                        //     coordinates={planePosition.coordinates}
                        // >

                        //     <Plane />

                        // </Marker>
                    }
                    {/* {
                        countries.morocco && <Marker
                            coordinates={countries.morocco}
                        >
                            <Location />
                        </Marker>
                    }
                    {
                        countries.egypt && <Marker
                            coordinates={countries.egypt}
                            style={{
                                default: {
                                    marginTop: `-20px`
                                }
                            }}
                        >

                            <Location />

                        </Marker>
                    } */}

                    {/* <Line
                        from={[95.94816775687767, 66.07024048157966]}
                        to={[-53.171444519802456, -10.656153245885363]}
                        stroke={'white'}
                        strokeWidth={1}
                        strokeLinecap="round"
                        strokeDasharray={10}
                    /> */}
                </ZoomableGroup>

            </ComposableMap >
            {
                // tooltip.show && <div
                //     style={{
                //         position: 'absolute',
                //         top: tooltip.coordinates[1] + 20,
                //         left: tooltip.coordinates[0]
                //     }}
                // >


                //     {tooltip.country}

                // </div>
            }

        </div>

    )
}

export default Map
