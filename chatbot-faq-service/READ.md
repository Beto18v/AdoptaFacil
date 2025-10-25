# verificar si esta venv con = dir

# si no esta installar con =  python -m venv venv        lo cual es el entorno de python

# despues correr esto = .\venv\Scripts\activate  para acativar venv

# despues instalamos las dependencias con = pip install -r requirements.txt 

# si da error de servidor correr este comando para forzar que se corra en un puerto que no se este usando

# python -m uvicorn app.main:app --reload --port 8001