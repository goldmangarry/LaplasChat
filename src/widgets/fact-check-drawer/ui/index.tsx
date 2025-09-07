import { useTranslation } from "react-i18next";
import { ProviderIcon } from "@/components/shared/provider-icon";
import MarkdownRenderer from "@/components/ui/markdown-renderer";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { FactCheckDrawerProps } from "../types";
import { LinkCard } from "./components/link-card";

export const FactCheckDrawer = ({
	isOpen,
	onClose,
	factCheckMutation,
}: FactCheckDrawerProps) => {
	const { t } = useTranslation();

	const handleClose = () => {
		onClose();
	};

	return (
		<Sheet open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<SheetContent
				side="right"
				className="w-full sm:max-w-md p-0 flex flex-col"
				onOpenAutoFocus={(e) => e.preventDefault()}
			>
				<SheetHeader className="px-4 py-4">
					<SheetTitle className="text-2xl">{t("factCheck.title")}</SheetTitle>
				</SheetHeader>

				{/* Scrollable content */}
				<div className="flex-1 overflow-y-auto">
					{/* Model Info Block */}
					<div className="flex flex-col items-center justify-center pt-6">
						<div className="flex items-center justify-center w-14 h-14 rounded-full">
							<ProviderIcon provider="perplexity" className="w-14 h-14" />
						</div>

						<h3 className="text-center font-medium text-base leading-6 mt-2">
							{t("factCheck.modelName")}
						</h3>

						<p className="text-center font-normal text-base leading-6 text-muted-foreground px-2 mt-1">
							{t("factCheck.modelDescription")}
						</p>
					</div>

					<div className="px-4 pt-6 pb-4">
						{factCheckMutation.isPending && (
							<div className="flex items-center justify-center py-8">
								<div className="animate-spin w-6 h-6 border-2 border-muted border-t-foreground rounded-full"></div>
								<span className="ml-3 text-muted-foreground">
									{t("factCheck.checking")}
								</span>
							</div>
						)}

						{factCheckMutation.isError && (
							<div className="p-4 bg-red-50 rounded-lg">
								<p className="text-red-800 text-sm font-medium">
									{t("factCheck.error")}
								</p>
								<p className="text-red-600 text-sm mt-1">
									{factCheckMutation.error instanceof Error
										? factCheckMutation.error.message
										: t("factCheck.errorGeneric")}
								</p>
							</div>
						)}

						{factCheckMutation.data && (
							<div>
								{/* Response Section */}
								<h3 className="font-semibold text-card-foreground">
									{t("factCheck.response")}
								</h3>

								<div className="mt-3 rounded-lg">
									<div className="text-sm leading-relaxed">
										<MarkdownRenderer>
											{factCheckMutation.data.response}
										</MarkdownRenderer>
									</div>
								</div>

								{/* Divider */}
								<div className="py-6">
									<div className="h-px bg-border"></div>
								</div>

								{/* Annotations Section */}
								{factCheckMutation.data.annotations &&
									factCheckMutation.data.annotations.length > 0 && (
										<div>
											<h3 className="font-semibold">
												{t("factCheck.sources")}
											</h3>
											<div className="mt-3 space-y-3">
												{factCheckMutation.data.annotations.map((annotation, index) => (
													<LinkCard key={`${annotation.url}-${index}`} annotation={annotation} />
												))}
											</div>
										</div>
									)}
							</div>
						)}

						{!factCheckMutation.isPending &&
							!factCheckMutation.data &&
							!factCheckMutation.isError && (
								<div className="text-center py-8 text-muted-foreground">
									{t("factCheck.noData")}
								</div>
							)}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
};
