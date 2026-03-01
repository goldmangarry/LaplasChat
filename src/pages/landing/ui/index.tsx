import { Navbar } from "./components/navbar";
import { HeroSection } from "./components/hero-section";
import { WhyItMatters } from "./components/why-it-matters";
import { SecureModeDemo } from "./components/secure-mode-demo";
import { StatsBar } from "./components/stats-bar";
import { FeaturesGrid } from "./components/features-grid";
import { HowItWorks } from "./components/how-it-works";
import { FAQSection } from "./components/faq-section";
import { Footer } from "./components/footer";

export function LandingPage() {
	return (
		<div className="min-h-screen bg-white overflow-x-hidden">
			<Navbar />
			<HeroSection />
			<WhyItMatters />
			<SecureModeDemo />
			<StatsBar />
			<FeaturesGrid />
			<HowItWorks />
			<FAQSection />
			<Footer />
		</div>
	);
}
