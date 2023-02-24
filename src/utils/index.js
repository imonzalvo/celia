export const isMercadoPagoOn = () => {
    return !!process.env.REACT_APP_PURCHASE_ENABLED
}