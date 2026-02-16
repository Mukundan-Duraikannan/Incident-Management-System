from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app import models, schemas
from sqlalchemy import func
from app.token import get_current_user
from app.models.ticket import Ticket
from app.schemas import ticket as schemas
from app.schemas.ticket import TicketUpdate
from fastapi import HTTPException
from sqlalchemy import func
router = APIRouter(prefix="/tickets", tags=["Tickets"])

@router.post("/raise-ticket", response_model=schemas.TicketResponse)
def create_ticket(ticket: schemas.TicketCreate,db: Session = Depends(get_db),current_user: dict = Depends(get_current_user)):
    new_ticket = Ticket(email=current_user,project_title=ticket.project_title,issue=ticket.issue,description=ticket.description,
        category=ticket.category,status="created",created_at=datetime.utcnow())
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    return new_ticket
@router.get("/view")
def view_tickets(db: Session = Depends(get_db)):
    tickets = db.query(Ticket).all()
    return tickets

@router.get("/search/{field}/{value}")
def search_tickets(field: str, value: str, db: Session = Depends(get_db)):
    field = field.lower()
    if field == "id":
        tickets = db.query(Ticket).filter(Ticket.id == int(value)).all()
    elif field == "email":
        tickets = db.query(Ticket).filter(func.lower(Ticket.email).contains(value.lower())).all()
    elif field == "project_title":
        tickets = db.query(Ticket).filter(func.lower(Ticket.project_title).contains(value.lower())).all()
    elif field == "issue":
        tickets = db.query(Ticket).filter(func.lower(Ticket.issue).contains(value.lower())).all()
    elif field == "category":
        tickets = db.query(Ticket).filter(func.lower(Ticket.category).contains(value.lower())).all()
    elif field == "status":
        tickets = db.query(Ticket).filter(func.lower(Ticket.status).contains(value.lower())).all()
    elif field == "created_at":
        try:
            search_date = datetime.strptime(value, "%d %b %Y").date()
            tickets = db.query(Ticket).filter(func.date(Ticket.created_at) == search_date).all()
        except ValueError:
            raise HTTPException(status_code=400,detail="Date must be in format: 10 Feb 2026")
    else:
        raise HTTPException(status_code=400, detail="Invalid search field")
    return tickets

@router.put("/update/{id}")
def update_ticket(id: int,ticket: TicketUpdate,db: Session = Depends(get_db)):
    db_ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    for field, value in ticket.dict(exclude_unset=True).items():
        setattr(db_ticket, field, value)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.delete("/delete/{id}")
def delete_ticket(id: int, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    db.delete(ticket)
    db.commit()
    return {"message": "Ticket deleted successfully"}





