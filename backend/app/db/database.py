from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# PostgreSQL-Verbindungsstring
# Format: postgresql://username:password@host:port/database_name
SQLALCHEMY_DATABASE_URL = "postgresql://postgres:password@localhost/magic_frog"

# Engine erstellen
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# SessionLocal-Klasse erstellen
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base-Klasse für Modelle
Base = declarative_base()
