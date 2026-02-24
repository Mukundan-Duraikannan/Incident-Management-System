from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import getdb
from models.notification import Notification

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/{user_id}")
def get_notifications(user_id: int, db: Session = Depends(getdb)):

    notifications = db.query(Notification).filter(
        Notification.user_id == user_id).order_by(Notification.created_at.desc()).all()

    return notifications


@router.put("/{notification_id}/read")
def mark_as_read(notification_id: int, db: Session = Depends(getdb)):

    notification = db.query(Notification).filter(
        Notification.id == notification_id).first()

    if not notification:
        raise HTTPException(404, "Notification not found")

    notification.is_read = True
    db.commit()

    return {"message": "Notification marked as read"}


@router.delete("/{notification_id}")
def delete_notification(notification_id: int, db: Session = Depends(getdb)):

    notification = db.query(Notification).filter(
        Notification.id == notification_id).first()

    if not notification:
        raise HTTPException(404, "Notification not found")

    db.delete(notification)
    db.commit()

    return {"message": "Notification deleted successfully"}
