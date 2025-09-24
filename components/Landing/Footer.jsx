export default function Footer() {
	return (
		<footer className="border-t border-slate-200/60 py-8">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
				<p className="text-sm text-slate-600">© {new Date().getFullYear()} EcoChamps. All rights reserved.</p>
				<div className="flex items-center gap-3 text-sm text-slate-600">
					<a href="#features" className="hover:underline">Features</a>
					<a href="#how" className="hover:underline">How it works</a>
				</div>
			</div>
		</footer>
	);
}


