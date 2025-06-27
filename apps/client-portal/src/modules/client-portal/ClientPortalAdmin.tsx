const handleClientPreview = (clientId: string) => {
  const previewUrl = `/client-preview?impersonateClientId=${clientId}`
  window.open(previewUrl, '_blank')

  toast({
    title: 'Preview Opened',
    description: `Opened preview for client ${clientId}`,
  })
}
