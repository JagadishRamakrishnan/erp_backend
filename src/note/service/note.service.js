import Note from '../models/note.model.js';
import User from '../../user/models/user.model.js';

class NoteService {
  async createNote(noteData) {
    return await Note.create(noteData);
  }

  async getAllNotes(filters = {}) {
    const where = {};
    if (filters.related_type) where.related_type = filters.related_type;
    if (filters.related_id) where.related_id = filters.related_id;

    return await Note.findAll({
      where,
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  async getNoteById(id) {
    return await Note.findByPk(id, {
      include: [
        { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
      ]
    });
  }

  async updateNote(id, noteData) {
    const note = await Note.findByPk(id);
    if (!note) return null;
    return await note.update(noteData);
  }

  async deleteNote(id) {
    const note = await Note.findByPk(id);
    if (!note) return null;
    await note.destroy();
    return true;
  }
}

export default new NoteService();
