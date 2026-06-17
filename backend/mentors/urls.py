from django.urls import path
from . import views

urlpatterns = [
    path('profile/', views.mentor_profile, name='mentor-profile'),
    path('available-slots/', views.mentor_available_slots, name='mentor-available-slots'),
    path('available-slots/<str:slot_id>/', views.mentor_delete_slot, name='mentor-delete-slot'),
    path('booking-requests/', views.mentor_booking_requests, name='mentor-booking-requests'),
    path('respond-booking/', views.mentor_respond_booking, name='mentor-respond-booking'),
    path('active-sessions/', views.mentor_active_sessions, name='mentor-active-sessions'),
    path('start-session/', views.mentor_start_session, name='mentor-start-session'),
    path('complete-session/', views.mentor_complete_session, name='mentor-complete-session'),
    path('reviews/', views.mentor_reviews, name='mentor-reviews'),
    path('income/', views.mentor_income, name='mentor-income'),
    path('withdraw/', views.mentor_withdraw, name='mentor-withdraw'),
]