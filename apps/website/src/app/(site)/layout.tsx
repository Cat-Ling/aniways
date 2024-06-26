import type { ReactNode } from "react";

import { RefetchOnWindowFocus } from "./refetch-on-window-focus";

interface SiteLayoutProps {
	children: ReactNode;
}

const SiteLayout = ({ children }: SiteLayoutProps) => {
	return (
		<main className="container mx-auto h-full min-h-full px-3 pt-6 md:container">
			{children}
			<RefetchOnWindowFocus />
		</main>
	);
};

export default SiteLayout;
