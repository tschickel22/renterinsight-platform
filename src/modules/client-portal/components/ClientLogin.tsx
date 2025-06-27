@@ .. @@
   // Check if this is a preview mode from admin
   React.useEffect(() => {
     const params = new URLSearchParams(window.location.search);
     const isPreview = params.get('preview') === 'true';
     const clientId = params.get('clientId');
     
     if (isPreview && clientId) {
       // In a real app, this would validate a special token
       // For this demo, we'll just simulate a successful login
       onLogin({
         id: clientId,
         name: 'Preview User',
         email: 'preview@example.com',
         isPreview: true
       });
     }
   }, [onLogin]);