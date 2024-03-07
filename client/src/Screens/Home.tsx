import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import toast from 'react-hot-toast'
import axios, { AxiosError } from 'axios'
import { Link } from "react-router-dom";

function Home({ token, setToken }: { token: string | null, setToken: React.Dispatch<React.SetStateAction<string | null>> }) {
    const [flights, setFlights] = useState([]);
    const page = useRef(1)
    const date = useRef("")
    const time = useRef("")
    let fetchFlights = useCallback(async function (page: number = 1) {
        if (token) {
            try {
                let promise = axios.get(`${process.env.REACT_APP_BACKEND}/flights?page=${page}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                toast.promise(
                    promise,
                    {
                        loading: "Fetching flights ...",
                        success: "Fetched flights",
                        error: "Error in fetching flights",
                    }, {
                    duration: 500
                })

                let response = await promise;
                console.log(response.data)
                setFlights(response.data.payload)
            } catch (error: any) {
                let axiosError: AxiosError = error;
                if (axiosError.response && axiosError.response.data) {
                    console.log(axiosError.response.data)
                } else console.log(axiosError)
            }
        }
    }, [])

    useEffect(() => {
        fetchFlights(page.current)
    }, [])

    function fetchPrev() {
        page.current = page.current - 1
        if (page.current > 0)
            fetchFlights(page.current)
    }

    async function fetchNext() {
        page.current = page.current + 1
        fetchFlights(page.current)
    }

    async function bookFlight(flightNumber: Number) {
        let promise = axios.post(`${process.env.REACT_APP_BACKEND}/users/flights/book`, { flight_number: flightNumber }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        toast.promise(promise, {
            loading: "Booking your flight ...",
            success: "Your flight has been booked",
            error: "Error in booking flight"
        })
        await promise
    }

    let reset = useCallback(function () {
        fetchFlights(1)
    }, [])

    let logout = useCallback(() => {
        localStorage.clear()
        setToken("")
    }, [setToken])

    async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        let url = ""
        if (e.target.name === "date") date.current = e.target.value;
        else if (e.target.name === "time") time.current = e.target.value;

        if (date.current !== "" && time.current === "")
            url = `${process.env.REACT_APP_BACKEND}/flights/search/date/${e.target.value}`
        else if (time.current !== "" && date.current === "")
            url = `${process.env.REACT_APP_BACKEND}/flights/search/time/${e.target.value}`
        else if (date.current !== "" && time.current !== "")
            url = `${process.env.REACT_APP_BACKEND}/flights/search/date/${e.target.value}/time/${e.target.value}`

        console.log("url = ", url)
        if (url !== "")
            try {
                let response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setFlights(response.data.payload)
            } catch (error: any) {
                let axiosError: AxiosError = error;
                if (axiosError.response && axiosError.response.data) {
                    console.log(axiosError.response.data)
                } else console.log(axiosError)
            }
    }

    return (
        <section id="home" className="container pt-5">
            <div>
                <h2 className="text-dark"><center>Flights</center></h2>
                <hr className="mt-3 border border-dark border-1 opacity-25" />
                <div className="controls">
                    <div className="search ">
                        <div className="me-4">
                            <label htmlFor="date">Search by Date : </label>
                            <input title="date" name="date" onChange={handleChange} id="date" type="date" />
                        </div>
                        <div className="me-4">
                            <label htmlFor="time">Search by Time : </label>
                            <input title="time" name="time" onChange={handleChange} id="time" type="time" />
                        </div>
                        <div>
                            <button title="reset" onClick={reset}><i className="fa-solid fa-rotate-left"></i></button>
                        </div>
                    </div>
                    <div className="links">
                        <Link to="/bookings" className="link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover me-3"><h4>My Bookings</h4></Link>
                        <Link to="/signin" className="link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover" onClick={logout}><h4>Logout</h4></Link>
                    </div>
                </div>
                <hr className="mb-3 border border-dark border-1 opacity-25" />
                <div>
                    {flights.length > 0 ? flights.map((flight: any, ind) => {
                        return (<div className="card mt-4" key={ind}>
                            <div className="card-body">
                                <h4 className="card-title"><span>Date : {flight.date}</span>  <span>Time : {flight.time}</span></h4>
                                <h5 className="card-text">Flight Number : {flight.flight_number}</h5>
                            </div>
                            <div className="card-footer">
                                <button className="px-3 py-1 cta" onClick={() => bookFlight(flight.flight_number)}>Book</button>
                            </div>
                        </div>)
                    })
                        :
                        <div>No Flights</div>
                    }
                </div>
            </div>
            <hr className="mt-5 border border-dark border-1 opacity-25" />
            <div>
                <button className="px-3 py-1" disabled={page.current == 1 ? true : false} onClick={fetchPrev}>Prev</button>
                <span className="mx-2">Current page : {page.current}</span>
                <button className="px-3 py-1" disabled={flights.length == 0 ? true : false} onClick={fetchNext}>Next</button>
            </div>
        </section>
    )
}
export default Home;