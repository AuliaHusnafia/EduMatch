from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/admin/', include('admin_dashboard.urls')),
    path('api/mentor/', include('mentors.urls')),
    path('api/mentee/', include('mentee.urls')),
    path('api/payments/', include('payments.urls')),
]