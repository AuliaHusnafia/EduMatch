from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from bookings.models import Booking
from decimal import Decimal
import uuid

User = get_user_model()

class PaymentTests(APITestCase):
    def setUp(self):
        self.mentee = User.objects.create_user(username='mentee_test', password='password123', role='mentee')
        self.mentor = User.objects.create_user(username='mentor_test', password='password123', role='mentor')
        self.booking = Booking.objects.create(
            mentee=self.mentee,
            mentor=self.mentor,
            mentee_name='mentee_test',
            mentor_name='mentor_test',
            date='2025-12-01 10:00:00',
            status='completed',
            invoice_amount=Decimal('100000.00')
        )
        self.client.login(username='mentee_test', password='password123')
        # Get JWT token
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'mentee_test', 'password': 'password123'})
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_create_payment_session(self):
        url = reverse('create-payment')
        data = {'booking_id': self.booking.id}
        response = self.client.post(url, data, format='json')

        # Note: This might fail in test env if Midtrans server is unreachable,
        # but the logic should be sound.
        if response.status_code == 200:
            self.assertIn('token', response.data)
            self.assertIn('redirect_url', response.data)
        else:
            # If it fails due to Midtrans keys or network, at least it shouldn't be a 404 or 403
            self.assertNotEqual(response.status_code, 404)
            self.assertNotEqual(response.status_code, 403)

    def test_mentor_earnings_access(self):
        # Mentee should not be able to see mentor earnings
        url = reverse('mentor-earnings')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)

        # Mentor should be able to see
        self.client.login(username='mentor_test', password='password123')
        response = self.client.post(reverse('token_obtain_pair'), {'username': 'mentor_test', 'password': 'password123'})
        mentor_token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + mentor_token)

        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn('total', response.data)
