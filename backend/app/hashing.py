from passlib.context import CryptContext

passwordContext=CryptContext(schemes=["bcrypt"],deprecated="auto")
class Hash():
    def bcrypt(password:str):
        return passwordContext.hash(password)
    def verify(hashedPassword,plainPassword):
        return passwordContext.verify(plainPassword,hashedPassword)
    