/* eslint-disable no-underscore-dangle */
// eslint-disable-next-line
/// <reference lib="dom" />

/* istanbul ignore next */
(function(socket: any) {
	const MSG_EVENT = 'wpackio:message';
	const CLEAR_EVENT = 'wpackio:clear';

	const style = `
#wpackio-socket-message {
	position: fixed;
	width: 100%;
	background: white;
	bottom: 0;
	z-index: 999999;
	border: 2px solid black;
	overflow: auto;
	color: #333;
}
	`;
	const styleElm = document.createElement('style');
	styleElm.innerHTML = style;
	document.head.appendChild(styleElm);

	const elem = document.createElement('div');
	const body = document.body;

	socket.on(MSG_EVENT, (data: any) => {
		elem.innerHTML = `${data.msg}`;
		body.appendChild(elem);
	});

	socket.on(CLEAR_EVENT, () => {
		if (elem.parentNode) {
			body.removeChild(elem);
		}
	});
})((window as any).___browserSync___.socket);
