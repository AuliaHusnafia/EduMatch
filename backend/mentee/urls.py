from django.urls import path
from . import views

urlpatterns = [
    path('mentors/', views.list_mentors, name='list-mentors'),
    path('mentors/<int:mentor_id>/', views.mentor_detail, name='mentor-detail'),
    path('book/', views.book_mentor, name='book-mentor'),
    path('my-bookings/', views.my_bookings, name='my-bookings'),
    path('ongoing-sessions/', views.mentee_ongoing_sessions, name='mentee-ongoing-sessions'),
    path('completed-sessions/', views.mentee_completed_sessions, name='mentee-completed-sessions'),
    path('pay-booking/<int:booking_id>/', views.pay_booking, name='pay-booking'),  # ← Perhatikan ini
]