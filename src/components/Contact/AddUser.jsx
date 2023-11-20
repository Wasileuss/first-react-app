import React from "react";

class AddUser extends React.Component {
    userAdd = {}
    constructor(props) {
        super(props);
        this.state = {
            firs_tname: "",
            last_name: "",
            phone: "",
            email: ""
        }
    }
    render() {
        return (
            <div className="contact">
                <form className="contact__form" ref={(el) => this.myForm = el}>
                <input className="contact__input" placeholder="First Name" onChange={(e) => this.setState({first_name: e.target.value})} />
                <input className="contact__input" placeholder="Last Name" onChange={(e) => this.setState({last_name: e.target.value})} />
                <input className="contact__input" placeholder="Phone" onChange={(e) => this.setState({phone: e.target.value})} />
                <input className="contact__input" placeholder="Email" onChange={(e) => this.setState({email: e.target.value})} />
                <button className="contact__button" type="button" onClick = { () => {
                        this.userAdd = this.state;
                        if(this.props.user)
                            this.userAdd.id = this.props.user.id
                        this.props.onAdd(this.userAdd);
                        this.myForm.reset();
                    }}>Add Contact</button>
            </form>
            </div>
        );
    }
}

export default AddUser;