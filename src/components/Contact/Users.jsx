import React from "react";
import User from "./User";

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
                    <p className="contacts__msg">No contacts found.</p>
                </div>
            );
    }
}

export default Users;