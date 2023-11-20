import './modal.css';
import { SlClose } from "react-icons/sl";
// import { useState } from 'react';

export default function Modal ({call, onDestroy}) {

    if(!call) {
        return null;
    }

    const closeWnd = (event) => {
        if(event.target.className === 'modal') {
            onDestroy();
        }   
    }
    
    return (
        <div onClick={closeWnd} className="modal">
        {/* <div onClick={onDestroy} className="modal"> */}
            <div className="modal__content">
            {/* <div onClick={(event) => event.stopPropagation()} className="modal__content"> */}
                <h2 className='modal__title'>Delete All?</h2>
                <div className="modal__buttons">
                    <button className="modal__save">Yes</button>
                    <button onClick={onDestroy} className="modal__discard">Discard</button>
                </div>
                <SlClose className="modal__close" onClick={onDestroy} />
            </div>
        </div>
    )
}