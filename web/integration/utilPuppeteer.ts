type ClickDiv = {
  page: any
  text: string
  element: string
  rightClick?: boolean
  index?: number
}

interface NodeAction extends ClickDiv {
  childText: string
}

/**
 * Util class for working with dom (finding visible elements)
 *
 * Design decision: Avoiding optional types to reduce complexity.
 * Props like element and childText are not optional by design.
 *
 */
export default class UtilPuppeteer {
  public async clickDiv({
    page,
    text,
    rightClick,
    element,
    index = 0,
  }: ClickDiv) {
    const linkHandlers = await page.$x(this.xpathEquals(text, element))
    await this.waitFor(page, text, element)
    if (linkHandlers.length > 0) {
      if (rightClick) {
        await linkHandlers[index].click({ button: 'right' })
      } else {
        await linkHandlers[index].click()
      }
    }
  }

  public async waitFor(page: any, text: string, element: string = 'div') {
    try {
      await page.waitForXPath(this.xpathEquals(text, element), {
        timeout: 2000,
        visible: true,
      })
    } catch (e) {
      console.warn(`element is not visible ${text}`)
    }
  }

  async clickButton({ page, text }: any) {
    const buttonHandlers = await page.$x(this.xpathEquals(text, 'button'))
    if (buttonHandlers.length > 0) {
      buttonHandlers[0].click()
    }
  }

  public async closeNode(props: NodeAction) {
    const isOpen = await this.isVisible(
      props.page,
      props.childText,
      props.element
    )
    if (isOpen) {
      await this.clickDiv(props)
    }
  }

  public async openNode(props: NodeAction) {
    const isOpen = await this.isVisible(
      props.page,
      props.childText,
      props.element
    )
    if (!isOpen) {
      await this.clickDiv(props)
    }
  }

  // test util
  public async isVisible(page: any, text: string, element: string) {
    try {
      await page.waitForXPath(this.xpathEquals(text, element), {
        timeout: 5000,
        visible: true,
      })
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * Find element based on text equals and element
   *
   * @param text
   * @param element div|span|button
   */
  private xpathEquals(text: string, element: string) {
    return `//${element}[text() = '${text}']`
  }
}
