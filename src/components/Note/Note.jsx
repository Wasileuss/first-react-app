import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import ModalWind from "../Modal/ModalWind";
import "./note.css";
import bg from "../../assets/images/note-bg.webp";

function Note() {
	const [notes, setNotes] = useState(
		JSON.parse(localStorage.getItem("notes")) || []
	);

	useEffect(() => {
		localStorage.setItem("notes", JSON.stringify(notes));
	}, [notes]);

	function addNote() {
		const newNote = {
			id: nanoid(),
			color: getRandomColor(),
			text: "",
		};
		setNotes([...notes, newNote]);
	}

	const deleteNote = (index) => {
		const newNotes = [...notes];
		newNotes.splice(index, 1);
		setNotes(newNotes);
	};

	function getRandomColor() {
		const colors = [
            '#F0F8FF',
            '#FAFAD2',
            '#FFE4E1',
            '#98FB98',
            '#F0E68C',
            '#E0FFFF',
            '#FFDAB9',
            '#FFE4B5',
            '#FFFAF0'
		];
		const randomIndex = Math.floor(Math.random() * colors.length);
		return colors[randomIndex];
	}
    function adjustTextareaHeight(event, index) {
		const textarea = event.target;
		textarea.style.height = "auto";
		const computedHeight = Math.min(textarea.scrollHeight, 300);
		textarea.style.height = `${computedHeight}px`;

		const updatedNotes = [...notes];
		updatedNotes[index].text = textarea.value;
		setNotes(updatedNotes);
	}

    const clearAll = () => {
        setNotes([]);
    };

	return (
		<div className="note"  style={{ background: `url(${bg})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
				<div className="note__content">
					<h2 className="title  animate__animated animate__zoomInDown">Note</h2>
					<div className="note__enter">
						<button
							className="note__btn"
							onClick={() => addNote()}>
							New Note
						</button>
						<button
							className="note__btn note__btn--clear"
							onClick={() => clearAll()}>
							Clear All
						</button>
                        <div className="note__btn--modal">
                            <ModalWind onClick={clearAll} />
                        </div>
					</div>
				</div>
				<div className="notes">
					<div className="notes__title">
						<h3>Note List</h3>
					</div>
					{notes.length === 0 ? (
						<p className="notes__msg">
							No notes yet
						</p>
					) : (
						<div className="notes__list">
							{notes.map((note, index) => (
								<div
									key={index}
									className='notes__block'>
									<div className="notes__content" style={{backgroundColor: note.color}}>
										<div className="notes__btn">
                                            <button className="">Save</button>
											<button
												className="del-btn"
												onClick={() =>
													deleteNote(index)
												}>
												Delete
											</button>
										</div>
										<div className="notes__input">
											<textarea
                                                rows={5}
												value={note.text}
												onChange={(e) => {
													const updatedNotes = [
														...notes,
													];
													updatedNotes[index].text =
														e.target.value;
                                                        setNotes(updatedNotes);
                                                        adjustTextareaHeight(e, index
														);
												}}
												placeholder="Write your note here..."
												className="notes__textarea"
                                                style={{backgroundColor: note.color}}></textarea>
										</div>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
		</div>
	);
}

export default Note;