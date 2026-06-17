from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.models import User
from bookings.models import Booking
from mentors.models import MentorProfile
from django.db.models import Sum, Count, Q
from rest_framework import status
from datetime import datetime

class AdminStatsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        
        total_mentees = User.objects.filter(role='mentee').count()
        total_mentors = User.objects.filter(role='mentor', is_verified=True).count()
        pending_mentors = User.objects.filter(role='mentor', is_verified=False).count()
        total_users = User.objects.exclude(role='admin').count()
        total_bookings = Booking.objects.count()
        completed_sessions = Booking.objects.filter(status='completed').count()
        paid_sessions = Booking.objects.filter(status='paid').count()
        platform_commission = Booking.objects.filter(status='paid').count() * 7500  # 10% dari 75.000
        
        data = {
            'total_mentees': total_mentees,
            'total_mentors': total_mentors,
            'pending_mentors': pending_mentors,
            'total_users': total_users,
            'total_bookings': total_bookings,
            'completed_sessions': completed_sessions,
            'paid_sessions': paid_sessions,
            'platform_commission': platform_commission,
        }
        return Response(data)


class PendingMentorsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        
        pending = User.objects.filter(role='mentor', is_verified=False)
        data = [{
            'id': u.id, 
            'username': u.username, 
            'email': u.email, 
            'university': u.university or '',
            'phone': u.phone or '',
            'date_joined': u.date_joined.strftime('%Y-%m-%d')
        } for u in pending]
        return Response(data)
    
    def post(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        
        mentor_id = request.data.get('mentor_id')
        action = request.data.get('action')
        
        try:
            mentor = User.objects.get(id=mentor_id, role='mentor')
            if action == 'approve':
                mentor.is_verified = True
                mentor.save()
                return Response({'message': f'Mentor {mentor.username} telah disetujui'})
            elif action == 'reject':
                mentor.delete()
                return Response({'message': f'Mentor {mentor.username} ditolak'})
        except User.DoesNotExist:
            return Response({'error': 'Mentor tidak ditemukan'}, status=404)
        
        return Response({'error': 'Action tidak valid'}, status=400)


class AllMentorsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        
        mentors = User.objects.filter(role='mentor', is_verified=True)
        data = [{
            'id': u.id, 
            'username': u.username, 
            'email': u.email, 
            'university': u.university or '',
            'phone': u.phone or '',
            'date_joined': u.date_joined.strftime('%Y-%m-%d')
        } for u in mentors]
        return Response(data)
    
    def post(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password', 'mentor123')
        university = request.data.get('university', '')
        phone = request.data.get('phone', '')
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username sudah ada'}, status=400)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email sudah terdaftar'}, status=400)
        
        from django.contrib.auth.hashers import make_password
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            role='mentor',
            university=university,
            phone=phone,
            is_verified=True
        )
        
        # Buat profil mentor
        MentorProfile.objects.create(user=user)
        
        return Response({'message': 'Mentor berhasil ditambahkan', 'id': user.id})
    
    def put(self, request, user_id):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(id=user_id, role='mentor')
            user.username = request.data.get('username', user.username)
            user.email = request.data.get('email', user.email)
            user.university = request.data.get('university', user.university)
            user.phone = request.data.get('phone', user.phone)
            if request.data.get('password'):
                from django.contrib.auth.hashers import make_password
                user.password = make_password(request.data.get('password'))
            user.save()
            return Response({'message': 'Mentor berhasil diupdate'})
        except User.DoesNotExist:
            return Response({'error': 'Mentor tidak ditemukan'}, status=404)
    
    def delete(self, request, user_id):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(id=user_id, role='mentor')
            user.delete()
            return Response({'message': 'Mentor berhasil dihapus'})
        except User.DoesNotExist:
            return Response({'error': 'Mentor tidak ditemukan'}, status=404)


class AllMenteesView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        
        mentees = User.objects.filter(role='mentee')
        data = [{
            'id': u.id, 
            'username': u.username, 
            'email': u.email, 
            'university': u.university or '',
            'phone': u.phone or '',
            'date_joined': u.date_joined.strftime('%Y-%m-%d')
        } for u in mentees]
        return Response(data)
    
    def post(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password', 'mentee123')
        university = request.data.get('university', '')
        phone = request.data.get('phone', '')
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username sudah ada'}, status=400)
        
        if User.objects.filter(email=email).exists():
            return Response({'error': 'Email sudah terdaftar'}, status=400)
        
        from django.contrib.auth.hashers import make_password
        user = User.objects.create(
            username=username,
            email=email,
            password=make_password(password),
            role='mentee',
            university=university,
            phone=phone
        )
        
        return Response({'message': 'Mentee berhasil ditambahkan', 'id': user.id})
    
    def put(self, request, user_id):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(id=user_id, role='mentee')
            user.username = request.data.get('username', user.username)
            user.email = request.data.get('email', user.email)
            user.university = request.data.get('university', user.university)
            user.phone = request.data.get('phone', user.phone)
            if request.data.get('password'):
                from django.contrib.auth.hashers import make_password
                user.password = make_password(request.data.get('password'))
            user.save()
            return Response({'message': 'Mentee berhasil diupdate'})
        except User.DoesNotExist:
            return Response({'error': 'Mentee tidak ditemukan'}, status=404)
    
    def delete(self, request, user_id):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            user = User.objects.get(id=user_id, role='mentee')
            user.delete()
            return Response({'message': 'Mentee berhasil dihapus'})
        except User.DoesNotExist:
            return Response({'error': 'Mentee tidak ditemukan'}, status=404)


class AllBookingsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        
        bookings = Booking.objects.all().order_by('-created_at')
        data = [{
            'id': b.id,
            'mentee_name': b.mentee_name,
            'mentor_name': b.mentor_name,
            'date': b.date,
            'status': b.status,
            'invoice_amount': 75000,
            'payment_status': 'paid' if b.status == 'paid' else ('pending' if b.status == 'completed' else '-')
        } for b in bookings]
        return Response(data)


class AllPaymentsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        
        paid_bookings = Booking.objects.filter(status='paid').order_by('-updated_at')
        data = []
        for idx, b in enumerate(paid_bookings):
            data.append({
                'id': b.id,
                'order_id': f"EDM-{b.id}-{str(b.id).upper()[:8]}",
                'mentee_name': b.mentee_name,
                'mentor_name': b.mentor_name,
                'amount': 75000,
                'platform_fee': 7500,
                'mentor_revenue': 67500,
                'status': 'success',
                'paid_at': b.updated_at
            })
        return Response(data)


class WithdrawRequestsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        
        # Data dummy untuk withdraw requests
        data = []
        return Response(data)
    
    def post(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        return Response({'message': 'OK'})


class TransactionsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
        
        paid_bookings = Booking.objects.filter(status='paid').order_by('-updated_at')
        data = []
        for idx, b in enumerate(paid_bookings):
            data.append({
                'order_id': f"EDM-{b.id}-{str(b.id).upper()[:8]}",
                'mentee': b.mentee_name,
                'mentor': b.mentor_name,
                'nominal': 75000,
                'komisi': 7500,
                'mentor_dapat': 67500,
                'status': 'Berhasil',
                'waktu': b.updated_at.strftime('%d/%m/%y, %H.%M') if b.updated_at else '-'
            })
        return Response(data)