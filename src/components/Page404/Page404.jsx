import React from 'react';
import bg from "../../assets/images/page-404.jpg";


import './page404.css';

function Page404() {
	return (
		<div className="err"  style={{ background: `url(${bg})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
			<h2 className="err__title title">
				Error 404
			</h2>
			<p className="err__text">
				Page not found
			</p>
		</div>
	);
}

export default Page404;