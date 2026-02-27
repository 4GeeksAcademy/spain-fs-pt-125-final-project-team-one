export const Footer = () => (
	<footer className="position-relative d-flex align-items-center justify-content-center py-3 bg-success text-warning text-gradient fs-5">
		<span className="text-center">
			<i className="bi bi-cpu text-warning"></i> Made by Iker, Khalid y Miguel
		</span>
		<span className="position-absolute end-0 me-5">
			{new Date().toLocaleString('es-ES', {
				day: '2-digit',
				month: 'long',
				year: 'numeric'
			})}
		</span>
	</footer>
);
