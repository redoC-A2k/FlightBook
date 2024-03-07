import axios, { AxiosError } from "axios";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

function AddFlight({ token, setToken, isAdmin, setIsAdmin }: { token: string | null, setToken: React.Dispatch<React.SetStateAction<string | null>>, isAdmin: boolean, setIsAdmin: React.Dispatch<React.SetStateAction<boolean>> }) {

    const [formData, setFormData] = useState({
        date: "",
        time: ""
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        try {

            let promise = axios.post(`${process.env.REACT_APP_BACKEND}/admin/flight`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            toast.promise(promise, {
                loading: "Adding flight ...",
                success: "Flight added successfuly",
                error: "Error in adding flight"
            })
            let response = await promise;
            console.log(response.data)
        } catch (error: any) {
            let axiosError: AxiosError = error;
            if (axiosError.response && axiosError.response.data) {
                console.log(axiosError.response.data)
            } else console.log(axiosError)
        }
    }

    return (<section id="addFlight" className="container pt-5">
        <div>
            <h2 className="text-dark"><center>Add Flight</center></h2>
            <hr className="mt-3 border border-dark border-1 opacity-25" />
            <div className="row">
                <form className="col-12 col-md-8 offset-md-2" onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <label className="form-label" htmlFor="date">Enter Date : </label>
                        <input type="date" className="form-control" name="date" title="date" onChange={handleChange} />
                    </div>
                    <div className="mt-4">
                        <label className="form-label" htmlFor="time">Enter Time : </label>
                        <input type="time" className="form-control" name="time" title="time" onChange={handleChange} />
                    </div>
                    <div className="mt-5">
                        <button className="cta">submit</button>
                    </div>
                </form>
            </div>
        </div>
    </section>)
}

export default AddFlight;