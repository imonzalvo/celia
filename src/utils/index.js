export const isMercadoPagoOn = () => {
    return !!process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY
}