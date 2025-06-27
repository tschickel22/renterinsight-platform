@@ .. @@
 
   // Check if this is a preview mode from admin
   React.useEffect(() => {
-    const params = new URLSearchParams(window.location.search);
-    const isPreview = params.get('preview') === 'true';
-    const clientId = params.get('clientId');
+    const searchParams = new URLSearchParams(window.location.search);
+    const isPreview = searchParams.get('preview') === 'true';
+    const clientId = searchParams.get('clientId');
     
     if (isPreview && clientId) {
-      // In a real app, this would validate a special token
-      // For this demo, we'll just simulate a successful login
-      onLogin({
-        id: clientId,
-        name: 'Preview User',
-        email: 'preview@example.com',
-        isPreview: true
-      });
+      // Get client account from the client portal accounts
+      const { getClientAccount } = useClientPortalAccounts();
+      const clientAccount = getClientAccount(clientId);
+      
+      if (clientAccount) {
+        onLogin({
+          id: clientAccount.id,
+          name: clientAccount.name,
+          email: clientAccount.email,
+          phone: clientAccount.phone,
+          isPreview: true
+        });
+      } else {
+        // Fallback to a preview user if client account not found
+        onLogin({
+          id: clientId,
+          name: 'Preview User',
+          email: 'preview@example.com',
+          isPreview: true
+        });
+      }
     }
   }, [onLogin]);