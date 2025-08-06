import { Tooltip as ChakraTooltip, Portal } from "@chakra-ui/react"
import * as React from "react"

export interface TooltipProps extends ChakraTooltip.RootProps {
  showArrow?: boolean
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement>
  content: React.ReactNode
  contentProps?: ChakraTooltip.ContentProps
  disabled?: boolean
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow,
      children,
      disabled,
      portalled = true,
      content,
      contentProps,
      portalRef,
      ...rest
    } = props

    if (disabled) return children

    return (
      <ChakraTooltip.Root {...rest}>
        <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
        <Portal disabled={!portalled} container={portalRef}>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content ref={ref} {...contentProps}>
              {showArrow && (
                <ChakraTooltip.Arrow>
                  <ChakraTooltip.ArrowTip />
                </ChakraTooltip.Arrow>
              )}
              {content}
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    )
  },
)

export interface ClickTooltipProps extends Omit<ChakraTooltip.RootProps, 'open' | 'onOpenChange'> {
  showArrow?: boolean
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement>
  content: React.ReactNode
  contentProps?: ChakraTooltip.ContentProps
  disabled?: boolean
  interactive?: boolean
}

export const ClickTooltip = React.forwardRef<HTMLDivElement, ClickTooltipProps>(
  function ClickTooltip(props, ref) {
    const {
      showArrow,
      children,
      disabled,
      portalled = true,
      content,
      contentProps,
      portalRef,
      ...rest
    } = props

    const [isOpen, setIsOpen] = React.useState(false)

    // Обработчик клика на триггере
    const handleTriggerClick = React.useCallback((e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsOpen(prev => !prev)
    }, [])


    // Обработчик клика вне области tooltip
    React.useEffect(() => {
      if (!isOpen) return

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Element
        
        // Проверяем, что клик не по триггеру и не по контенту tooltip
        const tooltipContent = document.querySelector('[data-scope="tooltip"][data-part="content"]')
        const tooltipPositioner = document.querySelector('[data-scope="tooltip"][data-part="positioner"]')
        const trigger = document.querySelector('[data-scope="tooltip"][data-part="trigger"]')
        
        if (
          target &&
          !tooltipContent?.contains(target) &&
          !tooltipPositioner?.contains(target) &&
          !trigger?.contains(target)
        ) {
          setIsOpen(false)
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [isOpen])

    // Клонируем children и добавляем обработчик клика
    const childElement = children as React.ReactElement<Record<string, unknown>>
    const triggerElement = React.cloneElement(childElement, {
      onClick: handleTriggerClick,
      style: { 
        cursor: 'pointer',
        ...(childElement.props?.style as Record<string, unknown> || {})
      }
    })

    if (disabled) return children

    return (
      <ChakraTooltip.Root 
        open={isOpen} 
        onOpenChange={({ open }) => setIsOpen(open)}
        openDelay={999999}
        closeDelay={999999}
        {...rest}
      >
        <ChakraTooltip.Trigger asChild>
          {triggerElement}
        </ChakraTooltip.Trigger>
        <Portal disabled={!portalled} container={portalRef}>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content ref={ref} {...contentProps}>
              {showArrow && (
                <ChakraTooltip.Arrow>
                  <ChakraTooltip.ArrowTip />
                </ChakraTooltip.Arrow>
              )}
              {content}
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    )
  },
)