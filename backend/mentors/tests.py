from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User
from mentors.models import MentorProfile
from bookings.models import Booking

class MentorBookingsTests(APITestCase):
    def setUp(self):
        self.mentor_user = User.objects.create_user(username='mentor', password='password123', role='mentor', is_verified=True)
        self.mentor_profile = MentorProfile.objects.create(user=self.mentor_user, price_per_session=100000)
        self.mentee_user = User.objects.create_user(username='mentee', password='password123', role='mentee')

    def test_list_mentors(self):
        url = reverse('list-mentors')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if mentor is in the list
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['username'], 'mentor')

    def test_book_mentor(self):
        self.client.force_authenticate(user=self.mentee_user)
        # Add a slot first
        self.mentor_profile.available_slots = [{'id': 'slot1', 'date': '2025-12-01', 'time': '10:00'}]
        self.mentor_profile.save()

        url = reverse('book-mentor')
        data = {
            'mentor_id': self.mentor_user.id,
            'slot_id': 'slot1',
            'notes': 'Help me with Django'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Booking.objects.count(), 1)
        booking = Booking.objects.first()
        self.assertEqual(booking.mentor, self.mentor_user)
        self.assertEqual(booking.mentee, self.mentee_user)
        self.assertEqual(booking.invoice_amount, 100000)

    def test_mentor_respond_booking(self):
        booking = Booking.objects.create(
            mentee=self.mentee_user,
            mentor=self.mentor_user,
            mentee_name=self.mentee_user.username,
            mentor_name=self.mentor_user.username,
            date='2025-12-01 10:00:00',
            status='pending'
        )
        self.client.force_authenticate(user=self.mentor_user)
        url = reverse('mentor-respond-booking')
        data = {'booking_id': booking.id, 'action': 'accept'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        booking.refresh_from_db()
        self.assertEqual(booking.status, 'accepted')
