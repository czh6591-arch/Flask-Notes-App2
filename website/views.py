from flask import Blueprint, render_template, request, flash, jsonify, send_file
from flask_login import login_required, current_user
from .models import Note
from . import db
import json
import io
from datetime import datetime

views = Blueprint('views', __name__)


# decorates the function to handle requests to the root URL (/)
@views.route('/', methods=['GET', 'POST'])
@login_required
# defines a function that returns HTML content
def home():
    if request.method == 'POST':
        note = request.form.get('note')
        title = request.form.get('title', 'Untitled')

        if len(note) < 1:
            flash('Note is too short', category='error')
        else:
            new_note = Note(title=title, data=note, user_id=current_user.id)
            db.session.add(new_note)
            db.session.commit()
            flash('Note added!', category='success')

    return render_template("home.html", user=current_user)


@views.route('/delete-note', methods=['POST'])
def delete_note():
    note = json.loads(request.data)
    noteid = note['noteid']
    note = Note.query.get(noteid)
    if note:
        if note.user_id == current_user.id:
            db.session.delete(note)
            db.session.commit()
    return jsonify({})


@views.route('/update-note', methods=['POST'])
def update_note():
    data = json.loads(request.data)
    noteid = data['noteid']
    new_data = data.get('data')
    new_title = data.get('title')
    
    note = Note.query.get(noteid)
    if note:
        if note.user_id == current_user.id:
            if new_data is not None:
                note.data = new_data
            if new_title is not None:
                note.title = new_title
            db.session.commit()
    return jsonify({})


@views.route('/export-notes', methods=['GET'])
def export_notes():
    notes = Note.query.filter_by(user_id=current_user.id).all()
    
    output = io.StringIO()
    for note in notes:
        output.write(f"{note.title}- {note.data}\n\n")
    
    output.seek(0)
    filename = datetime.now().strftime("%Y%m%d_%H%M%S") + ".txt"
    
    return send_file(
        io.BytesIO(output.getvalue().encode('utf-8')),
        mimetype='text/plain',
        as_attachment=True,
        download_name=filename
    )
