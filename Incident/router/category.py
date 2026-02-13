from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import getdb
from models.category import Category
from models.user import User
from schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.post("/", response_model=CategoryResponse)
def create_category(request: CategoryCreate, admin_id: int, db: Session = Depends(getdb)):
    admin = db.query(User).filter(User.id == admin_id).first()
    if not admin or admin.role != "Admin":
        raise HTTPException(403, "Only admin can create category")

    existing = db.query(Category).filter(Category.name == request.name).first()
    if existing:
        raise HTTPException(400, "Category already exists")
    category = Category(name=request.name)
    db.add(category)
    db.commit()
    db.refresh(category)

    return category


@router.get("/", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(getdb)):
    categories = db.query(Category).all()
    return categories


@router.put("/{id}", response_model=CategoryResponse)
def update_category(id: int, request: CategoryUpdate, admin_id: int, db: Session = Depends(getdb)):
    admin = db.query(User).filter(User.id == admin_id).first()
    if not admin or admin.role != "Admin":
        raise HTTPException(403, "Only admin can update category")
    category = db.query(Category).filter(Category.id == id).first()
    if not category:
        raise HTTPException(404, "Category not found")
    category.name = request.name
    db.commit()
    db.refresh(category)

    return category


@router.delete("/{id}")
def delete_category(id: int, admin_id: int, db: Session = Depends(getdb)):
    admin = db.query(User).filter(User.id == admin_id).first()
    if not admin or admin.role != "Admin":
        raise HTTPException(403, "Only admin can delete category")
    category = db.query(Category).filter(Category.id == id).first()
    if not category:
        raise HTTPException(404, "Category not found")
    db.delete(category)
    db.commit()

    return {"message": "Category deleted successfully"}
