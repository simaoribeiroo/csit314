from django.shortcuts import render


class SPAFallbackMiddleware:
    """
    Middleware to fallback to index.html for non-API routes that don't exist.
    This allows React Router to handle client-side routing.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        response = self.get_response(request)
        
        # If 404 and not an API or static route, serve index.html for SPA routing
        if (response.status_code == 404 and 
            not request.path.startswith('/api/') and
            not request.path.startswith('/static/') and
            not request.path.startswith('/assets/')):
            return render(request, 'index.html')
        
        return response
