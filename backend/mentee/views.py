from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from users.models import User
from mentors.models import MentorProfile
from bookings.models import Booking
from datetime import datetime


@api_view(['GET'])
def list_mentors(request):
    mentors = User.objects.filter(role='mentor', is_verified=True)
    result = []
    for mentor in mentors:
        profile, _ = MentorProfile.objects.get_or_create(user=mentor)
        result.append({
            'id': mentor.id,
            'username': mentor.username,
            'email': mentor.email,
            'university': mentor.university or '',
            'skills': profile.skills or '',
            'price_per_session': profile.price_per_session,
            'bio': profile.bio or '',
            'education': profile.education or '',
            'available_slots': profile.available_slots or [],
            'rating': 0,
        })
    return Response(result)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mentor_detail(request, mentor_id):
    try:
        mentor = User.objects.get(id=mentor_id, role='mentor', is_verified=True)
    except User.DoesNotExist:
        return Response({'error': 'Mentor tidak ditemukan'}, status=404)

    profile, _ = MentorProfile.objects.get_or_create(user=mentor)

    available_slots = []
    today = datetime.now().date()
    for slot in profile.available_slots or []:
        try:
            slot_date = datetime.strptime(slot.get('date', ''), '%Y-%m-%d').date()
            if slot_date >= today:
                available_slots.append(slot)
        except Exception:
            available_slots.append(slot)

    return Response({
        'id': mentor.id,
        'username': mentor.username,
        'email': mentor.email,
        'university': mentor.university or '',
        'skills': profile.skills or '',
        'price_per_session': profile.price_per_session,
        'bio': profile.bio or '',
        'education': profile.education or '',
        'available_slots': available_slots,
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_mentor(request):
    """Membuat booking ke mentor"""
    try:
        user = request.user
        print(f"=== BOOKING REQUEST ===")
        print(f"User: {user.username}, Role: {user.role}")
        
        # Cek role - HARUS mentee
        if user.role != 'mentee':
            return Response(
                {'error': f'Hanya mentee yang bisa booking. Role kamu: {user.role}. Silakan login sebagai mentee.'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        mentee = user
        mentor_id = request.data.get('mentor_id')
        slot_id = request.data.get('slot_id')
        notes = request.data.get('notes', '')
        
        if not mentor_id or not slot_id:
            return Response({'error': 'Mentor ID dan slot ID harus diisi'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            mentor = User.objects.get(id=mentor_id, role='mentor', is_verified=True)
        except User.DoesNotExist:
            return Response({'error': 'Mentor tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)
        
        # Ambil detail slot dari profil mentor
        from mentors.models import MentorProfile
        profile, created = MentorProfile.objects.get_or_create(user=mentor)
        
        selected_slot = None
        for slot in profile.available_slots or []:
            if str(slot.get('id')) == str(slot_id):
                selected_slot = slot
                break
        
        if not selected_slot:
            return Response({'error': 'Slot jadwal tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)
        
        # Buat booking
        from bookings.models import Booking
        from datetime import datetime
        
        date_str = f"{selected_slot.get('date')} {selected_slot.get('time')}"
        try:
            booking_date = datetime.strptime(date_str, '%Y-%m-%d %H:%M')
        except:
            booking_date = datetime.now()
        
        booking = Booking.objects.create(
            mentee=mentee,
            mentor=mentor,
            mentee_name=mentee.username,
            mentor_name=mentor.username,
            date=booking_date,
            notes=notes,
            status='pending'
        )
        
        return Response({
            'message': 'Booking berhasil dibuat',
            'booking_id': booking.id,
            'status': booking.status,
            'date': booking.date
        })
        
    except Exception as e:
        print(f"Error in book_mentor: {str(e)}")
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    user = request.user
    if user.role != 'mentee':
        return Response({'error': 'Akses ditolak'}, status=403)

    bookings = Booking.objects.filter(mentee=user).order_by('-created_at')

    result = []
    for b in bookings:
        # Cek payment status
        payment_status = None
        try:
            from payments.models import Payment
            p = Payment.objects.get(booking=b)
            payment_status = p.status
        except Exception:
            pass

        result.append({
            'id':             b.id,
            'mentor_name':    b.mentor_name,
            'date':           b.date,
            'notes':          b.notes,
            'status':         b.status,
            'status_display': b.get_status_display(),
            'meeting_link':   b.meeting_link,
            'invoice_amount': float(b.invoice_amount),
            'payment_status': payment_status,
            'created_at':     b.created_at,
        })
    return Response(result)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mentee_ongoing_sessions(request):
    user = request.user
    if user.role != 'mentee':
        return Response({'error': 'Akses ditolak'}, status=403)

    # FIX: accepted + ongoing
    bookings = Booking.objects.filter(
        mentee=user,
        status__in=['accepted', 'ongoing']
    ).order_by('date')

    return Response([{
        'id':           b.id,
        'mentor_name':  b.mentor_name,
        'date':         b.date,
        'status':       b.status,
        'status_display': b.get_status_display(),
        'meeting_link': b.meeting_link,
        'notes':        b.notes,
    } for b in bookings])


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mentee_completed_sessions(request):
    """Mendapatkan sesi yang sudah selesai untuk mentee"""
    user = request.user
    print(f"=== COMPLETED SESSIONS ===")
    print(f"User: {user.username}")
    
    if user.role != 'mentee':
        return Response({'error': 'Akses ditolak'}, status=status.HTTP_403_FORBIDDEN)
    
    # Ambil booking yang sudah completed ATAU paid
    from bookings.models import Booking
    bookings = Booking.objects.filter(
        mentee=user,
        status__in=['completed', 'paid']
    ).order_by('-date')
    
    print(f"Found {bookings.count()} completed/paid sessions")
    
    result = []
    for booking in bookings:
        result.append({
            'id': booking.id,
            'mentor_name': booking.mentor_name,
            'date': booking.date,
            'notes': booking.notes,
            'status': booking.status,  # 'completed' atau 'paid'
            'price': 75000,
            'invoice_amount': 75000
        })
    
    return Response(result)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def pay_booking(request, booking_id):
    """Membayar booking"""
    user = request.user
    print(f"=== PAY BOOKING ===")
    print(f"User: {user.username}, Role: {user.role}")
    print(f"Booking ID: {booking_id}")
    
    if user.role != 'mentee':
        return Response({'error': 'Hanya mentee yang bisa membayar'}, status=status.HTTP_403_FORBIDDEN)
    
    try:
        booking = Booking.objects.get(id=booking_id, mentee=user)
        print(f"Booking found: {booking.id}, Current status: {booking.status}")
        
        # Update status menjadi PAID
        booking.status = 'paid'
        booking.save()
        
        print(f"Booking {booking_id} updated to PAID")
        
        return Response({
            'success': True,
            'message': 'Pembayaran berhasil!',
            'booking_id': booking.id,
            'status': booking.status
        })
        
    except Booking.DoesNotExist:
        print(f"Booking {booking_id} not found for user {user.username}")
        return Response({'error': 'Booking tidak ditemukan'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error: {str(e)}")
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)