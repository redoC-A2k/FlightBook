import { useEffect, useState } from 'react'

function Signin() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    })
    const [errors, setErrors] = useState({
        username: "",
        password: ""
    })


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.checkValidity()) {
            setErrors({ ...errors, username: 'Only alphabets and "_" allowed ' })
        } else setErrors({ ...errors, username: '' })
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        if (errors.username === "" && formData.username !== "") {
            // dispatch(fetchUser(formData.username))
        } else if (formData.username === "") {
            setErrors({ ...errors, username: 'Username cannot be empty' })
        } else if (formData.password.length < 8) {
            setErrors({...errors, password: 'Password must be atleast 8 characters long'})
        } else if (formData.password === "") {
            setErrors({...errors, password: 'Password cannot be empty'})
        }
    }

    return (
        <section id="login">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <form className="myform mx-auto" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="username">Enter Username : </label>
                                <input type="text" className="form-control mt-1" onChange={handleChange} placeholder="Username" name="username" pattern="[A-Za-z_]*" />
                                <span>{errors.username}</span>
                            </div>
                            <div className="form-group mt-2">
                                <label htmlFor="password">Enter Password : </label>
                                <input type="password" className="form-control mt-1" onChange={handleChange} placeholder="Password" name="password" />
                                <span>{errors.password}</span>
                            </div>
                            <div className="text-center">
                                <button type="submit" className='cta'  >Signin  </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default Signin
