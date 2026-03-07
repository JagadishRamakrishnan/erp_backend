import noteService from '../service/note.service.js';
import { successResponse, errorResponse } from '../../../responseHelper.js';

class NoteController {
  async create(req, res) {
    try {
      req.body.created_by = req.user.id;
      const note = await noteService.createNote(req.body);
      return successResponse(res, note, 'Note created successfully', 201);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getAll(req, res) {
    try {
      const notes = await noteService.getAllNotes(req.query);
      return successResponse(res, notes);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async getById(req, res) {
    try {
      const note = await noteService.getNoteById(req.params.id);
      if (!note) return errorResponse(res, 'Note not found', 404);
      return successResponse(res, note);
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async update(req, res) {
    try {
      const note = await noteService.updateNote(req.params.id, req.body);
      if (!note) return errorResponse(res, 'Note not found', 404);
      return successResponse(res, note, 'Note updated successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }

  async delete(req, res) {
    try {
      const result = await noteService.deleteNote(req.params.id);
      if (!result) return errorResponse(res, 'Note not found', 404);
      return successResponse(res, null, 'Note deleted successfully');
    } catch (error) {
      return errorResponse(res, error.message);
    }
  }
}

export default new NoteController();
