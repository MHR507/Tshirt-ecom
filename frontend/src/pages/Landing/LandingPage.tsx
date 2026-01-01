import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard, { Product } from "../../components/ProductCard";
import TryOnModal from "../TryOn/TryOnModal";
import { getToken, logout } from "../../services/authService";

const SAMPLE_PRODUCTS: Product[] = [
	{
		id: "p1",
		title: "Mono Logo Tee",
		price: "$34",
		image: "/assets/products/tee-1.jpg",
		tags: ["Minimal", "Unisex"],
	},
	{
		id: "p2",
		title: "Vintage Script Tee",
		price: "$39",
		image: "/assets/products/tee-2.jpg",
		tags: ["Vintage", "Soft Cotton"],
	},
	{
		id: "p3",
		title: "Abstract Print Tee",
		price: "$42",
		image: "/assets/products/tee-3.jpg",
		tags: ["Art", "Limited"],
	},
	{
		id: "p4",
		title: "Signature Pocket Tee",
		price: "$36",
		image: "/assets/products/tee-4.jpg",
		tags: ["Classic", "Fit"],
	},
];

export default function LandingPage() {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [selected, setSelected] = useState<Product | null>(null);
	const [tryOnOpen, setTryOnOpen] = useState(false);
	const token = getToken(); // check if user is logged in

	const filtered = useMemo(
		() =>
			SAMPLE_PRODUCTS.filter(
				(p) =>
					p.title.toLowerCase().includes(query.toLowerCase()) ||
					(p.tags || [])
						.join(" ")
						.toLowerCase()
						.includes(query.toLowerCase())
			),
		[query]
	);

	function openTryOn(p: Product) {
		if (!token) {
			navigate("/auth");
			return;
		}
		setSelected(p);
		setTryOnOpen(true);
	}

	function viewProduct(p: Product) {
		navigate(`/product/${p.id}`);
	}

	function handleLogout() {
		logout();
		window.location.reload();
	}

	return (
		<main className="min-h-screen bg-white text-black">
			{/* Header with login/logout */}
			<header className="border-b border-black/10 sticky top-0 bg-white z-40">
				<div className="container mx-auto px-6 py-4 flex items-center justify-between">
					<h1 className="text-2xl font-bold">T‑Shirt Studio</h1>
					<nav className="flex items-center gap-4">
						<button
							onClick={() => navigate("/shop")}
							className="text-sm font-medium hover:text-black/60"
						>
							Shop
						</button>
						<button
							onClick={() => navigate("/about")}
							className="text-sm font-medium hover:text-black/60"
						>
							About
						</button>
						<button
							onClick={() => navigate("/cart")}
							className="text-sm font-medium hover:text-black/60"
						>
							Cart
						</button>
						{token ? (
							<button
								onClick={handleLogout}
								className="text-sm font-semibold px-4 py-2 rounded-lg border border-black/20 hover:bg-black hover:text-white transition"
							>
								Logout
							</button>
						) : (
							<button
								onClick={() => navigate("/auth")}
								className="text-sm font-semibold px-4 py-2 bg-black text-white rounded-lg hover:shadow-lg transition"
							>
								Sign in
							</button>
						)}
					</nav>
				</div>
			</header>

			{/* Hero section */}
			<section className="py-12 px-6">
				<div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
					<div>
						<h2 className="text-4xl font-bold leading-tight">
							Discover premium T‑shirt designs — try them on with AI.
						</h2>
						<p className="mt-4 text-lg text-black/70 max-w-xl">
							Black typography · White canvas · Clean minimal experience. Browse
							curated designs from our community of designers and preview how they
							look on you using our AI Try‑On.
						</p>

						<div className="mt-6 flex gap-3">
							<button
								onClick={() => {
									if (!token) navigate("/auth");
									else setTryOnOpen(true);
								}}
								className="bg-black text-white rounded-lg px-5 py-3 font-semibold shadow-lg hover:shadow-xl transition"
							>
								Launch AI Try‑On
							</button>
							<button
								onClick={() => navigate("/shop")}
								className="border border-black rounded-lg px-5 py-3 font-semibold hover:bg-black/5 transition"
							>
								Explore Designs
							</button>
						</div>
					</div>

					<div className="rounded-xl border border-black/10 p-4">
						<div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
							<img
								src="/assets/hero/valorfit2.png"
								alt="Hero tee"
								className="object-cover w-full h-full"
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Search / Filters */}
			<section className="py-8 px-6 border-t border-black/10">
				<div className="container mx-auto">
					<div className="flex items-center justify-between gap-4">
						<label className="flex-1">
							<input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search designs, tags, or designers"
								className="w-full border border-black/10 rounded-lg px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-black/80"
								aria-label="Search designs"
							/>
						</label>

						<div className="hidden md:flex gap-3">
							{["All", "Minimal", "Vintage", "Art"].map((tag) => (
								<button
									key={tag}
									className="px-4 py-2 border border-black/10 rounded-lg text-sm font-medium hover:bg-black hover:text-white transition"
								>
									{tag}
								</button>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* Product Grid */}
			<section className="py-12 px-6">
				<div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{filtered.map((p) => (
						<ProductCard
							key={p.id}
							product={p}
							onTryOn={openTryOn}
							onView={viewProduct}
						/>
					))}
				</div>
			</section>

			{/* TryOn modal */}
			<TryOnModal
				open={tryOnOpen}
				onClose={() => {
					setTryOnOpen(false);
					setSelected(null);
				}}
				product={selected}
			/>
		</main>
	);
}