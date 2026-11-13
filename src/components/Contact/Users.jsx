import React from "react";
import User from "./User";
import "./contact.css";
import 'animate.css';

class Users extends React.Component {
    render() {
        if(this.props.users.length > 0)
            return (
                <div>
                    <ul>
                        {this.props.users.map((el) => (
                            <User onEdit={this.props.onEdit} onDelete={this.props.onDelete} key={el.id} user={el} />
                        ))}
                    </ul>
                </div>
            );
        else
            return (
                <div>
                    <p className="contacts__msg animate__animated animate__hinge">No contacts found.</p>
                </div>
            );
    }
}

export default Users;