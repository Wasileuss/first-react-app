import React from "react";
import AddUser from "./AddUser";
import { IoCloseCircleSharp } from "react-icons/io5";
import { BiEditAlt } from "react-icons/bi";

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editForm: false
        }
    }
    user = this.props.user;
    render() {
        return (
            <div className="edit">
                <li className="edit__user">
                    <div className="edit__icons icon">
                        <IoCloseCircleSharp onClick={() => this.props.onDelete(this.user.id)} className="icon__delete" />
                        <BiEditAlt onClick={() => this.setState({editForm: !this.state.editForm})} className="icon__edit" />
                    </div>
                    <div className="edit__info">
                        <p className="edit__first-name">{this.user.first_name}
                        <span className="edit__last-name"> {this.user.last_name}</span>
                        </p>
                        
                        <p className="edit__phone">Phone: {this.user.phone}</p>
                        <p className="edit__email">Email: {this.user.email}</p>
                        {this.state.editForm && <AddUser onAdd={this.props.onEdit} user={this.user} />}
                    </div>
                </li>
            </div>
        );
    }
}

export default User;