from django.urls import path
from .views import (
    AdminStatsView, 
    PendingMentorsView, 
    AllMentorsView, 
    AllMenteesView,
    AllBookingsView,
    AllPaymentsView,
    WithdrawRequestsView,
    TransactionsView
)

urlpatterns = [
    path('stats/', AdminStatsView.as_view()),
    path('pending-mentors/', PendingMentorsView.as_view()),
    path('all-mentors/', AllMentorsView.as_view()),
    path('mentors/', AllMentorsView.as_view()),
    path('mentors/<int:user_id>/', AllMentorsView.as_view()),
    path('all-mentees/', AllMenteesView.as_view()),
    path('mentees/', AllMenteesView.as_view()),
    path('mentees/<int:user_id>/', AllMenteesView.as_view()),
    path('bookings/', AllBookingsView.as_view()),
    path('payments/', AllPaymentsView.as_view()),
    path('withdraw-requests/', WithdrawRequestsView.as_view()),
    path('transactions/', TransactionsView.as_view()),
]