import React from 'react';
import bg from "../../assets/images/page-404.jpg";


import './page404.css';

function Page404() {
	return (
		<div className="error"  style={{ background: `url(${bg})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
			<h2 className="error__title title">
				Error 404
			</h2>
			<p className="error__text">
				Page not found
			</p>
		</div>
	);
}

export default Page404;