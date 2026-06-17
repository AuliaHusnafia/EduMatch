from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import MentorProfile
from bookings.models import Booking
from users.models import User
import uuid


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def mentor_profile(request):
    user = request.user
    if user.role != 'mentor':
        return Response({'error': 'Anda bukan mentor'}, status=403)

    profile, _ = MentorProfile.objects.get_or_create(user=user)

    if request.method == 'GET':
        return Response({
            'skills': profile.skills,
            'price_per_session': profile.price_per_session,
            'bio': profile.bio,
            'education': profile.education,
            'available_slots': profile.available_slots or [],
        })

    profile.skills = request.data.get('skills', profile.skills)
    profile.price_per_session = request.data.get('price_per_session', profile.price_per_session)
    profile.bio = request.data.get('bio', profile.bio)
    profile.education = request.data.get('education', profile.education)
    profile.save()
    return Response({'message': 'Profil berhasil diperbarui'})


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def mentor_available_slots(request):
    user = request.user
    if user.role != 'mentor':
        return Response({'error': 'Anda bukan mentor'}, status=403)

    profile, _ = MentorProfile.objects.get_or_create(user=user)

    if request.method == 'GET':
        return Response(profile.available_slots or [])

    date = request.data.get('date')
    time = request.data.get('time')
    if not date or not time:
        return Response({'error': 'Tanggal dan waktu harus diisi'}, status=400)

    if not profile.available_slots:
        profile.available_slots = []

    new_slot = {'id': str(uuid.uuid4()), 'date': date, 'time': time}
    profile.available_slots.append(new_slot)
    profile.save()
    return Response({'message': 'Jadwal berhasil ditambahkan', 'slot': new_slot})


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def mentor_delete_slot(request, slot_id):
    user = request.user
    if user.role != 'mentor':
        return Response({'error': 'Anda bukan mentor'}, status=403)

    profile, _ = MentorProfile.objects.get_or_create(user=user)
    if profile.available_slots:
        profile.available_slots = [s for s in profile.available_slots if s.get('id') != slot_id]
        profile.save()
    return Response({'message': 'Jadwal berhasil dihapus'})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mentor_booking_requests(request):
    user = request.user
    if user.role != 'mentor':
        return Response({'error': 'Anda bukan mentor'}, status=403)

    bookings = Booking.objects.filter(
        mentor=user, status='pending'
    ).order_by('-created_at')

    return Response([{
        'id': b.id,
        'mentee_name': b.mentee_name,
        'date': b.date,
        'notes': b.notes,
        'status': b.status,
    } for b in bookings])


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mentor_respond_booking(request):
    user = request.user
    if user.role != 'mentor':
        return Response({'error': 'Anda bukan mentor'}, status=403)

    booking_id = request.data.get('booking_id')
    action = request.data.get('action')

    try:
        booking = Booking.objects.get(id=booking_id, mentor=user)
        if action == 'accept':
            booking.status = 'accepted'
            booking.save()
            return Response({'message': 'Booking diterima'})
        elif action == 'reject':
            booking.status = 'rejected'
            booking.save()
            return Response({'message': 'Booking ditolak'})
        return Response({'error': 'Action tidak valid'}, status=400)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking tidak ditemukan'}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mentor_active_sessions(request):
    user = request.user
    if user.role != 'mentor':
        return Response({'error': 'Anda bukan mentor'}, status=403)

    # FIX: include 'completed' dan 'paid' agar riwayat muncul
    bookings = Booking.objects.filter(
        mentor=user,
        status__in=['accepted', 'ongoing', 'completed', 'paid']
    ).order_by('-date')

    return Response([{
        'id': b.id,
        'mentee_name': b.mentee_name,
        'date': b.date,
        'notes': b.notes,
        'status': b.status,
        'meeting_link': b.meeting_link,
        'invoice_amount': float(b.invoice_amount),
    } for b in bookings])


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mentor_start_session(request):
    """Mentor memulai sesi dan membuat meeting link"""
    user = request.user
    print(f"Start session - User: {user.username}, Role: {user.role}")  # Debug
    
    # Cek role - HARUS mentor
    if user.role != 'mentor':
        return Response(
            {'error': f'Anda bukan mentor. Role Anda: {user.role}'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    booking_id = request.data.get('booking_id')
    meeting_link = request.data.get('meeting_link')
    
    if not booking_id:
        return Response({'error': 'Booking ID harus diisi'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        booking = Booking.objects.get(id=booking_id, mentor=user, status='accepted')
        
        if meeting_link:
            booking.meeting_link = meeting_link
        else:
            # Generate default Google Meet link
            import uuid
            booking.meeting_link = f"https://meet.google.com/edm-{str(uuid.uuid4())[:8]}"
        
        booking.status = 'ongoing'
        booking.save()
        
        return Response({
            'message': 'Sesi dimulai!',
            'meeting_link': booking.meeting_link,
            'booking_id': booking.id
        })
        
    except Booking.DoesNotExist:
        return Response({'error': 'Booking tidak ditemukan atau belum diterima'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mentor_complete_session(request):
    """Mentor menyelesaikan sesi"""
    user = request.user
    print(f"Complete session - User: {user.username}, Role: {user.role}")
    
    # Cek role - HARUS mentor
    if user.role != 'mentor':
        return Response(
            {'error': f'Anda bukan mentor. Role Anda: {user.role}'}, 
            status=status.HTTP_403_FORBIDDEN
        )
    
    booking_id = request.data.get('booking_id')
    
    if not booking_id:
        return Response({'error': 'Booking ID harus diisi'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        booking = Booking.objects.get(id=booking_id, mentor=user)
        
        if booking.status == 'ongoing':
            booking.status = 'completed'
            booking.save()
            return Response({'message': 'Sesi selesai! Pendapatan akan masuk ke saldo Anda.'})
        elif booking.status == 'completed':
            return Response({'message': 'Sesi sudah selesai sebelumnya.'})
        else:
            return Response({'error': f'Sesi tidak dapat diselesaikan. Status saat ini: {booking.status}'}, status=400)
            
    except Booking.DoesNotExist:
        return Response({'error': 'Booking tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mentor_reviews(request):
    user = request.user
    if user.role != 'mentor':
        return Response({'error': 'Anda bukan mentor'}, status=403)

    from reviews.models import Review
    reviews = Review.objects.filter(mentor=user).order_by('-created_at')
    return Response([{
        'id': r.id, 'mentee_name': r.mentee_name,
        'rating': r.rating, 'comment': r.comment,
        'created_at': r.created_at.strftime('%d %b %Y'),
    } for r in reviews])


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mentor_income(request):
    user = request.user
    if user.role != 'mentor':
        return Response({'error': 'Akses ditolak'}, status=403)

    from payments.models import Payment, WithdrawalRequest
    from django.db.models import Sum
    from decimal import Decimal

    paid_payments = Payment.objects.filter(booking__mentor=user, status='success')
    total_revenue = sum(Decimal(str(p.mentor_revenue)) for p in paid_payments)

    total_withdrawn = WithdrawalRequest.objects.filter(
        mentor=user, status='approved'
    ).aggregate(total=Sum('net_amount'))['total'] or Decimal('0')

    unpaid_count = Booking.objects.filter(mentor=user, status='completed').count()

    return Response({
        'total':           int(total_revenue),
        'available':       int(total_revenue - total_withdrawn),
        'withdrawn':       int(total_withdrawn),
        'unpaid_sessions': unpaid_count,
        'pending':         0,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mentor_withdraw(request):
    user = request.user
    if user.role != 'mentor':
        return Response({'error': 'Anda bukan mentor'}, status=403)

    from payments.views import request_withdrawal
    return request_withdrawal(request)