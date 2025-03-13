import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash


app = Flask(__name__)
CORS(app)

# Configuración de base de datos (SQLite)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///usuarios.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Configuración de subida de archivos
UPLOAD_FOLDER = "storage"
ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg", "mp4", "mov", "docx"}
MAX_FILE_SIZE_MB = 50  # Límite de tamaño de archivo en MB

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

db = SQLAlchemy(app)

# Modelo de Usuario
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Modelo para tareas entregadas
class TareaEntregada(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    usuario_email = db.Column(db.String(120), nullable=False)
    topic_id = db.Column(db.String(50), nullable=False)
    filename = db.Column(db.String(200), nullable=False)

# Crear la base de datos
with app.app_context():
    db.create_all()

# Función para validar archivos permitidos
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# Ruta para subir archivos
@app.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "No se envió ningún archivo"}), 400

    file = request.files["file"]
    usuario_email = request.form.get("email")
    topic_id = request.form.get("topic")

    if not usuario_email or not topic_id:
        return jsonify({"error": "Faltan datos de usuario o tema"}), 400

    if file.filename == "":
        return jsonify({"error": "El archivo no tiene nombre"}), 400

    # Verificar la extensión del archivo
    filename = secure_filename(file.filename)
    file_extension = filename.rsplit(".", 1)[1].lower() if "." in filename else ""

    print(f"Archivo recibido: {filename}, Extensión: {file_extension}")

    if file_extension not in ALLOWED_EXTENSIONS:
        return jsonify({"error": f"Tipo de archivo no permitido: {file_extension}"}), 400

    # Validar tamaño del archivo antes de leerlo
    file.seek(0, os.SEEK_END)
    file_size = file.tell()
    file.seek(0)  # Reiniciar la lectura del archivo
    if file_size > MAX_FILE_SIZE_MB * 1024 * 1024:
        return jsonify({"error": "El archivo excede los 50MB"}), 400

    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    # Guardar en la base de datos que el usuario entregó la tarea
    tarea = TareaEntregada(usuario_email=usuario_email, topic_id=topic_id, filename=filename)
    db.session.add(tarea)
    db.session.commit()

    return jsonify({"message": "Archivo subido exitosamente", "filename": filename}), 200


# Ruta para verificar si un usuario ya entregó una tarea
@app.route("/check-submission", methods=["GET"])
def check_submission():
    usuario_email = request.args.get("email")
    topic_id = request.args.get("topic")

    if not usuario_email or not topic_id:
        return jsonify({"error": "Faltan datos de usuario o tema"}), 400

    tarea = TareaEntregada.query.filter_by(usuario_email=usuario_email, topic_id=topic_id).first()
    
    if tarea:
        return jsonify({"submitted": True, "filename": tarea.filename}), 200
    else:
        return jsonify({"submitted": False}), 200

@app.route("/register", methods=["POST"])
def register():
    data = request.json  # Asegurar que los datos llegan en formato JSON
    nombre = data.get("nombre")
    email = data.get("email")
    password = data.get("password")

    if not nombre or not email or not password:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    hashed_password = generate_password_hash(password, method="pbkdf2:sha256")

    nuevo_usuario = Usuario(nombre=nombre, email=email, password=hashed_password)

    try:
        db.session.add(nuevo_usuario)
        db.session.commit()
        return jsonify({"message": "Usuario registrado con éxito"}), 201
    except:
        return jsonify({"error": "El correo ya está registrado"}), 400

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    usuario = Usuario.query.filter_by(email=email).first()

    if usuario and check_password_hash(usuario.password, password):
        return jsonify({
            "message": "Inicio de sesión exitoso",
            "user": {"email": usuario.email, "nombre": usuario.nombre}
        })
    else:
        return jsonify({"error": "Credenciales incorrectas"}), 401


if __name__ == "__main__":
    app.run(debug=True)
