import { useEffect, useState } from "react";
import axios, { AxiosError } from 'axios'
import toast from "react-hot-toast";

function Bookings({ token }: { token: string | null }) {
    const [bookings, setBookings] = useState([])

    async function fetchBookings() {
        if (token) {
            try {
                let promise = axios.get(`${process.env.REACT_APP_BACKEND}/users/bookings`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                toast.promise(promise, {
                    loading: "Fetching your bookings ...",
                    success: "Fetched your bookings",
                    error: "Error in fetching your bookings"
                }, {
                    duration: 500
                })
                let response = await promise;
                setBookings(response.data.payload)
            } catch (error: any) {
                let axiosError: AxiosError = error;
                if (axiosError.response && axiosError.response.data) {
                    console.log(axiosError.response.data)
                } else console.log(axiosError)
            }
        }
    }

    useEffect(() => {
        fetchBookings()
    }, [])

    return (<section id="bookings" className="container pt-5">
        <div>
            <h2 className="text-dark"><center>My Bookings</center></h2>
            <hr className="mt-3 border border-dark border-1 opacity-25" />
            <div>
                {bookings.length > 0 ? bookings.map((booking: any, ind) => {
                    return (<div className="card mt-4" key={ind}>
                        <div className="card-body">
                            <h5 className="card-text">Flight Number : {booking.flight_number}</h5>
                        </div>
                    </div>)
                })
                    :
                    <div>No Booked Flights</div>
                }
            </div>
        </div>
    </section>)
}
export default Bookings;