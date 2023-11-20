import React from 'react';
import Users from './Users';
import AddUser from './AddUser';
import './contact.css';
import bg from "../../assets/images/contact-bg.webp";


class Contacts extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: JSON.parse(localStorage.getItem('users') || '[]')
        }
        this.addUser = this.addUser.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
        this.editUser = this.editUser.bind(this);
    }

    render() {
        return (
            <div className='contacts' style={{ background: `url(${bg})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                <h2 className="title  animate__animated animate__zoomInDown">Contacts</h2>
                <div className='contacts__content users'>
                    <div className='users__list'>
                        <Users users={this.state.users} onEdit={this.editUser} onDelete={this.deleteUser} />
                    </div>
                    <div className='users__add'>
                        <AddUser onAdd={this.addUser} />
                    </div>
                </div>
            </div>
        );
    }

    deleteUser(id) {
        this.setState({
            users: this.state.users.filter(el => el.id !== id)
        }, () => {
            localStorage.setItem('users', JSON.stringify(this.state.users));
        })
    }

    editUser(user) {
        let allUsers = this.state.users;
        allUsers[user.id - 1] = user;

        this.setState({ users: [] }, () => {
            this.setState({ users: [...allUsers] }, () => {
                localStorage.setItem('users', JSON.stringify(this.state.users));
            });
        })
    }

    addUser(user) {
        const id = this.state.users.length + 1;
        this.setState({
            users: [...this.state.users, {id, ...user}]
        }, () => {
            localStorage.setItem('users', JSON.stringify(this.state.users));
        })
    }
}

export default Contacts;