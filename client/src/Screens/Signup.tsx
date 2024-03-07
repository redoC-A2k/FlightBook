import { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

function Signup({ token, setToken }: { token: string | null, setToken: React.Dispatch<React.SetStateAction<string | null>> }) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        username: ""
    })
    const [errors, setErrors] = useState({
        email: "",
        password: ""
    })

    const navigate = useNavigate()

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {

        if (!e.target.checkValidity()) {
            if (e.target.name === 'email')
                setErrors({ ...errors, email: 'Please enter valid email ' })
            else if (e.target.name === 'password')
                setErrors({ ...errors, password: 'password must be atleast 8 characters long' })
        } else {
            if (e.target.name === 'email')
                setErrors({ ...errors, email: '' })
            else if (e.target.name === 'password')
                setErrors({ ...errors, password: '' })
            setFormData({ ...formData, [e.target.name]: e.target.value })
        }
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (formData.email === "") {
            setErrors({ ...errors, email: 'email cannot be empty' })
        } else if (formData.password.length < 8) {
            setErrors({ ...errors, password: 'Password must be atleast 8 characters long' })
        } else if (formData.password === "") {
            setErrors({ ...errors, password: 'Password cannot be empty' })
        } else {
            try {

                formData.username = formData.email
                let promise = axios.post(`${process.env.REACT_APP_BACKEND}/users/signup`, formData)
                toast.promise(promise, {
                    loading: 'Creating Account ...',
                    success: 'Sign in with new credentials',
                    error: 'Error in signing you up',
                })
                await promise;
                navigate('/signin')
            } catch (error:any) {
                let axiosError:AxiosError = error;
                if(axiosError.response && axiosError.response.data){
                    console.log(axiosError.response.data)
                } else console.log(axiosError)
            }
        }
    }

    return (
        <section className="auth" id="signup">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <form className="myform mx-auto" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Enter email : </label>
                                <input type="email" className="form-control mt-1" onChange={handleChange} placeholder="Enter email" name="email" />
                                <span>{errors.email}</span>
                            </div>
                            <div className="form-group mt-2">
                                <label htmlFor="password">Enter Password : </label>
                                <input type="password" className="form-control mt-1" onChange={handleChange} placeholder="Enter password" minLength={8} name="password" />
                                <span>{errors.password}</span>
                            </div>
                            <div>
                                <Link to="/signin"><b>Already have an account?</b></Link>
                            </div>
                            <div>
                                <Link to="/admin/signin"><b>Are you admin ?</b></Link>
                            </div>
                            <div className="text-center">
                                <button type="submit" className='cta'><b>Signup</b></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Signup
