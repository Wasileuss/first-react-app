import { useState } from 'react';
import Modal from "./Modal";
import './modal.css';

export default function ModalWind () {
    const [modalState, setModalState] = useState(false);
    
    return (
        <div className="pop-up">
            <Modal call={modalState} onDestroy={() => setModalState(false)} />
            <button className="pop-up__btn" onClick={()=>setModalState(true)}>Delete</button>
        </div>
    )
}