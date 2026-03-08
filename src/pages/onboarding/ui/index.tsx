import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useTranslation } from "react-i18next"
import { Eye, EyeOff, KeyRound, Shield, ChevronDown, ChevronUp, Sparkles, Check, Download, Loader2, Circle, HardDrive, Cpu, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useApiKeyStore, DEFAULT_OLLAMA_BASE_URL } from "@/core/api-key"
import { checkOllamaHealth, listOllamaModels, pullOllamaModel, deleteOllamaModel } from "@/core/ollama"
import { RECOMMENDED_MODELS, DEFAULT_OLLAMA_MODEL, formatBytes, getOllamaDownloadUrl, getOllamaPlatformLabel } from "@/core/ollama/types"
import type { OllamaModel, PullProgress } from "@/core/ollama/types"

export function OnboardingPage() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const {
		setApiKey,
		ollamaModel,
		setOllamaModel,
		setOpenaiApiKey,
		setAnthropicApiKey,
		setGoogleApiKey,
		ollamaBaseUrl,
		setOllamaBaseUrl,
		ollamaApiKey,
		setOllamaApiKey,
	} = useApiKeyStore()
	const [key, setKey] = useState("")
	const [showKey, setShowKey] = useState(false)
	const [error, setError] = useState("")
	const [showSecureMode, setShowSecureMode] = useState(false)
	const [showDirectKeys, setShowDirectKeys] = useState(false)

	// Direct provider keys
	const [openaiKey, setOpenaiKey] = useState("")
	const [anthropicKey, setAnthropicKey] = useState("")
	const [googleKey, setGoogleKey] = useState("")

	// Ollama state
	const [ollamaConnected, setOllamaConnected] = useState(false)
	const [ollamaChecking, setOllamaChecking] = useState(false)
	const [installedModels, setInstalledModels] = useState<OllamaModel[]>([])
	const [selectedModel, setSelectedModel] = useState(ollamaModel || DEFAULT_OLLAMA_MODEL)
	const [pullingModel, setPullingModel] = useState<string | null>(null)
	const [pullState, setPullState] = useState<PullProgress | null>(null)
	const [deletingModel, setDeletingModel] = useState<string | null>(null)
	const [ollamaUrl, setOllamaUrl] = useState(ollamaBaseUrl)
	const [ollamaKey, setOllamaKey] = useState(ollamaApiKey || "")

	const checkOllama = useCallback(async () => {
		setOllamaChecking(true)
		try {
			const healthy = await checkOllamaHealth()
			setOllamaConnected(healthy)
			if (healthy) {
				const models = await listOllamaModels()
				setInstalledModels(models)
			}
		} catch {
			setOllamaConnected(false)
		} finally {
			setOllamaChecking(false)
		}
	}, [])

	useEffect(() => {
		if (showSecureMode) {
			checkOllama()
		}
	}, [showSecureMode, checkOllama])

	const isModelInstalled = (modelId: string) => {
		return installedModels.some(m =>
			m.name === modelId ||
			m.name === `${modelId}:latest` ||
			m.name.startsWith(`${modelId}:`)
		)
	}

	const getInstalledSize = (modelId: string) => {
		const found = installedModels.find(m =>
			m.name === modelId ||
			m.name === `${modelId}:latest` ||
			m.name.startsWith(`${modelId}:`)
		)
		return found?.size || 0
	}

	const handlePullModel = async (modelId: string) => {
		setPullingModel(modelId)
		setPullState({ status: t("ollama.downloading"), completedBytes: 0, totalBytes: 0, percent: 0 })
		try {
			await pullOllamaModel(modelId, (progress) => {
				setPullState(progress)
			})
			const models = await listOllamaModels()
			setInstalledModels(models)
			setSelectedModel(modelId)
			setOllamaModel(modelId)
		} catch (err) {
			console.error("Failed to pull model:", err)
		} finally {
			setPullingModel(null)
			setPullState(null)
		}
	}

	const handleDeleteModel = async (modelId: string) => {
		setDeletingModel(modelId)
		try {
			await deleteOllamaModel(modelId)
			const models = await listOllamaModels()
			setInstalledModels(models)
			if (selectedModel === modelId) {
				setSelectedModel(DEFAULT_OLLAMA_MODEL)
				setOllamaModel(DEFAULT_OLLAMA_MODEL)
			}
		} catch (err) {
			console.error("Failed to delete model:", err)
		} finally {
			setDeletingModel(null)
		}
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const trimmedKey = key.trim()

		if (!trimmedKey) {
			setError(t("onboarding.invalidKey"))
			return
		}

		setApiKey(trimmedKey)

		if (openaiKey.trim()) setOpenaiApiKey(openaiKey.trim())
		if (anthropicKey.trim()) setAnthropicApiKey(anthropicKey.trim())
		if (googleKey.trim()) setGoogleApiKey(googleKey.trim())

		if (selectedModel !== ollamaModel) {
			setOllamaModel(selectedModel)
		}

		navigate({ to: "/" })
	}

	return (
		<div className="flex min-h-screen items-center justify-center p-4" style={{
			background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(108,86,240,0.08) 0%, transparent 70%)"
		}}>
			<div className="w-full max-w-xl">
				{/* Logo & Branding */}
				<div className="text-center mb-8">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#6c56f0]/10">
						<Sparkles className="h-8 w-8 text-[#6c56f0]" />
					</div>
					<h1 className="text-3xl font-bold tracking-tight">{t("onboarding.title")}</h1>
					<p className="text-muted-foreground mt-2">{t("onboarding.subtitle")}</p>
				</div>

				<Card className="border-border/50 shadow-lg">
					<form onSubmit={handleSubmit}>
						<CardHeader className="pb-4">
							<p className="text-sm text-muted-foreground">{t("onboarding.description")}</p>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* OpenRouter API Key (Primary) */}
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<KeyRound className="h-4 w-4 text-[#6c56f0]" />
									<Label htmlFor="api-key" className="font-medium">{t("onboarding.apiKeyLabel")}</Label>
									<span className="text-xs bg-[#6c56f0]/10 text-[#6c56f0] px-2 py-0.5 rounded-full font-medium">
										{t("onboarding.recommended")}
									</span>
								</div>
								<div className="relative">
									<Input
										id="api-key"
										type={showKey ? "text" : "password"}
										placeholder={t("onboarding.apiKeyPlaceholder")}
										value={key}
										onChange={(e) => {
											setKey(e.target.value)
											setError("")
										}}
										className="pr-10"
									/>
									<button
										type="button"
										onClick={() => setShowKey(!showKey)}
										className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
									>
										{showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
									</button>
								</div>
								{error && <p className="text-sm text-destructive">{error}</p>}
								<a
									href="https://openrouter.ai/keys"
									target="_blank"
									rel="noopener noreferrer"
									className="inline-block text-sm text-[#6c56f0] underline hover:text-[#6c56f0]/80"
								>
									{t("onboarding.getKey")}
								</a>
							</div>

							{/* Direct Provider Keys (Optional) */}
							<div className="space-y-2">
								<button
									type="button"
									onClick={() => setShowDirectKeys(!showDirectKeys)}
									className="flex w-full items-center gap-2 rounded-md border border-input px-3 py-2 text-sm text-left hover:bg-accent/50 transition-colors"
								>
									<KeyRound className="h-4 w-4 text-muted-foreground" />
									<span className="flex-1 font-medium">{t("onboarding.directKeysTitle")}</span>
									{showDirectKeys ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
								</button>

								{showDirectKeys && (
									<div className="space-y-4 pt-2 pl-2 border-l-2 border-border ml-2">
										<p className="text-xs text-muted-foreground">{t("onboarding.directKeysDescription")}</p>

										<div className="space-y-1.5">
											<Label htmlFor="openai-key" className="text-sm">{t("onboarding.openaiKeyLabel")}</Label>
											<Input id="openai-key" type="password" placeholder={t("onboarding.openaiKeyPlaceholder")} value={openaiKey} onChange={(e) => setOpenaiKey(e.target.value)} />
											<a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-[#6c56f0] underline">{t("onboarding.getOpenaiKey")}</a>
										</div>

										<div className="space-y-1.5">
											<Label htmlFor="anthropic-key" className="text-sm">{t("onboarding.anthropicKeyLabel")}</Label>
											<Input id="anthropic-key" type="password" placeholder={t("onboarding.anthropicKeyPlaceholder")} value={anthropicKey} onChange={(e) => setAnthropicKey(e.target.value)} />
											<a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-[#6c56f0] underline">{t("onboarding.getAnthropicKey")}</a>
										</div>

										<div className="space-y-1.5">
											<Label htmlFor="google-key" className="text-sm">{t("onboarding.googleKeyLabel")}</Label>
											<Input id="google-key" type="password" placeholder={t("onboarding.googleKeyPlaceholder")} value={googleKey} onChange={(e) => setGoogleKey(e.target.value)} />
											<a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer" className="inline-block text-xs text-[#6c56f0] underline">{t("onboarding.getGoogleKey")}</a>
										</div>
									</div>
								)}
							</div>

							{/* Secure Mode — Ollama Setup */}
							<div className="space-y-2">
								<button
									type="button"
									onClick={() => setShowSecureMode(!showSecureMode)}
									className="flex w-full items-center gap-2 rounded-md border border-input px-3 py-2 text-sm text-left hover:bg-accent/50 transition-colors"
								>
									<Shield className="h-4 w-4 text-muted-foreground" />
									<span className="flex-1 font-medium">{t("onboarding.secureModeTitle")}</span>
									{showSecureMode ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
								</button>

								{showSecureMode && (
									<div className="space-y-4 pt-2 pl-2 border-l-2 border-border ml-2">
										<p className="text-xs text-muted-foreground">
											{t("onboarding.secureModeDescription")}
										</p>

										{/* Ollama URL */}
										<div className="space-y-1.5">
											<Label htmlFor="ollama-url-onboarding" className="text-sm">{t("ollama.serverUrl")}</Label>
											<div className="flex gap-2">
												<Input
													id="ollama-url-onboarding"
													type="text"
													placeholder={DEFAULT_OLLAMA_BASE_URL}
													value={ollamaUrl}
													onChange={(e) => setOllamaUrl(e.target.value)}
													className="flex-1 font-mono text-xs"
												/>
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() => {
														setOllamaBaseUrl(ollamaUrl)
														setOllamaApiKey(ollamaKey)
														checkOllama()
													}}
													disabled={ollamaUrl === ollamaBaseUrl && ollamaKey === (ollamaApiKey || "")}
													className="h-9"
												>
													{t("ollama.apply")}
												</Button>
											</div>
											{ollamaUrl !== DEFAULT_OLLAMA_BASE_URL && (
												<button
													type="button"
													onClick={() => {
														setOllamaUrl(DEFAULT_OLLAMA_BASE_URL)
														setOllamaBaseUrl(DEFAULT_OLLAMA_BASE_URL)
														setOllamaKey("")
														setOllamaApiKey("")
														checkOllama()
													}}
													className="text-xs text-muted-foreground underline hover:text-foreground"
												>
													{t("ollama.resetUrl")}
												</button>
											)}
											<Input
												id="ollama-api-key-onboarding"
												type="password"
												placeholder={t("ollama.apiKeyPlaceholder")}
												value={ollamaKey}
												onChange={(e) => setOllamaKey(e.target.value)}
												className="font-mono text-xs"
											/>
											<p className="text-[11px] text-muted-foreground">{t("ollama.apiKeyHint")}</p>
										</div>

										{/* Ollama Status */}
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												{ollamaChecking ? (
													<Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
												) : ollamaConnected ? (
													<Circle className="h-3 w-3 fill-green-500 text-green-500" />
												) : (
													<Circle className="h-3 w-3 fill-red-500 text-red-500" />
												)}
												<span className="text-sm font-medium">
													{ollamaConnected ? t("ollama.connected") : t("ollama.notDetected")}
												</span>
											</div>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												onClick={checkOllama}
												className="text-xs h-7"
												disabled={ollamaChecking}
											>
												{ollamaChecking ? <Loader2 className="h-3 w-3 animate-spin" /> : t("ollama.refresh")}
											</Button>
										</div>

										{/* Install Ollama CTA */}
										{!ollamaConnected && !ollamaChecking && (
											<div className="rounded-lg border border-dashed border-border p-4 text-center space-y-3">
												<p className="text-sm text-muted-foreground">{t("ollama.installHint")}</p>
												<Button
													type="button"
													variant="outline"
													size="sm"
													className="gap-2"
													asChild
												>
													<a href={getOllamaDownloadUrl()} download>
														<Download className="h-4 w-4" />
														{t("ollama.downloadOllama")}
														{getOllamaPlatformLabel() && (
															<span className="text-muted-foreground">({getOllamaPlatformLabel()})</span>
														)}
													</a>
												</Button>
												<p className="text-[11px] text-muted-foreground">{t("ollama.installSteps")}</p>
											</div>
										)}

										{/* Model Cards */}
										{ollamaConnected && (
											<div className="space-y-3">
												<Label className="text-sm font-medium">{t("ollama.selectModel")}</Label>

												<div className="space-y-2">
													{RECOMMENDED_MODELS.map((model) => {
														const installed = isModelInstalled(model.id)
														const isPulling = pullingModel === model.id
														const isSelected = selectedModel === model.id
														const isDeleting = deletingModel === model.id
														const installedSize = getInstalledSize(model.id)

														return (
															<div
																key={model.id}
																className={`rounded-lg border transition-colors ${
																	isSelected && installed
																		? "border-[#6c56f0] bg-[#6c56f0]/5"
																		: "border-border hover:bg-accent/20"
																} ${installed ? "cursor-pointer" : ""}`}
																onClick={() => {
																	if (installed && !isPulling && !isDeleting) {
																		setSelectedModel(model.id)
																		setOllamaModel(model.id)
																	}
																}}
															>
																<div className="flex items-center gap-3 p-3">
																	{/* Model info */}
																	<div className="flex-1 min-w-0">
																		<div className="flex items-center gap-2 flex-wrap">
																			<span className="text-sm font-semibold">{model.name}</span>
																			<span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">{model.params}</span>
																		</div>
																		<p className="text-xs text-muted-foreground mt-0.5">{model.description}</p>
																		<div className="flex items-center gap-3 mt-1.5">
																			<span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
																				<HardDrive className="h-3 w-3" />
																				{installed ? formatBytes(installedSize) : formatBytes(model.sizeBytes)}
																			</span>
																			<span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
																				<Cpu className="h-3 w-3" />
																				{model.params}
																			</span>
																		</div>
																	</div>

																	{/* Actions */}
																	<div className="flex-shrink-0 flex items-center gap-1.5">
																		{isPulling ? (
																			<div className="w-28" />
																		) : installed ? (
																			<>
																				<div className="flex items-center gap-1 text-green-600 mr-1">
																					<Check className="h-4 w-4" />
																					<span className="text-xs">{t("ollama.installed")}</span>
																				</div>
																				<Button
																					type="button"
																					variant="ghost"
																					size="icon"
																					className="h-7 w-7 text-muted-foreground hover:text-destructive"
																					onClick={(e) => {
																						e.stopPropagation()
																						handleDeleteModel(model.id)
																					}}
																					disabled={isDeleting || pullingModel !== null}
																				>
																					{isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
																				</Button>
																			</>
																		) : (
																			<Button
																				type="button"
																				variant="outline"
																				size="sm"
																				className="h-8 text-xs gap-1.5"
																				onClick={(e) => {
																					e.stopPropagation()
																					handlePullModel(model.id)
																				}}
																				disabled={pullingModel !== null}
																			>
																				<Download className="h-3.5 w-3.5" />
																				{t("ollama.downloadModel")}
																				<span className="text-muted-foreground">({formatBytes(model.sizeBytes)})</span>
																			</Button>
																		)}
																	</div>
																</div>

																{/* Download progress bar */}
																{isPulling && pullState && (
																	<div className="px-3 pb-3">
																		<div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1">
																			<span>{pullState.status}</span>
																			<span>
																				{pullState.totalBytes > 0
																					? `${formatBytes(pullState.completedBytes)} / ${formatBytes(pullState.totalBytes)} — ${pullState.percent}%`
																					: t("ollama.downloading")
																				}
																			</span>
																		</div>
																		<div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
																			<div
																				className="h-full bg-[#6c56f0] rounded-full transition-all duration-300"
																				style={{ width: `${pullState.percent}%` }}
																			/>
																		</div>
																	</div>
																)}
															</div>
														)
													})}
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						</CardContent>
						<CardFooter>
							<Button type="submit" className="w-full bg-[#6c56f0] hover:bg-[#5b46e0]" disabled={!key.trim()}>
								{t("onboarding.start")}
							</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</div>
	)
}
