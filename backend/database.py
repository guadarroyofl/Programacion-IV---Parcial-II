from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# El archivo kiosco.db se crea solo, al lado de main.py, la primera vez que arranca la API.
DATABASE_URL = "sqlite:///./kiosco.db"

# check_same_thread=False: FastAPI atiende cada request en un hilo distinto,
# y SQLite, por defecto, no lo permite.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Abre una sesión de base de datos por request y la cierra al terminar."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()