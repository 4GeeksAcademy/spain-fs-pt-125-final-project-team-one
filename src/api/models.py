from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(String(120), nullable=False)
    last_name: Mapped[str] = mapped_column(String(120), nullable=False)
    favorites_array: Mapped[list[int]] = mapped_column(nullable=True)
    cash: Mapped[int] = mapped_column(nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean(), nullable=False)
    portfolio: Mapped[Portfolio]=relationship(back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "last_name":self.last_name,
            "favourites":self.favorites_array,
            "is_active": self.is_active
            # do not serialize the password, its a security breach
        }

class Portfolio(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"))
    user: Mapped[User]=relationship(back_populates="portfolio")
    product: Mapped[int]=mapped_column(nullable=False)
    date: Mapped[Date] = mapped_column(nullable=False)

    def serialize(self):
        return{
            "id":self.id,
            "user_id":self.id,
            "product":self.product,
            "date":self.date
        }
