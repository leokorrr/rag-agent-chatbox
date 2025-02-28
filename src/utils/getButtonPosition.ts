export const getButtonPosition = (buttonPosition: string) => {
  switch (buttonPosition) {
    case 'bottom-left':
      return 'left-4 bottom-4'
    case 'top-right':
      return 'right-4 top-4'
    case 'top-left':
      return 'left-4 top-4'
    default:
      return 'right-4 bottom-4'
  }
}
