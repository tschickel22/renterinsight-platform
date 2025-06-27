@@ .. @@
   const handleClientPreview = (clientId: string) => {
   }
    const previewUrl = `/client-preview?impersonateClientId=${clientId}`
-    const previewUrl = `/client-portal?impersonateClientId=${clientId}`
+    // Create a preview URL with the client ID that points to the actual client portal component
+    const previewUrl = `/client-portal/?impersonateClientId=${clientId}`
     window.open(previewUrl, '_blank')
     
     toast({
     }
     )
@@ .. @@