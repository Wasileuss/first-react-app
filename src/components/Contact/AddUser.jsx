// import React from "react";

// class AddUser extends React.Component {
//     userAdd = {}
//     constructor(props) {
//         super(props);
//         this.state = {
//             firs_tname: "",
//             last_name: "",
//             phone: "",
//             email: ""
//         }
//     }
//     render() {
//         return (
//             <div className="contact">
//                 <form className="contact__form" ref={(el) => this.myForm = el}>
//                 <input 
//                     className="contact__input" 
//                     placeholder="First Name" 
//                     onChange={(e) => this.setState({first_name: e.target.value})} />
//                 <input className="contact__input" placeholder="Last Name" 
//                 onChange={(e) => this.setState({last_name: e.target.value})} />
//                 <input className="contact__input" placeholder="Phone" 
//                 onChange={(e) => this.setState({phone: e.target.value})} />
//                 <input className="contact__input" placeholder="Email" 
//                 onChange={(e) => this.setState({email: e.target.value})} />
//                 <button className="contact__button" type="button" onClick = { () => {
//                         this.userAdd = this.state;
//                         if(this.props.user)
//                             this.userAdd.id = this.props.user.id
//                         this.props.onAdd(this.userAdd);
//                         this.myForm.reset();
//                     }}>Add Contact</button>
//             </form>
//             </div>
//         );
//     }
// }

// export default AddUser;


// import React from "react";

// class AddUser extends React.Component {
//     userAdd = {}
//     constructor(props) {
//         super(props);
//         this.state = {
//             first_name: "",
//             last_name: "",
//             phone: "",
//             email: ""
//         }
//     }

//     handleAddUser = () => {
//         // Перевірка на порожні поля
//         if (!this.state.first_name || !this.state.last_name || !this.state.phone || !this.state.email) {
//             alert("Please fill in all fields");
//             return;
//         }

//         this.userAdd = this.state;
//         if (this.props.user)
//             this.userAdd.id = this.props.user.id;

//         this.props.onAdd(this.userAdd);
//         this.myForm.reset();
//     }

//     render() {
//         return (
//             <div className="contact">
//                 <form className="contact__form" ref={(el) => this.myForm = el}>
//                     <input 
//                         className="contact__input" 
//                         placeholder="First Name" 
//                         onChange={(e) => this.setState({first_name: e.target.value})} />
//                     <input 
//                         className="contact__input" 
//                         placeholder="Last Name" 
//                         onChange={(e) => this.setState({last_name: e.target.value})} />
//                     <input 
//                         className="contact__input" 
//                         placeholder="Phone" 
//                         onChange={(e) => this.setState({phone: e.target.value})} />
//                     <input 
//                         className="contact__input" 
//                         placeholder="Email" 
//                         onChange={(e) => this.setState({email: e.target.value})} />
//                     <button 
//                         className="contact__button" 
//                         type="button" 
//                         onClick={this.handleAddUser}>
//                         Add Contact
//                     </button>
//                 </form>
//             </div>
//         );
//     }
// }

// export default AddUser;


// import React from "react";

// class AddUser extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             first_name: "",
//             last_name: "",
//             phone: "",
//             email: ""
//         }

//         this.userAdd = {};
//     }

//     handleAddUser = () => {
//         // Перевірка на порожні поля
//         if (!this.state.first_name || !this.state.last_name || !this.state.phone || !this.state.email) {
//             alert("Please fill in all fields");
//             return;
//         }

//         this.setState((prevState) => {
//             this.userAdd = { ...prevState }; // Копіюємо значення з попереднього стану
//             if (this.props.user)
//                 this.userAdd.id = this.props.user.id;

//             this.props.onAdd(this.userAdd);
//             return {
//                 first_name: "",
//                 last_name: "",
//                 phone: "",
//                 email: ""
//             };
//         });
//     }

//     render() {
//         return (
//             <div className="contact">
//                 <form className="contact__form" ref={(el) => this.myForm = el}>
//                     <input
//                         className="contact__input"
//                         placeholder="First Name"
//                         value={this.state.first_name}
//                         onChange={(e) => this.setState({ first_name: e.target.value })} />
//                     <input
//                         className="contact__input"
//                         placeholder="Last Name"
//                         value={this.state.last_name}
//                         onChange={(e) => this.setState({ last_name: e.target.value })} />
//                     <input
//                         className="contact__input"
//                         placeholder="Phone"
//                         value={this.state.phone}
//                         onChange={(e) => this.setState({ phone: e.target.value })} />
//                     <input
//                         className="contact__input"
//                         placeholder="Email"
//                         value={this.state.email}
//                         onChange={(e) => this.setState({ email: e.target.value })} />
//                     <button
//                         className="contact__button"
//                         type="submit"
//                         onClick={this.handleAddUser}>
//                         Add Contact
//                     </button>
//                 </form>
//             </div>
//         );
//     }
// }

// export default AddUser;


import React from "react";

class AddUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
            errors: {
                first_name: "",
                last_name: "",
                phone: "",
                email: ""
            }
        }

        this.userAdd = {};
    }

    handleAddUser = () => {
        // Перевірка на порожні поля
        const errors = {};
        let hasErrors = false;

        if (!this.state.first_name) {
            errors.first_name = "First Name is required";
            hasErrors = true;
        }

        if (!this.state.last_name) {
            errors.last_name = "Last Name is required";
            hasErrors = true;
        }

        if (!this.state.phone) {
            errors.phone = "Phone is required";
            hasErrors = true;
        }

        if (!this.state.email) {
            errors.email = "Email is required";
            hasErrors = true;
        }

        if (hasErrors) {
            this.setState({ errors });
            return;
        }

        this.setState((prevState) => {
            this.userAdd = { ...prevState }; // Копіюємо значення з попереднього стану
            if (this.props.user)
                this.userAdd.id = this.props.user.id;

            this.props.onAdd(this.userAdd);
            return {
                first_name: "",
                last_name: "",
                phone: "",
                email: "",
                errors: {
                    first_name: "",
                    last_name: "",
                    phone: "",
                    email: ""
                }
            };
        });
    }

    render() {
        return (
            <div className="contact">
                <form className="contact__form" ref={(el) => this.myForm = el}>
                    <input
                        className="contact__input"
                        type="text"
                        placeholder="First Name"
                        value={this.state.first_name}
                        onChange={(e) => this.setState({ first_name: e.target.value })}
                    />
                    {this.state.errors.first_name && <p className="error-message">{this.state.errors.first_name}</p>}

                    <input
                        className="contact__input"
                        type="text"
                        placeholder="Last Name"
                        value={this.state.last_name}
                        onChange={(e) => this.setState({ last_name: e.target.value })}
                    />
                    {this.state.errors.last_name && <p className="error-message">{this.state.errors.last_name}</p>}

                    <input
                        className="contact__input"
                        type="number"
                        placeholder="Phone"
                        value={this.state.phone}
                        onChange={(e) => this.setState({ phone: e.target.value })}
                    />
                    {this.state.errors.phone && <p className="error-message">{this.state.errors.phone}</p>}

                    <input
                        className="contact__input"
                        type="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={(e) => this.setState({ email: e.target.value })}
                    />
                    {this.state.errors.email && <p className="error-message">{this.state.errors.email}</p>}

                    <button
                        className="contact__button"
                        type="button"
                        onClick={this.handleAddUser}
                    >
                        Add Contact
                    </button>
                </form>
            </div>
        );
    }
}

export default AddUser;