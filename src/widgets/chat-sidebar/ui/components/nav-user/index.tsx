"use client"

import { useState, useEffect, useCallback } from "react"
import {
  ChevronsUpDown,
  KeyRound,
  Settings,
  Shield,
  Circle,
  Check,
  Download,
  Loader2,
  HardDrive,
  Cpu,
  Trash2,
} from "lucide-react"
import { useTranslation } from "react-i18next"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/shared/theme-toggle"
import { useApiKeyStore } from "@/core/api-key"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { checkOllamaHealth, listOllamaModels, pullOllamaModel, deleteOllamaModel } from "@/core/ollama"
import { RECOMMENDED_MODELS, DEFAULT_OLLAMA_MODEL, formatBytes, getOllamaDownloadUrl, getOllamaPlatformLabel } from "@/core/ollama/types"
import type { OllamaModel, PullProgress } from "@/core/ollama/types"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { t } = useTranslation()
  const { apiKey, setApiKey, clearApiKey, ollamaModel, setOllamaModel } = useApiKeyStore()
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false)
  const [isOllamaModalOpen, setIsOllamaModalOpen] = useState(false)
  const [newApiKey, setNewApiKey] = useState("")

  // Ollama state
  const [ollamaConnected, setOllamaConnected] = useState(false)
  const [ollamaChecking, setOllamaChecking] = useState(false)
  const [installedModels, setInstalledModels] = useState<OllamaModel[]>([])
  const [selectedModel, setSelectedModel] = useState(ollamaModel || DEFAULT_OLLAMA_MODEL)
  const [pullingModel, setPullingModel] = useState<string | null>(null)
  const [pullState, setPullState] = useState<PullProgress | null>(null)
  const [deletingModel, setDeletingModel] = useState<string | null>(null)

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
    if (isOllamaModalOpen) {
      checkOllama()
    }
  }, [isOllamaModalOpen, checkOllama])

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

  const handleSaveApiKey = () => {
    if (newApiKey.trim()) {
      setApiKey(newApiKey.trim())
      setIsApiKeyModalOpen(false)
      setNewApiKey("")
    }
  }

  const handleOpenApiKeyModal = () => {
    setNewApiKey(apiKey || "")
    setIsApiKeyModalOpen(true)
  }

  const handleOpenOllamaModal = () => {
    setSelectedModel(ollamaModel || DEFAULT_OLLAMA_MODEL)
    setIsOllamaModalOpen(true)
  }

  const handleSaveOllamaModel = () => {
    setOllamaModel(selectedModel)
    setIsOllamaModalOpen(false)
  }

  const maskedKey = apiKey
    ? `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`
    : ""

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0eeff] dark:bg-[#6c56f0]/15 text-[#6c56f0] dark:text-[#a78bfa]">
                  <Settings className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{t('common.settings')}</span>
                  {maskedKey && (
                    <span className="truncate text-xs text-muted-foreground">{maskedKey}</span>
                  )}
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#f0eeff] dark:bg-[#6c56f0]/15 text-[#6c56f0] dark:text-[#a78bfa]">
                    <Settings className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">LaplasChat</span>
                    {maskedKey && (
                      <span className="truncate text-xs text-muted-foreground">{maskedKey}</span>
                    )}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <ThemeToggle />
                <DropdownMenuItem onClick={handleOpenApiKeyModal}>
                  <KeyRound />
                  {t('common.apiKey')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleOpenOllamaModal}>
                  <Shield />
                  {t('ollama.selectModel')}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* API Key Dialog */}
      <Dialog open={isApiKeyModalOpen} onOpenChange={setIsApiKeyModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('onboarding.apiKeyLabel')}</DialogTitle>
            <DialogDescription>
              {t('onboarding.description')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="api-key">{t('onboarding.apiKeyLabel')}</Label>
              <Input
                id="api-key"
                type="password"
                placeholder={t('onboarding.apiKeyPlaceholder')}
                value={newApiKey}
                onChange={(e) => setNewApiKey(e.target.value)}
              />
            </div>
            <a
              href="https://openrouter.ai/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline"
            >
              {t('onboarding.getKey')}
            </a>
          </div>
          <DialogFooter className="gap-2">
            {apiKey && (
              <Button
                variant="destructive"
                onClick={() => {
                  clearApiKey()
                  setIsApiKeyModalOpen(false)
                  window.location.href = "/onboarding"
                }}
              >
                {t('onboarding.removeKey')}
              </Button>
            )}
            <Button onClick={handleSaveApiKey} disabled={!newApiKey.trim()}>
              {t('onboarding.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ollama Model Selector Dialog */}
      <Dialog open={isOllamaModalOpen} onOpenChange={setIsOllamaModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t('ollama.selectModel')}</DialogTitle>
            <DialogDescription>
              {t('ollama.modelHint')}
            </DialogDescription>
          </DialogHeader>

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

          {/* Model List */}
          {ollamaConnected && (
            <div className="space-y-2 max-h-80 overflow-y-auto">
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
                        ? "border-primary bg-primary/5"
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
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${pullState.percent}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleSaveOllamaModel}>
              {t('onboarding.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
